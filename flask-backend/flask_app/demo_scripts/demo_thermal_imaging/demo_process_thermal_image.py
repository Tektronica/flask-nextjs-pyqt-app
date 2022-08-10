# Description:      Fluke Thermal Imager (.IS2 file) reader
# Supported Device: Ti10 instrument
# Credit:           Magnus Andersen
# Citation:         https://www.mathworks.com/matlabcentral/fileexchange/27915-fluke-is2-file-reader

import os
import binascii
import numpy as np
import struct
import matplotlib.pyplot as plt

# from PIL import Image
# Air_Infiltration.is2
# Air_Gap.is2
# Panel.is2
FILE = 'samples/Air_Infiltration.is2'
PARENT_DIRECTORY = os.path.dirname(__file__)
FILEPATH = os.path.join(PARENT_DIRECTORY, FILE)
print('FILEPATH: ', FILEPATH)


def read_uint8(f):
    # b'\xAA' --> 170 --> 1010 1010
    # modulo(toInteger(x), Math.pow(2, 8))
    c1 = struct.unpack('1B', f.read(1))[0] & 255

    return c1


def read_uint16(f, little_endian=True):
    # big-endian
    # https://stackoverflow.com/a/67935622
    # b'\xAA\xAA' --> 43690 --> 1010 1010 1010 1010
    c1 = struct.unpack('1B', f.read(1))[0] & 255
    c2 = struct.unpack('1B', f.read(1))[0] & 255

    if little_endian:
        out = (c1 << 8) | c2
    else:
        out = (c2 << 8) | c1

    return out


def read_uint32(f):
    # b'\xAA\xAA\xAA\xAA' --> 2863311530 --> 1010 1010 1010 1010 1010 1010 1010 1010
    c1 = struct.unpack('1B', f.read(1))[0] & 255
    c2 = struct.unpack('1B', f.read(1))[0] & 255
    c3 = struct.unpack('1B', f.read(1))[0] & 255
    c4 = struct.unpack('1B', f.read(1))[0] & 255

    return (c4 << 24) | (c3 << 16) | (c2 << 8) | c1


def to_uint32(c1, c2, c3, c4):
    # c1, c2, c3, c4 must be uint8 values
    # b'\xAA\xAA\xAA\xAA' --> 2863311530 --> 1010 1010 1010 1010 1010 1010 1010 1010

    return (c4 << 24) | (c3 << 16) | (c2 << 8) | c1


def parseHeader(header):
    # header was read in as uint8, but some values must be cast to 16 or 32 bit values.

    # for item in header[:550]:
    #     print(item)

    # indicates the index of beginning of data -------------------------------------------------------------------------
    reading = 8  # 8
    a = header[reading]  # CameraManufacturer
    b = header[reading + 1]  # CameraModel
    c = header[reading + 2]  # CameraSerial
    d = header[reading + 3]  # EngineSerial
    dataStart = to_uint32(d, c, b, a)  # big-endian
    print(dataStart)

    #

    # dimensions visible image -----------------------------------------------------------------------------------------
    reading = 514  # 514
    a = header[reading]
    b = header[reading + 1]
    visWidth = (a << 8) + b  # uinst16

    reading = 516  # 516
    a = header[reading]
    b = header[reading + 1]
    visHeight = (a << 8) + b  # uinst16

    print('visible image dimensions: ', visWidth, 'x', visHeight)

    # header{5} = fliplr(typecast(header[64:65],'uint8')) # FirmwareVersion
    # daymonth = np.uint8(header[2936])  # day and month
    # print(daymonth)
    # get IR parameters
    # emissivity = np.uint8(header[2940:2941])
    # transmission = header[2942:2943]
    # backgroundtemp = header[2944:2945]

    # # IR image size
    # irh = to_uint32(header[7984:7985])  # 320
    # irw = to_uint32(header[7986:7987])  # 240
    #
    # # visible image size
    # vw = to_uint32(header[2930:2931])  # 640
    # vh = to_uint32(header[2932:2933])  # 480

    print(a, b, c, d)
    # print(emissivity, transmission, backgroundtemp)
    # print(vw, vh, irw, irh)


def read_is2(filepath):
    # https://www.mathworks.com/matlabcentral/answers/374507-when-i-give-a-fluke-ti400-is2-image-as-input-i-am-getting-maximum-variable-size-exceeded-error-in-ma
    # https://www.mathworks.com/matlabcentral/fileexchange/27915-fluke-is2-file-reader
    print('reading is2 file:')

    linecount = 0  # keeps track of where in the file we are. For diagnostics only.

    with open(filepath, mode='rb') as fIN:
        # read header --------------------------------------------------------------------------------------------------
        print(f'\t> reading header from line {linecount}')
        buffer = 1023  # 1023
        header = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            header[idx] = read_uint8(fIN)

        linecount += buffer

        parseHeader(header)

        # reads visible image (16-bit RGB coded 5:6:5) ---------------------------------------------------------
        print(f'\t> reading visual spectrum from line {linecount}')
        vis_dim = (450, 640)  # height, width
        buffer = np.prod(vis_dim)

        vis = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            vis[idx] = read_uint16(fIN, little_endian=False)

        vis = vis.reshape(vis_dim)

        linecount += 2 * buffer

        # remaining pixels (to make it 640x480) seems to be zero-padding -----------------------------------------------
        print(f'\t> reading zero-padding from line {linecount}')
        vis_pad_dim = (30, 640)  # height, width
        buffer = np.prod(vis_pad_dim)

        vis_pad = np.zeros(buffer, dtype=int)

        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            vis_pad[idx] = read_uint16(fIN, little_endian=False)

        vis_pad = vis_pad.reshape(vis_pad_dim)

        linecount += 2 * buffer

        # metadata here ------------------------------------------------------------------------------------------------
        print(f'\t> reading metadata from line {linecount}')
        buffer = 145  # 145
        metadata = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint8 datatype consumes 1 read per conversion
            metadata[idx] = read_uint8(fIN)

        linecount += buffer

        # ir-data 160x120 16-bit picture -------------------------------------------------------------------------------
        print(f'\t> reading IR data from line {linecount}')
        ir_dim = (120, 160)  # height, width
        buffer = np.prod(ir_dim)

        ir = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            ir[idx] = read_uint16(fIN, little_endian=False)

        ir = ir.reshape(ir_dim)

        return vis, ir, header, metadata


def getRGB(vis):
    # converts a 16-bit matrix visible image composed of 5:6:5 bits to an RGB encoded image.
    # was struggling to compute bitwise operations since np.zeros defaults to float. needed to dtype the array
    # https://stackoverflow.com/a/40668146

    rgb = np.zeros((vis.shape[0], vis.shape[1], 3), dtype=int)  # height, width, color

    rgb[:, :, 2] = (vis & 31) << 4  # 5 less significant bits = blue
    rgb[:, :, 1] = ((vis >> 5) & 63) << 3  # 6 middle bits = green
    rgb[:, :, 0] = ((vis >> 11) << 4)  # 5 most significant bits = red

    return rgb


def plotImage(vis, ir, rgb=None):
    if not rgb.any():
        fig, (ax1, ax2) = plt.subplots(nrows=2, ncols=1)
        ax1.imshow(vis)
        ax2.imshow(ir)
    else:
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(nrows=2, ncols=2)

        ax1.imshow(vis, interpolation='kaiser')
        ax2.imshow(rgb, interpolation='kaiser')
        ax3.imshow(ir)
        ax4.imshow(ir)

    fig.suptitle('.is2 thermal image')
    fig.set_tight_layout(True)


if __name__ == "__main__":
    vis, ir, header, metadata = read_is2(FILEPATH)

    rgb = getRGB(vis)

    plotImage(vis, ir, rgb)

    plt.imshow(ir, cmap='hot')
    plt.show()
    print('done!')

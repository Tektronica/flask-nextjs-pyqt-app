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

FILE = 'samples/Air_Gap.is2'
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


def to_uint32(f):
    # b'\xAA\xAA\xAA\xAA' --> 2863311530 --> 1010 1010 1010 1010 1010 1010 1010 1010
    c1 = struct.unpack('1B', f.read(1))[0] & 255
    c2 = struct.unpack('1B', f.read(1))[0] & 255
    c3 = struct.unpack('1B', f.read(1))[0] & 255
    c4 = struct.unpack('1B', f.read(1))[0] & 255

    return (c4 << 24) | (c3 << 16) | (c2 << 8) | c1


def parseHeader(header):
    print(header[88:105])
    a = "".join([chr(item) for item in header[88:105]])  # CameraManufacturer
    b = "".join([chr(item) for item in header[120:130]])  # CameraModel
    c = "".join([chr(item) for item in header[152:170]])  # CameraSerial
    d = "".join([chr(item) for item in header[184:198]])  # EngineSerial
    # header{5} = fliplr(typecast(header[64:65],'uint8')) # FirmwareVersion
    daymonth = np.uint8(header[2936])  # day and month
    print(daymonth)
    # get IR parameters
    emissivity = np.uint8(header[2940:2941])
    transmission = header[2942:2943]
    backgroundtemp = header[2944:2945]

    # # IR image size
    # irh = to_uint32(header[7984:7985])  # 320
    # irw = to_uint32(header[7986:7987])  # 240
    #
    # # visible image size
    # vw = to_uint32(header[2930:2931])  # 640
    # vh = to_uint32(header[2932:2933])  # 480

    print(a, b, c, d)
    print(emissivity, transmission, backgroundtemp)
    # print(vw, vh, irw, irh)


def read_is2(filepath):
    # https://www.mathworks.com/matlabcentral/answers/374507-when-i-give-a-fluke-ti400-is2-image-as-input-i-am-getting-maximum-variable-size-exceeded-error-in-ma
    # https://www.mathworks.com/matlabcentral/fileexchange/27915-fluke-is2-file-reader
    print('reading is2 file:')

    with open(filepath, mode='rb') as fIN:
        # fIN.read(1023)  # null 1023

        # read header --------------------------------------------------------------------------------------------------
        print('\t> reading header')
        buffer = 1023  # 509, 1023 odd numbers 2000 7989

        header = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            header[idx] = read_uint8(fIN)

        # parseHeader(header)

        # visual spectrum image ----------------------------------------------------------------------------------------
        print('\t> reading visual spectrum (640x450)')
        vis_dim = (450, 640)  # height, width
        buffer = np.prod(vis_dim)
        print('\t> vis buffer: ', buffer)

        vis = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            vis[idx] = read_uint16(fIN, little_endian=False)

        vis = vis.reshape(vis_dim)

        # remaining pixels (to make it 640x480) seems to be zero-padding -----------------------------------------------
        print('\t> reading zero-padding')
        vis_pad_dim = (30, 640)  # height, width
        buffer = np.prod(vis_pad_dim)
        print('\t> vis_pad buffer: ', buffer)

        vis_pad = np.zeros(buffer, dtype=int)

        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            vis_pad[idx] = read_uint16(fIN, little_endian=False)

        vis_pad = vis_pad.reshape(vis_pad_dim)

        # 88 bytes of metadata here ------------------------------------------------------------------------------------
        print('\t> reading metadata')
        buffer = 88
        metadata = np.zeros(buffer, dtype=int)
        for idx in range(buffer):
            # uint16 datatype consumes 2 reads per conversion
            metadata[idx] = read_uint8(fIN)

        # Ir-data 160x120 16-bit picture (Is it signed or unsigned?) ---------------------------------------------------
        print('\t> reading IR data (160x120)')
        ir_dim = (120, 160)  # height, width (320 x 240)
        buffer = np.prod(ir_dim)
        print('\t> ir buffer: ', buffer)

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

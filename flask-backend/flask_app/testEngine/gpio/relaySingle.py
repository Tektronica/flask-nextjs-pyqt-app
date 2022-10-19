from flask_app.testEngine.gpio import gpio


# mux object holds a mask of 3-bits to the GPIO for up to 7 relays
class Mux:
    """
    The Mux class is modeled off the operation of the 74HC238 demultiplexer, which implements a 3-to-8 line decoder.
        (A0, A1 and A2) --- 3 binary weighted address inputs decode the output
        (Y0 to Y7) -------- to eight mutually exclusive outputs
        (#E1, #E2 and E3) - three enable inputs

        States:
            output LOW unless #E1 and #E2 are LOW and E3 is HIGH
        ┌──────────────────────────────────┐
        │  ┌───────────┐    ┌───────────┐  │
        │  │           ├────┤           │  │
        │  │           │    │           ├──│── Y0
        │  │           ├────┤           ├──│── Y1
    A0──│──┤  3 TO 8   │    │ ENABLE    ├──│── Y2
        │  │  DECODER  ├────┤ EXITING   ├──│── Y3
    A1──│──┤           │    │           ├──│── Y4
        │  │           ├────┤           ├──│── Y5
    A2──│──┤           │    │           ├──│── Y6
        │  │           ├────┤           ├──│── Y7
        │  │           │    │           │  │
        │  │           ├────┤           │  │
        │  └───────────┘    └───────┬───┘  │
        │        ┌─────┐            │      │
    #E1─│──────◯┤     │            │      │
    #E2─│──────◯┤ AND ├────────────┘      │
    E3──│────────┤     │                   │
        │        └─────┘                   │
        └──────────────────────────────────┘
    """

    def __init__(self, parent, A, EN, type="74hc238", bitWidth=8):
        self.gpio = parent
        self.type = type

        self.input = [A[0].pin, A[1].pin, A[2].pin]  # references only the gpio pin
        self.enableLines = EN  # references only the gpio pin
        self.isEnabled = False

        self.relays = [None] * bitWidth

    def __safeLevelReturn(self, signal):
        try:
            return signal.level
        except AttributeError:
            return signal

    def checkIsEnabled(self):
        E1 = self.__safeLevelReturn(self.enableLines[0])
        E2 = self.__safeLevelReturn(self.enableLines[1])
        E3 = self.__safeLevelReturn(self.enableLines[2])

        if not E1 and not E2 and E3:
            self.isEnabled = True

    def addRelay(self, pos: int):
        newRelay = Relay(self, pos)
        self.relays[pos] = newRelay
        return newRelay

    def write(self, mask):
        # https://sourceforge.net/p/raspberry-gpio-python/wiki/Outputs/

        self.checkIsEnabled()
        if self.isEnabled:
            self.gpio.writeMask(self.input, mask)  # mask is applied to pins
            return True
        else:
            return False


# relay object holds the 3-bit address for the mux it is attached to
class Relay:
    def __init__(self, parent, pos=0):
        self.mux = parent
        self.pos = pos
        binStr = f"{(pos):03b}"  # 3-bit wide position
        self.mask = [int(digit) for digit in binStr]  # 3-bit mask (A, B, C) pertaining to 1 of 7 relays
        self.closed = False  # state=False, Relay contact is open (NC)

    def set(self):
        # turns relay on using 3-bit mask
        closed = self.mux.write(self.mask)
        if closed:
            print(f'Relay in position {self.pos} has been closed')
        else:
            print(f'Relay in position {self.pos} is open')

        self.closed = closed

    def reset(self):
        # turns relay off using 3-bit mask
        # TODO: disable MUX?
        raise NotImplementedError


def demo():
    """
    demo initializes 3 pins to be used to select an active relay using a mux

    Steps:
        1 ..... initialize the Raspberry Pi GPIO
        2 ..... initialize empty gpio bank (array of Nones)
        3 ..... initialize GPIO pin and store in gpio array
    """

    # setup gpio interface on Raspberry Pi
    GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

    # assign pins
    pin15 = GPIO.addPin(pin=15, initial=0, type='OUT')  # A0
    pin29 = GPIO.addPin(pin=29, initial=0, type='OUT')  # A1
    pin31 = GPIO.addPin(pin=31, initial=0, type='OUT')  # A2

    # control lines for demux
    SetRst = GPIO.addPin(pin=13, initial=0, type='OUT')  # SET/RESET
    demuxEN = GPIO.addPin(pin=3, initial=1, type='OUT')  # EN (demux enable)

    # initialize an instance of a mux being used on the board
    mux_row = Mux(parent=GPIO, A=[pin15, pin29, pin31], EN=[SetRst, demuxEN, 1])

    # relays can be assigned from the mux
    k1 = mux_row.addRelay(0)  # relay 1
    k2 = mux_row.addRelay(1)  # relay 2
    k3 = mux_row.addRelay(2)  # relay 3
    k4 = mux_row.addRelay(3)  # relay 4
    k5 = mux_row.addRelay(4)  # relay 5
    k6 = mux_row.addRelay(5)  # relay 6
    k7 = mux_row.addRelay(6)  # relay 7
    k8 = mux_row.addRelay(7)  # relay 8

    # Relays <0..3> will not turn on until SET/RST and demuxEN are LOW
    SetRst.setHigh()
    demuxEN.setHigh()
    k1.set()
    k2.set()
    k3.set()
    k4.set()
    # The remaining relays will open because of level change in SET/RST and demuxEN
    SetRst.setLow()
    demuxEN.setLow()
    k5.set()
    k6.set()
    k7.set()
    k8.set()


if __name__ == "__main__":
    demo()

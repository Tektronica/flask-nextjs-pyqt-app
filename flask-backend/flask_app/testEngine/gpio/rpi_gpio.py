"""

Each GPIO has a bank of pins where each pin is a Relay
https://stackoverflow.com/a/56517057/3382269
https://elinux.org/RPi_BCM2711_GPIOs
https://elinux.org/RPi_GPIO_Code_Samples#RPi.GPIO
https://www.raspberrypi-spy.co.uk/2012/06/simple-guide-to-the-rpi-gpio-header-and-pins/
https://stackoverflow.com/a/67943795/3382269

"""

try:
    import RPi.GPIO as RPiGPIO
except ImportError as e:
    class RPi:
        print(e)

        # https://raspberrypi.stackexchange.com/a/37780
        def __init__(self) -> None:
            self.LOW = 0
            self.HIGH = 1
            self.BOARD = 1
            self.OUT = 1
            self.IN = 1

        def setup(self, *args):
            print('setup:', args)

        def setmode(self, *args):
            print('setmode', args)

        def output(self, *args):
            print('output', args)

        def cleanup(self, *args):
            print('cleanup', args)


    RPiGPIO = RPi()


# a pin object holds its own state (for now)
class Pin:
    def __init__(self, parent, pin=0, type=None):
        # should the pin know itself or only its type?
        self.gpio = parent  # parent (MCU gpio Layer)
        self.pin = pin  # pin number on board
        self.type = type  # string indicates OUTPUT or INPUT
        self.level = 0

    def setHigh(self):
        if self.type == 'OUT':
            self.gpio.writePin(self.pin, "HIGH")
            self.level = 1

    def setLow(self):
        if self.type == 'OUT':
            self.gpio.writePin(self.pin, "LOW")
            self.level = 0

    def read(self):
        if self.type == 'IN':
            raise NotImplementedError


# MCU layer interfacing to the Raspberry Pi
class GPIO:
    io = {"IN": RPiGPIO.IN, "OUT": RPiGPIO.OUT}
    level = {"LOW": RPiGPIO.LOW, "HIGH": RPiGPIO.HIGH}

    def __init__(self, width):
        self.pins = [None] * width
        RPiGPIO.setmode(RPiGPIO.BOARD)

    def addPin(self, pin=0, initial=0, type=""):

        newPin = Pin(self, pin, type)
        self.pins[pin] = newPin

        RPiGPIO.setup(pin, self.io[type])
        return newPin

    def writePin(self, pin, level):
        RPiGPIO.output(pin, self.level[level])

    def writeMask(self, pins, mask):
        # output to several channels at the same time:
        # https://sourceforge.net/p/raspberry-gpio-python/wiki/Outputs/
        RPiGPIO.output(pins, mask)  # mask is applied to pins

    def getPins(self):
        return [pin.pin for pin in self.pins if pin]

    def getPinByType(self, type):
        # need to understand requirements further
        return [pin.pin for pin in self.pins if pin and (pin.type == type)]


def demo():
    # setup gpio interface on Raspbery Pi
    gpio = GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

    # assign pins
    pinA = gpio.addPin(pin=15, type='OUT')  # A
    pinB = gpio.addPin(pin=29, type='OUT')  # B
    pinC = gpio.addPin(pin=31, type='OUT')  # C

    # set individual state of each pin
    pinA.setHigh()
    pinA.setLow()

    # set mask
    gpio.writeMask([pinA.pin, pinB.pin, pinC.pin], [1, 0, 1])


if __name__ == "__main__":
    demo()

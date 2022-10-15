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
except:
    class RPi:
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
        self.parent = parent  # parent (MCU Layer)
        self.pin = pin  # pin number on board
        self.type = type  # string name describes usage of self

    def setHigh(self):
        self.parent.setPinHigh(self.pin)

    def setLow(self):
        self.parent.setPinLow(self.pin)


# MCU layer interfacing to the Raspberry Pi
class GPIO:
    LOW = RPiGPIO.LOW
    HIGH = RPiGPIO.HIGH

    def __init__(self, width):
        self.pins = [None] * width
        RPiGPIO.setmode(RPiGPIO.BOARD)

    def addPin(self, pin=0, output=True, type=None):
        newPin = Pin(self, pin, type)
        self.pins[pin] = newPin

        if output:
            RPiGPIO.setup(pin, RPiGPIO.OUT)
        else:
            RPiGPIO.setup(pin, RPiGPIO.IN)

        return newPin

    def setPinHigh(self, pin):
        RPiGPIO.output(pin, self.HIGH)

    def setPinLow(self, pin):
        RPiGPIO.output(pin, self.LOW)

    def getPins(self):
        return [pin.pin for pin in self.pins if pin]

    def getPinByType(self, type):
        # need to understand requirements further
        return [pin.pin for pin in self.pins if pin and (pin.type == type)]


# relay object hold reference to two pins
class Relay:
    def __init__(self, rowPin=None, colPin=None):
        self.row = rowPin  # row object holds the location of relay along a matrix row
        self.col = colPin  # col object holds the location of relay along a matrix col
        self.state = False  # state=False, Relay contact is open (NC)

    def ON(self):
        # turns relay on
        self.row.setHigh()
        self.col.setHigh()
        self.state = True

    def OFF(self):
        # turns relay off
        self.row.setLow()
        self.col.setLow()
        self.state = False


def demo():
    # setup gpio interface on Raspbery Pi
    gpio = GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

    # misc
    gpio.addPin(pin=3, output=True, type='EN')
    gpio.addPin(pin=13, output=True, type='RESET')

    # relay matrix row
    rowA = gpio.addPin(pin=11, output=True, type='row')
    rowB = gpio.addPin(pin=7, output=True, type='row')
    rowC = gpio.addPin(pin=5, output=True, type='row')

    # relay matrix col
    colA = gpio.addPin(pin=31, output=True, type='col')
    colB = gpio.addPin(pin=29, output=True, type='col')
    colC = gpio.addPin(pin=15, output=True, type='col')

    print(gpio.getPins())

    # setup relays
    relay_k11 = Relay(rowPin=rowA, colPin=colA)
    relay_k12 = Relay(rowPin=rowA, colPin=colA)
    relay_k112 = Relay(rowPin=rowA, colPin=colA)

    relay_k13 = Relay(rowPin=rowA, colPin=colA)
    relay_k14 = Relay(rowPin=rowA, colPin=colA)
    relay_k15 = Relay(rowPin=rowA, colPin=colA)

    relay_k16 = Relay(rowPin=rowA, colPin=colA)
    relay_k17 = Relay(rowPin=rowA, colPin=colA)
    relay_k18 = Relay(rowPin=rowA, colPin=colA)

    relay_k51 = Relay(rowPin=rowA, colPin=colA)
    relay_k52 = Relay(rowPin=rowA, colPin=colA)
    relay_k152 = Relay(rowPin=rowA, colPin=colA)

    relay_k53 = Relay(rowPin=rowA, colPin=colA)
    relay_k54 = Relay(rowPin=rowA, colPin=colA)
    relay_k55 = Relay(rowPin=rowA, colPin=colA)

    relay_k56 = Relay(rowPin=rowA, colPin=colA)
    relay_k57 = Relay(rowPin=rowA, colPin=colA)
    relay_k58 = Relay(rowPin=rowA, colPin=colA)

    relay_k59 = Relay(rowPin=rowA, colPin=colA)
    relay_k159 = Relay(rowPin=rowA, colPin=colA)
    relay_k61 = Relay(rowPin=rowA, colPin=colA)

    relay_k59.ON()
    print('row:', gpio.getPinByType('row'))
    print('col:', gpio.getPinByType('col'))

    # GPIO.output([1,2,3], mask), pins to set, and mask 010

if __name__ == "__main__":
    demo()

from flask_app.testEngine.gpio import gpio
import time


class Mux:
    """
    This is a generic 2D multiplexer
    A (3 x 3) input address matrix can route one of (8 x 8) different outputs

    EN and RST are project specific signals that indicate the following:
        • RST: if the relay is to be reset or not
        • EN: enables writing to the relays (be sure gpio has settled first)
    """

    # Port matrix tracks only pins groups, must set EN manually
    def __init__(self, rowPort, colPort, EN=None, RST=None):
        self.rowPort = rowPort
        self.colPort = colPort
        self.items = []

        self.EN = EN  # pin object
        self.RST = RST  # pin object

    def enable(self):
        """
        temporarily enable MUX bank
        """
        # set EN LOW to enable the MUX bank and write state to Relay group
        print('set EN LOW to enable the MUX bank')
        self.EN.setLow()

        # provide headroom for relay state to settle before disabling MUX bank
        time.sleep(50e-3)  # 50 milliseconds
        print('set EN HIGH to disable the MUX bank')
        self.EN.setHigh()

    def addRelay(self, row, col, name="<no name assigned>"):
        newGroup = Relay(self, row, col, name)
        self.items.append(newGroup)
        return newGroup

    def write(self, row, col, state):
        print(f'set RST {state}')
        self.RST.setLow() if (state == "SET") else self.RST.setHigh()

        self.rowPort.write(row)
        self.colPort.write(col)

        # temporarily enable MUX bank to write state to relays
        self.enable()
        return True


class Relay:
    def __init__(self, parent=None, row=0, col=0, name="<no name assigned>"):
        self.name = name
        self.portMatrix = parent
        self.row = [int(digit) for digit in f"{row :03b}"]  # 3-bit wide position
        self.col = [int(digit) for digit in f"{col :03b}"]  # 3-bit wide position
        self.closed = False

    def set(self):
        if self.portMatrix:
            print('write masks')
            self.portMatrix.write(self.row, self.col, "SET")
            self.closed = True

        return self.closed

    def reset(self):
        if self.portMatrix:
            print('write masks to GPIO')
            self.portMatrix.write(self.row, self.col, "RST")
            self.closed = True

        return self.closed


def demo():
    # setup gpio interface on Raspberry Pi
    GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

    # assign col pins to gpio (pin objects are unused, but can be set individually)
    pin15 = GPIO.addPin(pin=15, initial=0, type='OUT')  # row0
    pin29 = GPIO.addPin(pin=29, initial=0, type='OUT')  # row1
    pin31 = GPIO.addPin(pin=31, initial=0, type='OUT')  # row2

    # assign row pins to gpio  (pin objects are unused, but can be set individually)
    pin05 = GPIO.addPin(pin=5, initial=0, type='OUT')  # col0
    pin07 = GPIO.addPin(pin=7, initial=0, type='OUT')  # col1
    pin11 = GPIO.addPin(pin=11, initial=0, type='OUT')  # col2

    # control lines for demux assigned to gpio
    RST = GPIO.addPin(pin=13, initial=0, type='OUT')  # SET/RESET
    EN = GPIO.addPin(pin=3, initial=1, type='OUT')  # EN (demux enable)

    # assign an arbitrary Port for each gpio pin group
    portCol = GPIO.addPort(width=3, pins=[15, 29, 31])
    portRow = GPIO.addPort(width=3, pins=[5, 7, 11])

    # initialize a demultiplexer class, which dispatches state changes back to gpio
    mux = Mux(rowPort=portRow, colPort=portCol, EN=EN, RST=RST)

    # relays are added to the mux as entries
    k11k12 = mux.addRelay(row=0, col=0, name="k11k12")
    k112k13 = mux.addRelay(row=6, col=0, name="k112k13")
    k14k15 = mux.addRelay(row=1, col=0, name="k14k15")
    k16 = mux.addRelay(row=3, col=0, name="k16")
    k17k18 = mux.addRelay(row=2, col=0, name="k17k18")

    k51k52 = mux.addRelay(row=0, col=4, name="k51k52")
    k152k53 = mux.addRelay(row=6, col=4, name="k152k53")
    k54k55 = mux.addRelay(row=1, col=4, name="k54k55")
    k56 = mux.addRelay(row=3, col=4, name="k56")
    k59 = mux.addRelay(row=2, col=4, name="k59")

    k57k58 = mux.addRelay(row=1, col=5, name="k57k58")
    k159k61 = mux.addRelay(row=6, col=5, name="k159k61")

    # add each relay object to a list for testing
    relayList = [k11k12, k112k13, k14k15, k16, k17k18, k51k52, k152k53, k54k55, k56, k59, k57k58, k159k61]

    # for each relay in list, print its name, set the relay, then reset, and finally print final gpio config
    for group in relayList:
        print()
        print(f'set {group.name}')
        group.set()
        print(f'reset {group.name}')
        group.reset()
        print("pin\tlevel")
        print("-----------")
        for pin in GPIO.getPinLevels():
            print(f"{pin['pin']}\t{pin['level']}")


if __name__ == "__main__":
    demo()

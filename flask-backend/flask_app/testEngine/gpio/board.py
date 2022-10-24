from flask_app.testEngine.gpio import gpio
import time
import unittest


class Mux2D:
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

        self.RST = RST  # this pin sets state of the relay
        self.EN = EN  # this pin is set LOW to set relays once PORT mask and RST are written

    def enable(self):
        """
        temporarily enable MUX bank
        """
        # set EN LOW to enable the MUX bank and write state to Relay group
        print('set EN LOW to enable the MUX bank')
        self.EN.setLow()

        # provide headroom for relay state to settle before disabling MUX bank
        time.sleep(1)  # 1 seconds
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


class TestGPIO(unittest.TestCase):
    def test_addPin(self):
        """
        A pin is assigned to the GPIO
        The test verifies the proper assignment and writing of this pin
        """
        print("\nTest 1: Adding a pin")
        GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

        pin = 6
        newPinObj = GPIO.addPin(pin=pin, initial="HIGH", type='OUT')
        newPinObj.setHigh()

        self.assertEqual(GPIO.readPin(pin), 1, "wrong pin level was assigned")

    def test_addPort(self):
        """
        A port is assigned pins which have not been initialized.
        The test verifies the proper assignment and masking of these pins
        """
        print("\nTest 2: Adding a port")
        GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

        pins = [15, 29, 31]
        mask = [1, 0, 1]

        newPortObj = GPIO.addPort(width=3, pins=pins)
        newPortObj.write(mask)
        self.assertEqual(GPIO.readMask(pins), mask, "wrong pins were assigned to port")

    def test_addRelay(self):
        print("\nTest 3: Adding a relay")
        GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

        row = [5, 7, 11]
        col = [15, 29, 31]

        relayRow = [int(digit) for digit in f"{6 :03b}"]  # row 6 ... [1, 1, 0]
        relayCol = [int(digit) for digit in f"{4 :03b}"]  # col 4 ... [1, 0, 0]

        # initialize EN and RST pins
        RST = GPIO.addPin(pin=13, initial="LOW", type='OUT')  # SET/RESET
        EN = GPIO.addPin(pin=3, initial="HIGH", type='OUT')  # EN (demux enable)

        newPortRow = GPIO.addPort(width=3, pins=row)
        newPortCol = GPIO.addPort(width=3, pins=col)

        # initialize a demultiplexer class, which dispatches state changes back to gpio
        mux = Mux2D(rowPort=newPortRow, colPort=newPortCol, EN=EN, RST=RST)

        # relays are added to the mux as entries
        newRelayObj = mux.addRelay(row=6, col=4, name="k0")
        newRelayObj.set()

        self.assertEqual(GPIO.readMask(row), relayRow, "wrong levels written to row port")
        self.assertEqual(GPIO.readMask(col), relayCol, "wrong levels written to column port")


if __name__ == "__main__":
    testGroup = TestGPIO()
    testGroup.run()

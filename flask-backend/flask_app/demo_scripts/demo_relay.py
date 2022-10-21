from flask_app.testEngine.gpio import gpio, board

Mux = board.Mux


def demo():
    # setup gpio interface on Raspberry Pi
    GPIO = gpio.GPIO(40)  # Raspberry Pi 4 board has a GPIO header with 40 pins.

    # assign col pins to gpio
    pin15 = GPIO.addPin(pin=15, initial="LOW", type='OUT')  # row0
    pin29 = GPIO.addPin(pin=29, initial="LOW", type='OUT')  # row1
    pin31 = GPIO.addPin(pin=31, initial="LOW", type='OUT')  # row2

    # assign row pins to gpio
    pin05 = GPIO.addPin(pin=5, initial="LOW", type='OUT')  # col0
    pin07 = GPIO.addPin(pin=7, initial="LOW", type='OUT')  # col1
    pin11 = GPIO.addPin(pin=11, initial="LOW", type='OUT')  # col2

    # control lines for demux assigned to gpio
    RST = GPIO.addPin(pin=13, initial="LOW", type='OUT')  # SET/RESET
    EN = GPIO.addPin(pin=3, initial="HIGH", type='OUT')  # EN (demux enable)

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

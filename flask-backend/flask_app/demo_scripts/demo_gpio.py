# External module imports
import RPi.GPIO as GPIO
import time

# Pin Definitons:
RELAY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]


# Pin Setup:
GPIO.setmode(GPIO.BCM) # Broadcom pin-numbering scheme

def main():

    for pin in RELAY:
        GPIO.setup(pin, GPIO.OUT)  # LED pin set as output
        time.sleep(0.1)
        GPIO.output(pin, GPIO.LOW)  # Initial state for LEDs:


    try:
        loops = 10
        for lap in range(loops):
                for pin in RELAY:
                    GPIO.output(pin, GPIO.HIGH)
                    time.sleep(0.1)
                    GPIO.output(pin, GPIO.LOW)
                    time.sleep(0.1)
        
    except KeyboardInterrupt: # If CTRL+C is pressed, exit cleanly:
        GPIO.cleanup() # cleanup all GPIO

if __name__ == '__main__':
    main()

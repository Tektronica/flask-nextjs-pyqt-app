import pyvisa
import re
import time


class VisaClient:
    def __init__(self, config):
        self.healthy = False
        self.session = None
        self.timeout = 2000

        try:
            self.rm = pyvisa.ResourceManager('@py')
            self.config = config
            self.mode = config['mode']
        except ValueError:
            from textwrap import dedent
            msg = ("\n[ValueError] - Could not locate a VISA implementation. Install either the NI binary or pyvisa-py."
                   "\n\n    PyVISA includes a backend that wraps the National Instruments' VISA library by default.\n"
                   "    PyVISA-py is another such library and can be used for Serial/USB/GPIB/Ethernet\n"
                   "    See NI-VISA Installation:\n"
                   "        > https://pyvisa.readthedocs.io/en/1.8/getting_nivisa.html#getting-nivisa\n")
            print(msg)
            self.healthy = False


    def connect(self, timeout=2000):
        """
        attempts to connect to remote instrument over the selected mode
        returns True if the connection is validated. Otherwise false.
        """
        self.timeout = timeout

        for attempt in range(5):
            self.healthy = True
            try:
                # if mode is LAN:
                if self.mode == 'LAN':
                    # SOCKET is a non-protocol raw TCP connection
                    address = self.config['address']
                    port = self.config['port']
                    self.session = self.rm.open_resource(f'TCPIP0::{address}::{port}::SOCKET', read_termination='\n')
                    self.session.timeout = self.timeout

                # if mode is GPIB:
                elif self.mode == 'GPIB':
                    address = self.config['gpib']
                    self.session = self.rm.open_resource(f'GPIB0::{address}::0::INSTR')

                else:
                    print('No such mode.')

            except pyvisa.VisaIOError as e:
                print(e)
                # https://github.com/pyvisa/pyvisa-py/issues/146#issuecomment-453695057
                if self.mode == 'GPIB':
                    print(f"[attempt {attempt + 1}/5] - retrying connection to {self.config['gpib']}")
                else:
                    print(f"[attempt {attempt + 1}/5] - retrying connection to {self.config['address']}")

                self.healthy = False

            except Exception as e:
                print(e)
                print(f"Could not connect to {self.config['name']} for reasons unknown.")
                return False
            else:
                break

        time.sleep(1)
        # test the open connection
        return self.query('*IDN?')  # {'status': self.healthy, 'data': msg}

    def _byteTest(self):
        # If read_bytes() times out on the first read, it actually means that the instrument did not answer.
        self.session.write('*IDN?')
        time.sleep(1)
        while True:
            try:
                print(self.session.read_bytes(1))
            except pyvisa.VisaIOError as e:
                print(e)
                print('completed first test with failures\n')
                break

            print('completed first test passing\n')

    def InstrumentConnectionFailed(self, info):
        """Raised when attempted connection to instrument has timedout or is unreachable"""
        if info['mode'] in ('LAN', 'SERIAL'):
            print(f"\nCannot reach address {info['address']} over {info['mode']}. Connection timed out.")
        else:
            print(f"\nCannot reach address {info['gpib']} over {info['mode']}. Connection timed out.")

    def info(self):
        return self.config

    def write(self, cmd):
        try:
            self.session.write(f'{cmd}')
            response = f'{cmd} was written.'
            print(response)
            self.healthy = True
            
        except pyvisa.VisaIOError as e:
            print('Could not write to device.')
            response = str(e)
            self.healthy = False
            
        return {'status': self.healthy, 'data': response}

    def read(self):
        try:
            response = None
            if self.mode == 'NIGHTHAWK':
                response = re.sub(r'[\r\n|\r\n|\n]+', '', self.session.read().split("\n")[0].lstrip())
            else:
                response = re.sub(r'[\r\n|\r\n|\n]+', '', self.session.read())
            print(response)
            self.healthy = True

        except pyvisa.VisaIOError as e:
            response = str(e)
            self.healthy = False
        
        return {'status': self.healthy, 'data': response}

    def query(self, cmd):
        try:
            if self.mode == 'NIGHTHAWK':
                response = re.sub(r'[\r\n|\r\n|\n]+', '', self.session.query(f'{cmd}').split("\n")[0].lstrip(' '))
            else:
                response = re.sub(r'[\r\n|\r\n|\n]+', '', self.session.query(f'{cmd}').lstrip(' '))
            print(response)
            self.healthy = True
            
        except pyvisa.VisaIOError as e:
            response = str(e)
            self.healthy = False
        
        return {'status': self.healthy, 'data': response}

    def close(self):
        try:
            self.session.close()
        except AttributeError:
            # If caught, 'VisaClient' object will have no attribute 'INSTR'. Occurs when instrument not initialized.
            if self.config['mode'] in ('LAN', 'SERIAL'):
                print(f"instrument at address {self.config['address']} could not be disconnected.")
                print(f"instrument may not have been found.\n")
            else:
                print(f"instrument at address {self.config['gpib']} could not be disconnected.")


def main():
    """ THIS IS A TEST METHOD FOR THE VISACLIENT CLASS"""

    f5560A_id = {'ip_address': '129.196.136.130', 'port': '3490', 'gpib_address': '', 'mode': 'NIGHTHAWK'}
    f5790A_id = {'ip_address': '', 'port': '', 'gpib_address': '6', 'mode': 'GPIB'}
    k34461A_id = {'ip_address': '10.205.92.63', 'port': '3490', 'gpib_address': '', 'mode': 'INSTR'}
    f8846A_id = {'ip_address': '10.205.92.116', 'port': '3490', 'gpib_address': '', 'mode': 'LAN'}

    f5560A = VisaClient(f5560A_id)
    f5790A = VisaClient(f5790A_id)
    k34461A = VisaClient(k34461A_id)
    f8846A = VisaClient(f8846A_id)

    # COMMUNICATE ------------------------------------------------------------------------------------------------------
    f5560A.write('*RST; EXTGUARD ON')

    f5790A.write(f'*RST; INPUT INPUT2; EXTRIG OFF; HIRES ON; EXTGUARD ON')

    k34461A.write('*RST;CONF:VOLT:DC')
    f8846A.write('*RST;CONF:VOLT:AC')

    f5560A.write('MONITOR OFF')
    print(f"monitor? {f5560A.query('MONITOR?')}")
    f5560A.write('MONITOR ON')
    print(f"monitor? {f5560A.query('MONITOR?')}")

    print(f"Read P7P7: {f5560A.query('read P7P7')}")
    f5560A.write('write P7P7, #hDC')
    print(f"Read P7P7: {f5560A.query('read P7P7')}")

    time.sleep(1)
    f5560A.close()
    f5790A.close()
    k34461A.close()
    f8846A.close()


if __name__ == "__main__":
    main()

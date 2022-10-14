import pyvisa
import re
import time


class VisaClient:
    def __init__(self, config):
        self.healthy = False
        self.session = None
        self.timeout = 2000
        self.logging = False

        self.config = config
        self.mode = config['mode']
        self.resourceName = ''  # VISA resource name maintains the session and class

        try:
            # self.rm = pyvisa.ResourceManager('@py')  # only when pyvisa-py backend is available
            self.rm = pyvisa.ResourceManager()
        except ValueError:
            from textwrap import dedent
            msg = ("\n[ValueError] - Could not locate a VISA implementation. Install either the NI binary or pyvisa-py."
                   "\n\n    PyVISA includes a backend that wraps the National Instruments' VISA library by default.\n"
                   "    PyVISA-py is another such library and can be used for Serial/USB/GPIB/Ethernet\n"
                   "    See NI-VISA Installation:\n"
                   "        > https://pyvisa.readthedocs.io/en/1.8/getting_nivisa.html#getting-nivisa\n")
            self.healthy = False
            raise Exception(msg)

    def log_to_screen(self, logging=True):
        self.logging = logging

    def __log(self, msg, error=False):
        header = '[VISA]'
        if self.logging:
            if error:
                header = '[ERROR]'
        print(f'{header} {msg}')

    def flush(self, session='', mask=16):
        """
        Flush the buffer.
        mask:   designates the buffer to flush. Default value: 16 (0x10)

        https://github.com/pyvisa/pyvisa/issues/535#issuecomment-674452930
        """
        session = (session or self.resourceName)
        self.session.flush(mask=mask)
        self.__log('buffer was flushed.')

    def clear(self):
        """
        Clear the buffer.
        Clear generates a BREAK, which is about 250 mSec long
        The following actions are performed:
            > "flush" (discard) the I/O output buffer
            > send a break
            > flush the I/O input buffer

        https://github.com/pyvisa/pyvisa/issues/535#issuecomment-674452930
        """

        raise NotImplementedError

    def connect(self, timeout=2000):
        """
        attempts to connect to remote instrument over the selected mode
        returns dictionary containing 'status' and 'data' keys.
        """
        self.timeout = timeout
        attempts = 2

        for attempt in range(attempts):
            try:
                """
                >> Ethernet: Use the TCPIP keyword
                    Raw TCP/IP access to port 999 at 1.2.3.4 IP address.
                        >> TCPIP[board]::host address::port::SOCKET
                        >> TCPIP0::1.2.3.4::999::SOCKET

                >> RS232: Use the ASRL keyword to establish communication with an asynchronous serial
                    A serial device attached to interface ASRL1.
                        >> ASRL1::INSTR

                    A serial device attached to port 2 of the ENET Serial controller at address 1.2.3.4.
                        >> ASRL[0]::host address::serial port::INSTR
                        >> ASRL::1.2.3.4::2::INSTR

                >> GPIB: Use the GPIB keyword
                    A GPIB device at primary address 1 and secondary address 0 in GPIB interface 0.
                        >> GPIB[board]::primary address[::secondary address][::INSTR]
                        >> GPIB::1::0::INSTR

                https://www.ni.com/docs/en-US/bundle/ni-visa/page/ni-visa/visaresourcesyntaxandexamples.html
                https://pyvisa.readthedocs.io/en/1.8/tutorial.html#example-for-serial-rs232-device
                """

                address = self.config['address']
                port = self.config['port']

                switch = {
                    'LAN': f'TCPIP0::{address}::{port}::SOCKET',
                    'GPIB': f'GPIB0::{address}::0::INSTR',
                    'RS232': f'ASRL{address}::INSTR',
                }

                # cast as string. If None, be empty string ''
                case = str(self.mode or '')

                # open resource as new session
                try:
                    self.resourceName = switch[case]
                    self.session = self.rm.open_resource(self.resourceName, read_termination='\r\n')
                    self.session.timeout = self.timeout
                    self.healthy = True

                except KeyError as e:
                    self.__log(f'{e} is not a valid mode!', error=True)

                # if the condition is met and passes, test connection
                time.sleep(1)
                # return self.query('*IDN?')  # {'status': self.healthy, 'data': msg}
                return {'status': self.healthy, 'data': 'done'}

            except pyvisa.VisaIOError as e:
                # https://github.com/pyvisa/pyvisa-py/issues/146#issuecomment-453695057
                if self.mode == 'GPIB':
                    self.__log(f"[attempt {attempt + 1}/{attempts}] - retrying connection to {self.config['gpib']}")
                else:
                    self.__log(f"[attempt {attempt + 1}/{attempts}] - retrying connection to {self.config['address']}")
                self.healthy = False

            except Exception as e:
                self.__log(e, error=True)
                self.__log(f"Could not connect to {self.config['name']} for reasons unknown.", error=True)
                self.healthy = False

        return {'status': self.healthy, 'data': 'connection timed out'}

    def disconnect(self):
        try:
            self.session.close()
            self.healthy = True
            msg = f"connection closed for {self.config['name']}"
            self.session = None
            self.__log(msg)

        except pyvisa.VisaIOError as e:
            msg = str(e)
            self.__log(f"attempted to disconnect from {self.config['name']} with failures\n", error=True)
            self.__log(msg)
            self.healthy = False

        return {'status': self.healthy, 'data': msg}

    def _byteTest(self):
        # If read_bytes() times out on the first read, it actually means that the instrument did not answer.
        self.session.write('*IDN?')
        time.sleep(1)
        while True:
            try:
                self.__log(self.session.read_bytes(1))
            except pyvisa.VisaIOError as e:
                self.__log(e)
                self.__log('completed first test with failures\n', error=True)
                break

            self.__log('completed first test passing\n')

    def info(self):
        return self.config

    def handleResponse(self, response):
        if self.mode == 'NIGHTHAWK':
            return re.sub(r'[\r\n|\r\n|\n]+', '', response.split("\n")[0].lstrip())
        else:
            return re.sub(r'[\r\n|\r\n|\n]+', '', response)

    def write(self, cmd):
        try:
            self.session.write(f'{cmd}')
            response = f'{cmd} was written.'
            self.__log(response)
            self.healthy = True

        except pyvisa.VisaIOError as e:
            self.__log('Could not write to device.', error=True)
            response = str(e)
            self.healthy = False

        return {'status': self.healthy, 'data': response}

    def read(self):
        try:
            response = self.handleResponse(self.session.read())
            self.__log(f'Reading from buffer. Response: {response}')
            self.healthy = True
        except pyvisa.VisaIOError as e:
            response = str(e)
            self.healthy = False

        return {'status': self.healthy, 'data': response}

    def query(self, cmd):
        try:
            response = self.handleResponse(self.session.query(f'{cmd}'))
            self.__log(f'{cmd} was queried. Response: {response}')
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
                self.__log(f"instrument at address {self.config['address']} could not be disconnected.")
                self.__log(f"instrument may not have been found.\n")
            else:
                self.__log(f"instrument at address {self.config['gpib']} could not be disconnected.", error=True)


def main():
    """ THIS IS A TEST METHOD FOR THE VISACLIENT CLASS"""
    # COMMUNICATE ------------------------------------------------------------------------------------------------------
    pyvisa.log_to_screen()

    try:
        print('\n[backend] testing pyvisa-py')
        rm = pyvisa.ResourceManager('@py')
    except ValueError as e:
        print('\n[backend] pyvisa-py not install')
        print('[backend] testing visa64')
        print(e)
        rm = pyvisa.ResourceManager('C:\\Windows\\System32\\visa64.dll')

    print(rm)
    print(rm.list_resources())


if __name__ == "__main__":
    main()

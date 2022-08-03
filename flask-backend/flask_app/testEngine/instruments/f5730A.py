from flask_app.testEngine.instruments import VisaClient
import time


########################################################################################################################
class f5730A:

    def __init__(self, config) -> None:
        self.config = config  # each instrument knows its own config
        self.active = False  # each instrument knows its own state
        self.VISA = None

    def newConfig(self, new_config):
        self.config = new_config

    def __wait_for_settling(self):
        settled = False
        while not settled:
            isr = int(self.query("ISR?"))
            settled = bool(isr & 2**12)  # check for SETTLED Bit
            time.sleep(0.1)  # prevent overloading the cmd buffer

    def write(self, arg):
        if self.active:
            print('received: ', arg)
            return self.VISA.write(arg)
        else:
            return {'status': False, 'data': '<not connected>'}

    def read(self):
        if self.active:
            print('reading')
            return self.VISA.read()
        else:
            return {'status': False, 'data': '<not connected>'}

    def query(self, arg):
        if self.active:
            print('received: ', arg)
            return self.VISA.query(arg)
        else:
            return {'status': False, 'data': '<not connected>'}

    def connect(self, timeout=2000):
        if not self.active:
            self.VISA = VisaClient.VisaClient(self.config)  # Instantiate VISA object class
            body = self.VISA.connect(timeout)  # attempt connection to the instrument
            status = body['status']

            if status:
                # connection is good
                self.active = True
                msg = f"{self.config['name']} has connected"
                print(msg)
                return body
            else:
                # something went wrong
                msg = '<SOMETHING WENT WRONG>'
                return {'status': False, 'data': msg}
        else:
            # already connected
            msg = f"{self.config['name']} has already connected"
            print(msg)
            return {'status': True, 'data': msg}

    def disconnect(self):
        if self.active:
            time.sleep(1)
            self.write('LOCal')
            body = self.VISA.disconnect()

            if body['status']:
                self.VISA = None
                self.active = False
                print(f"{self.config['name']} has disconnected")
            else:
                print(f"{self.config['name']} failed to disconnect")

            return body
        else:
            msg = f"{self.config['name']} was not connected"
            print(msg)
            return {'status': True, 'data': msg}

    def getInfo(self):
        idn = self.query('*IDN?')['data'].split(',')
        modelnum = idn[1]
        serialnum = idn[2]
        enetADDR = self.query('IPADDR?')['data']
        portnum = self.query('ENETPORT?')['data']
        gpibADDR = self.query('ADDR?')['data']
        eol = self.query('EOL? ENET')['data']
        calDate = self.query('CAL_DATE? CAL')['data']
        zero = self.query('CAL_DATE? ZERO')['data']

        msg = {'model': modelnum, 'serial': serialnum, 'caldate': calDate, 'zero': zero, 'enet': enetADDR,
               'port': portnum, 'eol': eol, 'gpib': gpibADDR}

        return {'status': True, 'data': msg}

    def setup_f5730A_source(self):
        self.write('*RST')
        time.sleep(1)
        self.write('REM_MODE SERIAL, COMP')
        self.write('REM_MODE ENET, TERM')
        self.write('^C')
        time.sleep(0.5)

    def run_f5730A_source(self, mode, rms, Ft):
        try:
            if mode in ("a", "A"):
                self.write(f'\nout {rms}A, {Ft}Hz')
                time.sleep(2)
                print(f'[5730A command] out: {rms}A, {Ft}Hz')

            elif mode in ("v", "V"):
                self.write(f'\nout {rms}V, {Ft}Hz')
                time.sleep(2)
                print(f'\nout: {rms}V, {Ft}Hz')

            else:
                raise ValueError("Invalid mode selected. Specify units 'V' or 'A'.")
            time.sleep(1)

            self.write('oper')
            time.sleep(5)
        except ValueError:
            raise

    def standby_f5730A(self):
        time.sleep(1)
        self.write('STBY')
        self.write('*WAI')
        time.sleep(1)


# Run
if __name__ == "__main__":
    mode, rms, Ft = 'A', 120e-3, 1000
    config = {'f5730A': {'address': '129.196.136.130', 'port': '3490', 'gpib': '6', 'mode': 'LAN'}}

    instr = f5730A()
    instr.connect(config)
    instr.setup_f5730A_source()

    instr.run_f5730A_source(mode, rms, Ft)
    time.sleep(5)
    instr.close_f5730A()

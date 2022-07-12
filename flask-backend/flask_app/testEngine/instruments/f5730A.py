from flask_app.testEngine.instruments import VisaClient
import time

########################################################################################################################
class f5730A:

    def __init__(self, config) -> None:
        self.config = config  # each instrument knows its own config
        self.active = False  # each instrument knows its own state
        self.VISA = None

    def connect(self):
        if not self.active:
            self.VISA = VisaClient.VisaClient(self.config)  # Fluke 5730A
            print(f"{self.config['name']} has connected")
            self.active = True
            return True
        else:
            print(f"{self.config['name']} has already connected")
            return True

    def _testConnection(self):
        if self.f5730A.healthy:
            self.f5730A_IDN = self.query('*IDN?')
            return True
        else:
            print('[X] Unable to connect to the Fluke 5730A. Check software configuration, ensure instrument is'
                  '\nconnected properly or not being used by another remote session. Consider power cycling the '
                  '\nsuspected instrument\n')
            return False

    def disconnect(self):
        if self.active:
            time.sleep(1)
            self.f5730A.write('LOCal')
            self.f5730A.close()
            print(f"{self.config['name']} has disconnected")
            self.VISA = None
            self.active = False
            return True
        else:
            print(f"{self.config['name']} was not connected")
            return False
    
    def write(self, arg):
        if self.active:
            print('received: ', arg)
            self.VISA.write(arg)
            return True
        else:
            return '<not connected>'  # not bool. naughty!
    
    def query(self, arg):
        if self.active:
            print('received: ', arg)
            res = self.VISA.query(arg)
            return res
        else:
            return '<not connected>' 

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

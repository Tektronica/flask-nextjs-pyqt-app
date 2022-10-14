from flask_app.testEngine.instruments import VisaClient
import time
import numpy as np
import datetime

COMM = 3


########################################################################################################################
class f2635A:

    def __init__(self, config) -> None:
        self.config = config  # each instrument knows its own config
        self.active = False  # each instrument knows its own state
        self.VISA = None
        self.remote = False
        self.logging = False  # instrument operation is logged

    def newConfig(self, new_config):
        self.config = new_config

    def log_to_screen(self, logging=True):
        self.logging = logging
        self.VISA.log_to_screen(logging=True)

    def __log(self, msg, newline=False, error=False):
        nl = ((newline and '\n') or '')
        header = '[f2638A]'
        if self.logging:
            if error:
                header = '[ERROR]'
        print(f'{nl}{header} {msg}')

    def connect(self, timeout=2000):
        # bAUd = 9600, PAR = no, CtS = OFF, and Echo = off

        if not self.active:
            self.VISA = VisaClient.VisaClient(self.config)  # Instantiate VISA object class
            body = self.VISA.connect(timeout)  # attempt connection to the instrument
            status = body['status']

            if status:
                # connection is good
                self.active = True
                time.sleep(2)
                # turn off echo
                self.echo(on=False)

                msg = f"{self.config['name']} has connected"
                self.__log(msg)
                return body
            else:
                # something went wrong
                return body
        else:
            # already connected
            msg = f"{self.config['name']} has already connected"
            self.__log(msg)
            return {'status': True, 'data': msg}

    def disconnect(self):
        if self.active:
            time.sleep(1)
            body = self.VISA.disconnect()

            if body['status']:
                self.VISA = None
                self.active = False
                self.__log(f"{self.config['name']} has disconnected")
            else:
                self.__log(f"{self.config['name']} failed to disconnect", error=True)

            return body
        else:
            msg = f"{self.config['name']} was not connected"
            self.__log(msg)
            return {'status': True, 'data': msg}

    def _wait_for_settling(self):
        settled = False

        while not settled:
            # poll the instrument for *OPC? update
            response = self.query("*OPC?")
            data = response['data']

            # try to convert the response to an integer
            try:
                opc = int(data)
                # settled = bool(opc & 2 ** 12)  # check for SETTLED Bit
                settled = bool(opc)
                time.sleep(1)  # prevent overloading the cmd buffer (1ms)
            except TypeError as e:
                # error thrown if the response cannot be cast as int
                self.__log('in handling response as integer!', error=True)
                self.__log(f"Reason: '{response}' is not a value response!")
                # break loop
                break

    def _safeRead(self, cmd, last_response=None):
        """
        checks if error return after sending a command to Hydra
            >>  The instrument outputs alphanumeric character strings in response to a query command

        The possible responses are:
            "=> (CR)(LF)"   (command successful)
            "?> (CR)(LF)"   (command syntax error)
            "!> (CR)(LF)"   (command execution error)

        Good Query:
            |   *IDN?
            |   FLUKE,2635A,0,Mn.n An.n Dn.n Ln.n
            |   =>
        Bad Query:
            |   IDN?
            |   ?>

        :return: json response: {status, data}
        """
        # retrieve characters from the buffer
        response = self.VISA.read()
        status = response['status']
        data = response['data']

        switch = {
            '=>': {'status': True, 'data': f'"{cmd}" command was successful!'},
            '?>': {'status': False, 'data': f'syntax error in "{cmd}" command!'},
            '!>': {'status': False, 'data': f'Execution error in "{cmd}" command!'}
        }

        # cast as string. If None, be empty string ''
        test = str(data or '')

        # test the response
        if test in switch.keys():
            """
            1. identifies the appropriate status based on a command execution symbol
            2. command execution symbol: { '=>', '?>', '!>' }
            """
            symbolType = switch[test]
            self.__log(symbolType['data'])
            response['status'] = symbolType['status']
            return last_response or response

        elif last_response:
            """
            1. protects against deep recursion when a prior response was passed
            2. caught on second call to _safeRead() or first call if user has passed a last_response argument
            """
            self.__log(f'Unable to find the execution status for {cmd}.')
            return last_response

        elif not status:
            """
            1. protects against deep recursion if VISA returns a false status
            2. caught on first call to _safeRead() if VISA encounters error
            """
            self.__log(f'VISA encountered an error. Returning.', error=True)
            return response

        else:
            """
            1. recursive call where this response is assigned as last response
            2. occurs in good queries where the first response is the returned query data
            3. recursive call reads the buffer once more to get the command execution symbol
            """
            self.__log(f'Reading next line in buffer. Did not find execution status in {data}.')
            return self._safeRead(cmd=cmd, last_response=response)

    def write(self, cmd):
        self.__log(f'writing {cmd}', newline=True)
        if self.active:
            cmdWrite = self.VISA.write(cmd)
            safeRead = self._safeRead(cmd=cmd)

            # wait for settle whenever command is written to instrument
            self._wait_for_settling()

            return safeRead
        else:
            return {'status': False, 'data': '<not connected>'}

    def read(self):
        self.__log(f'performing read.', newline=True)
        if self.active:
            return self.VISA.read()
        else:
            return {'status': False, 'data': '<not connected>'}

    def query(self, cmd):
        self.__log(f'querying {cmd}.', newline=True)
        if self.active:
            self.VISA.write(cmd)
            return self._safeRead(cmd=cmd)
        else:
            return {'status': False, 'data': '<not connected>'}

    @staticmethod
    def formatTimeStamp(timestamp):

        # YYYY, M, D, H, D
        return datetime.datetime(
            year=2000 + timestamp[5],
            month=timestamp[3],
            day=timestamp[4],
            hour=timestamp[0],
            minute=timestamp[1],
            second=timestamp[2]
        )

    def getScanTime(self):
        """
        Example: 7,56,50,7,21,94 (0700 hours, 56 minutes, 50 seconds, on July 21, 1994.)
        :return:
        """
        response = self.query('SCAN_TIME?')
        scan = response['data']
        scanList = [int(x.strip()) for x in scan.split(',')]

        return self.formatTimeStamp(scanList)

    def getTimeDate(self):
        """
        Example: 7,56,50,7,21,94 (0700 hours, 56 minutes, 50 seconds, on July 21, 1994.)
        :return:
        """
        response = self.query('TIME_DATE?')
        t = response['data']  # date stamp
        timeList = [int(x.strip()) for x in t.split(',')]

        return self.formatTimeStamp(timeList)

    def getInfo(self):
        #
        """
        FLUKE,2635A,0,Mn.n An.n Dn.n Ln.n

        Mn.n    identifies the main software version.
        An.n    identifies the analog-to-digital converter software version.
        Dn.n    identifies the display software version.
        Ln.n    identifies the programmable gate-array configuration version

        :return: FLUKE,2635A,0,Mn.n An.n Dn.n Ln.n
        """
        idn = self.query('*IDN?')['data'].split(',')
        modelNum = idn[1]
        serialNum = idn[2]
        software_version = idn[3]  # Mn.n

        timeDate = self.getTimeDate()

        msg = {
            'model': modelNum,
            'serial': serialNum,
            'version': software_version,
            'timeDate': str(timeDate)
        }
        return {'status': True, 'data': msg}

    def clear(self):
        """
        Clear the buffer.
        Clear generates a BREAK, which is about 250 mSec long
        The following actions are performed:
            > "flush" (discard) the I/O output buffer
            > send a break
            > flush the I/O input buffer
        """
        # self.VISA.clear()
        raise NotImplementedError

    def flush(self, mask=16):
        """
        Flush the buffer.
        mask:   designates the buffer to flush. Default value: 16 (0x10)
        """
        self.VISA.flush(mask=mask)
        time.sleep(1)

    def remoteToggle(self, RWLS=False):
        if not self.remote:
            if not RWLS:
                # Lock the front panel in the REVIEW mode and turn on the REM (remote) annunciator.
                self.write('LOCK 1')
            else:
                # Remote with Lockout (RS-232 only)
                self.write('RWLS')
        else:
            # Unlock the front panel and turn off the REM (remote) annunciator.
            self.write('LOCK 0')

        time.sleep(1)

    def echo(self, on=False):
        """
        Enable/Disable RS-232 Echo Mode
        ECHO <1 0>
            1 = Turn RS-232 echoing on.
            0 = Turn RS-232 echoing off.

        :return: status (boolean)
        """
        response = self.write(f'ECHO {int(on)}')
        status = response['status']
        time.sleep(0.5)
        return status

    def reset(self):
        # Reset (performs a configuration reset)
        self.write('*RST')
        time.sleep(1)

        # flush buffer
        self.flush()

    def deactivate_channel(self, channel=20):
        # deactivates all channels greater than the argument
        self.write(f'FUNC {channel}, OFF')

    def setup_channel(self, channel=1, func='VDC', scale=4):
        # example: sets channel 1 to volts dc with a scale of 4 (300V DC)
        self.write(f'FUNC {channel}, {func}, {scale}')

    def scan(self):
        self.write('*TRG')
        return self.getScanTime()

    def reading(self, channel=1):
        value = self.query(f'LAST? {channel}')
        return value

    def average_reading(self, samples=10, dt=1):
        # dt in ms
        readings = np.zeros(samples)
        freqval = 0.0

        for idx in range(samples):
            readings[idx] = self.reading()
            time.sleep(dt)

        mean = readings.mean()
        std = np.sqrt(np.mean(abs(readings - mean) ** 2))

        return mean, freqval, std


# Run
if __name__ == "__main__":
    config = {'name': 'dmm', 'address': f'{COMM}', 'port': '3490', 'gpib': '6', 'mode': 'RS232'}

    # 1. connect to instruments
    print('\n[STEP 1] connect to meter')
    instr = f2635A(config)
    res = instr.connect()

    # turn on logging
    instr.log_to_screen()

    if res['status']:
        # 2. meter first setup
        print('\n[STEP 2] setting up meter')
        instr.reset()

        # 3. Get device info
        info = instr.getInfo()
        print(info)

        print('\n[STEP 3] test command execution')
        print('[TEST] first test')
        print(instr.query('*IDN?'))

        print('\n[TEST] second test')
        print(instr.query('IDN?'))

        print('\n[TEST] third test (pass None to _safeRead())')
        print(instr._safeRead(cmd='None'))

        print('\n[STEP 4] disconnect meter')
        instr.disconnect()
    else:
        print('\n[ERROR] program failed!')
        print(f"Reason: {res['data']}")

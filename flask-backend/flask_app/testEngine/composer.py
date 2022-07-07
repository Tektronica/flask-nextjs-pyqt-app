import pathlib
from flask_app.testEngine.instruments import Roster

########################################################################################################################
FILE = 'config\\instrument_config.yaml'
PARENT_DIRECTORY = pathlib.Path(__file__).parent.resolve()


########################################################################################################################


class Composer:
    def __init__(self) -> None:

        self.roster = Roster(filename=FILE)  # instruments on the roster
        self.orchestra = {}  # instruments seated in the orchestra

        """
        <STATUS>
        BOOLEAN: are their instruments performing?
            > TRUE: yes, and those instruments should be active
            > FALSE: no, and no instruments should be active
        """
        self.status = False
        self._initialize_Instruments()

    def _initialize_Instruments(self):
        """
        each instrument found on the roster has a seat in the orchestra
            step 1. initializes instruments found in the config file
            step 2. adds each instrument to a list of Instrument objects
        """
        roster = self.roster.getList()  # list of instruments

        for instrument in roster:
            seat = Instrument(instrument)
            self.orchestra[instrument['name']] = seat

    def getStatus(self):
        # composer checks the state of each instrument (AND operation)
        active = False  # holds the status for whether an instrument is playing
        for seat in self.orchestra:
            if seat.active:
                active = True
                break

        return active

    def getSeat(self, name):
        try:
            seat = self.orchestra[name]
            return seat
        except Exception:
            return None

    def addInstrument(self, config):
        try:
            # add to roster
            self.roster.appendRow(config)
            # seat the instrument in the orchestra
            name = config['name']
            seat = Instrument(config)
            self.orchestra[name] = seat

            return True
        except Exception:
            return False

    def editInstrument(self, config):
        # name changes are not allowed
        try:
            # update the roster
            self.roster.setRowByName(config)

            # update the seated instrument in the orchestra
            name = config['name']
            seat = self.orchestra[name]
            seat.newConfig(config)

            # on success
            return True

        except Exception:
            # on fail
            return False

    def deleteInstrument(self, config):
        try:
            # remove from the roster
            name = config['name']
            self.roster.deleteRowByName(name)

            # throws out the seat in the orchestra
            del self.orchestra[config['name']]

            # on success
            return True
        except Exception:
            # on fail
            return False

    def connectToInstrument(self, name):
        try:
            seat = self.orchestra[name]
            isDone = seat.connect()
            return isDone
        except Exception:
            return False

    def disconnectFromInstrument(self, name):
        try:
            seat = self.orchestra[name]
            seat.disconnect()
            return True
        except Exception:
            return False


class Instrument:
    def __init__(self, config) -> None:
        self.config = config  # each instrument knows its own config
        self.active = False  # each instrument knows its own state

    def newConfig(self, new_config):
        self.config = new_config

    def write(self, arg):
        if self.active:
            print('receieved: ', arg)
            return True
        else:
            return '<not connected>'  # not bool. naughty!

    def read(self):
        if self.active:
            msg = f"reading {self.config['name']}:\nFLUKE,2271A,12345678,1.00"
            return msg
        else:
            return '<not connected>'

    def query(self, arg):
        if self.active:
            print('received: ', arg)
            msg = f"{arg} queried to {self.config['name']}:\nFLUKE,2271A,12345678,1.00"
            return msg
        else:
            return '<not connected>' 

    def connect(self):
        if not self.active:
            print('connected')
            self.active = True
            return True
        else:
            print('already connected')
            return True

    def disconnected(self):
        if self.active:
            print('disconnected')
            self.active = False
            return True
        else:
            print('already disconnected')
            return False


class Performance:
    def __init__(self, seats) -> None:
        # initializes a performance with seats (instruments)
        self.seats = seats
        pass

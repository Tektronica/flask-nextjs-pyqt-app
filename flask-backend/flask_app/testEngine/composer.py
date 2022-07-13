import pathlib
from flask_app.testEngine.roster import Roster
from flask_app.testEngine.instruments.f5730A import f5730A

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
            seat = self._assign_instrument(instrument)
            self.orchestra[instrument['name']] = seat

    def _assign_instrument(self, instrument):
        if instrument['instr'] == 'f5730A':
            seat = f5730A(instrument)
        else:
            seat = None
        print(f"{instrument['name']} has {seat}")
        return seat

    def getStatus(self):
        # composer checks the state of each instrument (AND operation)
        active = False  # holds the status for whether an instrument is playing
        for seat in self.orchestra.values():
            if seat.active:
                active = True
                break

        return active
    
    def getActive(self):
        # returns a list of dictionaries of each active instrument
        activeInstruments = []
        for seat in self.orchestra.values():
            if seat is not None:
                if seat.active:
                    activeInstruments.append(seat.config)
                
        return activeInstruments
    
    def getInactive(self):
        # returns a list of dictionaries of each active instrument
        inactiveInstruments = []
        for seat in self.orchestra.values():
            if seat is None:
                if not seat.active:
                    inactiveInstruments.append(seat.config)

        return inactiveInstruments

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
            seat = self._assign_instrument(config)
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

    def connectToInstrument(self, name, timeout=2000):
        try:
            seat = self.orchestra[name]
            if seat is not None:
                return seat.connect(timeout)
            else:
                return {'status': False, 'data': '<Invalid Instrument>'}
        except AttributeError as e:
            print(e)
            return {'status': False, 'data': '<Could not Connect>'}
        except Exception as e:
            print(e)
            return {'status': False, 'data': 'name does not exist!'}

    def disconnectFromInstrument(self, name):
        try:
            seat = self.orchestra[name]
            return seat.disconnect()
        except Exception:
            return {'status': False, 'data': ''}


class Performance:
    def __init__(self, seats) -> None:
        # initializes a performance with seats (instruments)
        self.seats = seats
        pass

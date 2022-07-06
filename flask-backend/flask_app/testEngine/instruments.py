import yaml
import os
import platform
import pandas as pd

########################################################################################################################
FILE = 'instrument_config.yaml'


class Instruments:
    def __init__(self, filename=FILE) -> None:
        self.filename = filename
        self.instrList = [{}]
        self.instrPandas = None

        self.empty = {
            '0': {'name': "", 'instr': "", 'mode': "", 'address': "", 'port': "", 'gpib': ""},
            '1': {'name': "", 'instr': "", 'mode': "", 'address': "", 'port': "", 'gpib': ""}
        }

        # check file exists
        self.validated = self._isPathValid()

        # read config
        self._getInstruments()

    def _isPathValid(self):
        if not os.path.exists(self.filename):
            if platform.release() in ('Linux', 'Darwin'):
                os.mknod(self.filename)
            else:
                # create empty config if one does not exist
                with open(os.path.join('', self.filename), 'w') as fp:
                    pass

            return self._clearConfig()

        return True

    def _unpackStream(self):
        # on success, return data frame
        try:
            with open(self.filename, 'r', encoding='utf-8') as stream:
                self.instrList = yaml.safe_load(stream)

            self.instrDF = pd.DataFrame(self.instrList)
            return self.instrDF

        except yaml.YAMLError as exc:
            print(exc)

    def _getInstruments(self):
        # returns pandas DataFrame
        if self.validated:
            if os.path.exists(self.filename):
                return self._unpackStream()
            else:
                pass

    def _clearConfig(self):
        # clears the config file and replaces with an empty
        if self.validated:
            with open(self.empty, 'w') as f:
                yaml.dump(instr, f, sort_keys=False)
            return True
        else:
            return False

    def update(self):
        # only really should be used when the file has been manually edited
        self._getInstruments()

    def getInstrByName(self, name):
        # search for specific instrument config by name
        # https://stackoverflow.com/a/17071908
        print(self.instrDF)
        print(name)
        config = self.instrDF.loc[self.instrDF['name'] == name]

        # TODO: handle empty returns

        return config

    def getDataFrame(self):
        # return instruments as a pandas DataFrame
        return self.instrDF

    def getList(self):
        # returns instruments as a list of dictionaries
        return self.instrList

    def getJSON(self):
        # returns instruments as a list of dictionaries
        return self.instrDF.to_json()

    def _add(self, instr):
        # adds new entry to the list of dictionaries. usually called after a save.
        return self.instrList.append(instr)

    def push_New_Instrument(self, instr):
        # add new instrument entry to config file
        if self.validated:
            with open(FILE, 'w') as f:
                yaml.dump(instr, f, sort_keys=False)
                self._add(instr)
            return True
        else:
            return False

    def clear_and_push(self, instr):
        # clears the config file and pushes all new data
        if self.validated:
            with open(FILE, 'w') as f:
                yaml.dump(instr, f, sort_keys=False)
            return True
        else:
            return False


if __name__ == "__main__":
    instr = Instruments()

    print('list:\n', instr.getList(), '\n')
    print('DataFrame:\n', instr.getDataFrame(), '\n')
    print('JSON:\n', instr.getJSON(), '\n')

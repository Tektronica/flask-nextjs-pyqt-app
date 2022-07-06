import time


########################################################################################################################

class DUT:
    def __init__(self, config):
        self.config = config

    def connect(self):
        time.sleep(3)
        print('connecting: ', self.config['name'])

    def disconnect(self):
        time.sleep(3)
        return ''

    def write(self, arg):
        print('writing in 3 seconds')
        time.sleep(3)
        return f'{arg}: written'

    def read(self):
        print('sending read in 3 seconds')
        time.sleep(3)
        return 'FLUKE,2271A,12345678,1.00'

    def query(self, arg):
        print('sending query back in 3 seconds')
        time.sleep(3)
        return f'{arg}: FLUKE,2271A,12345678,1.00'

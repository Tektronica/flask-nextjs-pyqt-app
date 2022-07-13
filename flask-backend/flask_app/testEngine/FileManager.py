from os import listdir
from os.path import isfile, join, getmtime
import pathlib


########################################################################################################################

FOLDER = 'history'
PARENT_DIRECTORY = pathlib.Path(__file__).parent.resolve()
DIRECTORY = join(PARENT_DIRECTORY, FOLDER)

def get_history():
    # returns list of file names and date creation
    # [{'name':<>, 'date':<>}, ...]
    
    history = []
    for f in listdir(DIRECTORY):
        if isfile(join(DIRECTORY, f)):
            path = join(DIRECTORY, f)
            date = getmtime(path) 
            history.append({'name': f, 'date': date})

    return history

if __name__ == "__main__":
    print(get_history())
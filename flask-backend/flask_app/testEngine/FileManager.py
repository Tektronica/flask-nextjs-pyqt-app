from os import listdir, remove
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


def download_file(filename):
    filepath = join(DIRECTORY, filename)
    with open(filepath) as fp:
        csv = fp.read()

    return csv


def delete_file(filename):
    filepath = join(DIRECTORY, filename)
    msg = f'{filename} was deleted from history.'
    isDone = False
    try:
        remove(filepath)
        isDone = True
    except Exception as e:
        msg = e
        print(msg)

    return {'status': isDone, 'data': msg}


if __name__ == "__main__":
    print(get_history())

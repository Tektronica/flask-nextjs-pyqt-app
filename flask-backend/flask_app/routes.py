from flask_app import app
from flask import render_template, request, Response
from flask_app.testEngine.composer import Composer
from subprocess import call
from datetime import datetime
from flask_app.pystats import getStats
import flask_app.testEngine.FileManager as FileManager
try:
    import RPi.GPIO as gpio

    test_environment = False
except (ImportError, RuntimeError):
    test_environment = True


# python annotation
# https://stackoverflow.com/a/15073109

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', message='Hello World')


composer = Composer()


@app.route('/stats', methods=['GET'])
def stats():
    stats = getStats()
    return {'data': stats}


@app.route('/instruments', methods=['GET', 'POST', 'DELETE'])
def instrument():
    if request.method == 'GET':
        """
        return information from instrument config

        {
            "data": [
                { ... user dict ... },
                { ... user dict ... },
                ...
            ]
        }
        """
        roster = composer.roster  # list of dictionaries
        instruments = roster.getList()
        return {'data': instruments}

    elif request.method == 'POST':
        # get only active instruments
        data = request.json
        req = data['data']

        if req == 'active':
            instruments = composer.getActive()  # list of dictionaries
        elif req == 'inactive':
            instruments = composer.getInactive()  # list of dictionaries

        return {'data': instruments}


@app.route('/instruments/add', methods=['POST'])
def add_instrument():
    config = request.json
    isDone = composer.addInstrument(config)  # returns True on success
    return {'data': isDone}


@app.route('/instruments/edit', methods=['POST'])
def edit_instrument():
    config = request.json
    isDone = composer.editInstrument(config)  # returns True on success
    return {'data': isDone}


@app.route('/instruments/delete', methods=['POST'])
def delete_instrument():
    config = request.json
    isDone = composer.deleteInstrument(config)  # returns True on success
    return {'data': isDone}


@app.route('/connect', methods=['POST'])
def connect():
    if request.method == 'POST':
        data = request.json
        cmd = data['cmd']
        name = data['name']

        try:
            if cmd == 'connect':
                timeout = int(data['timeout'])
                print('\nconnecting, ', name,
                      'with a timeout of: ', timeout, '\n')
                return composer.connectToInstrument(name, timeout)

            elif cmd == 'disconnect':
                print('disconnecting, ', name)
                return composer.disconnectFromInstrument(name)

        except Exception:
            msg = "No instrument found?"
            print(msg)
            return {'status': False, 'response': msg}


@app.route('/command', methods=['GET', 'POST'])
def command():
    if request.method == 'POST':
        # send a write or query command
        data = request.json
        name = data['name']
        cmd = data['cmd']
        arg = data['arg']

        print('requested command to instrument from client')

        if cmd == 'write':
            print('write cmd: ', arg, ' to ', name)
            return composer.getSeat(name).write(arg)

        elif cmd == 'read':
            print('read cmd to: ', name)
            return composer.getSeat(name).read()

        elif cmd == 'query':
            print('query cmd: ', arg, ' to ', name)
            return composer.getSeat(name).query(arg)

    # else POST Error 405 Method Not Allowed


@app.route('/history', methods=['GET', 'POST'])
def history():
    if request.method == 'GET':
        history = FileManager.get_history()
        status = True
        return {'status': status, 'data': history}

    if request.method == 'POST':
        data = request.json
        filename = data['name'] + '.csv'
        cmd = data['cmd']

        if cmd == 'download':
            print(f'server: preparing {filename} for download.')
            csv = FileManager.download_file(filename)

            return Response(
                csv,
                mimetype="text/csv",
                headers={"Content-disposition":
                         f"attachment; filename={filename}"
                         }
            )

        if cmd == 'delete':
            print(f'server: deleting {filename} from history.')
            status = FileManager.delete_file(filename)
            history = FileManager.get_history()
            return {'status': True, 'data': history}


@app.route('/time')
def get_current_time():
    timestamp = datetime.now().strftime("%H:%M:%S")

    return {'time': timestamp}


@app.route('/rpi', methods=['POST'])
def rpi():
    timestamp = datetime.now().strftime("%H:%M:%S")
    data = request.json
    cmd = data['data']
    if request.method == 'POST':
        # TODO: we don't want these to execute outside of raspbian
        if cmd == 'reboot':
            print('reboot')
            # call("sudo reboot -f", shell=True)
        elif cmd == 'shutdown':
            print('shutdown')
            # call("sudo shutdown -r now", shell=True)

    return {'time': timestamp}

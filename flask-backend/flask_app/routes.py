from flask_app import app
from flask import render_template, request
from flask_app.testEngine.composer import Composer
from subprocess import call
from datetime import datetime

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
        """
        modify/update the information for instrument config by <id>
        """
        data = request.json
        id = data['id']
        print(data)
        print(data['id'])
        if id == -1:
            print('adding new instrument')
        if id > -1:
            print('modifying existing instrument at location: ', id)

        roster = composer.roster  # list of dictionaries
        return {'data': roster}

    elif request.method == 'DELETE':
        """
        delete entry in instrument by <id>
        """
        roster = composer.roster  # list of dictionaries
        return {'data': roster}

    else:
        # POST Error 405 Method Not Allowed
        pass


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
        isDone = False
        try:
            if cmd == 'connect':
                timeout = data['timeout']
                print('\nconnecting, ', name, 'with a timeout of: ', timeout, '\n')
                isDone = composer.connectToInstrument(name)

            elif cmd == 'disconnect':
                print('disconnecting, ', name)
                isDone = composer.disconnectFromInstrument(name)

            return {'data': isDone}

        except Exception:
            print("No instrument found?")
            return {'data': False}


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
            msg = composer.getSeat(name).write(arg)
            res = {'data': msg}
            return res

        elif cmd == 'read':
            print('read cmd to: ', name)
            msg = composer.getSeat(name).read()
            res = {'data': msg}
            return res

        elif cmd == 'query':
            print('query cmd: ', arg, ' to ', name)
            msg = composer.getSeat(name).query(arg)
            res = {'data': msg}
            return res

    # else POST Error 405 Method Not Allowed


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

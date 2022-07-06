from flask_app import app
from flask_app.testEngine.instruments import Instruments
from flask_app.testEngine.dut import DUT
from flask import render_template, request, make_response


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', message='Hello World')


instr = Instruments()


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
        return {'data': instr.getList()}

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

        return {'data': instr.getList()}

    elif request.method == 'DELETE':
        """
        delete entry in instrument by <id>
        """
        return {'data': instr.getList()}

    else:
        # POST Error 405 Method Not Allowed
        pass


global dutObject


@app.route('/connect', methods=['POST'])
def connect():
    global dutObject
    if request.method == 'POST':
        data = request.json
        cmd = data['cmd']
        name = data['name']

        try:
            if cmd == 'connect':
                print('connecting, ', name)
                timeout = data['timeout']
                print(timeout)

                # https://stackoverflow.com/a/52547870
                config = instr.getInstrByName(name).to_dict('r')[0]
                print(config)
                dutObject = DUT(config)
                dutObject.connect()
            elif cmd == 'disconnect' and dutObject:
                print('disconnecting, ', name)
                config = instr.getInstrByName(name)
                print(config)
                dutObject.disconnect()
            return {'data': True}
        
        except:
            print("No instrument found?") 
            return {'data': False}

        


@app.route('/command', methods=['GET', 'POST'])
def command():
    global dutObject
    if request.method == 'GET':
        # send a read command to dut
        print('receieved read from client')
        print(dutObject.read(), '\n\n')
        res = {'data': dutObject.read()}
        return res

    elif request.method == 'POST':
        # send a write or query command
        data = request.json
        cmd = data['cmd']
        arg = data['arg']

        print('requested command to instrument from client')

        if cmd == 'write':
            print('write cmd: ', arg)
            res = {'data': dutObject.write(arg)}
            return res

        elif cmd == 'query':
            print('query cmd: ', arg)
            res = {'data': dutObject.query(arg)}
            return res

    # else POST Error 405 Method Not Allowed


from datetime import datetime


@app.route('/time')
def get_current_time():
    timestamp = datetime.now().strftime("%H:%M:%S")

    return {'time': timestamp}

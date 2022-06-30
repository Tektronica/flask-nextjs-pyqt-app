from flask_app import app
from flask_app.testEngine.instruments import Instruments
from flask import render_template

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', message='Hello World')

@app.route('/status')
def status():
    return render_template('status.html', message='Hello World')

@app.route('/instruments')
def instruments():
    return render_template('instruments.html')

@app.route('/api/data')
def data():
    """
    endpoint returns JSON payload

    {
        "data": [
            { ... user dict ... },
            { ... user dict ... },
            ...
        ]
    }
    """

    instr = Instruments()
    return {'data': instr.getList()}

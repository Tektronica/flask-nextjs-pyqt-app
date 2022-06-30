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

    instruments = instr.getInstruments()  # "1": { "col1": "atr1", "col2": "atr2", ... }, "2": { ...etc...
    # columns = instruments.columns # for a dynamically created table
    table_d = instruments.to_json(orient='index')
    return {'data': instruments.to_dict(orient='records')}

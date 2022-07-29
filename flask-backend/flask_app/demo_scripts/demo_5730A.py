from flask_app.testEngine.instruments.f5730A import f5730A
from flask_app.testEngine.instruments.f8588A import f8588A
import time


def test():
    dut_config = {'name': 'dut', 'address': '10.205.93.24', 'port': '3490', 'gpib': '6', 'mode': 'LAN'}
    DUT = f5730A(dut_config)

    dmm_config = {'name': 'dut', 'address': '10.205.93.31', 'port': '3490', 'gpib': '6', 'mode': 'LAN'}
    DMM = f8588A(dmm_config)

    # connect to instruments
    print('connecting to instruments')
    DUT.connect()
    DMM.connect()

    # setup meter
    # DMM.setup_f8588A_meter(autorange=True, output_type='CURR', mode='DC')
    print('setting up meter')
    DMM.write(f'CONF:VOLT:DC')
    # DMM.write(f'CONF:VOLT:AC')
    time.sleep(1)
    DMM.write(f'VOLT:DC:RANGE:AUTO ON')
    # DMM.write(f'CURR:AC:RANGE:AUTO ON')
    time.sleep(1)

    # operate dut
    print('OUT 1 V; OPER')
    DUT.write('OUT 1 V; OPER')
    # DUT.write('OUT 1 V, 1000 Hz; OPER')
    time.sleep(1)

    # measure dut using dmm
    time.sleep(2)
    DMM.write('INIT:IMM')
    time.sleep(2)
    outval = DMM.query('FETCH? 1')
    time.sleep(2)

    mode = 'DC'
    if mode == 'AC':
        freqval = DMM.query('FETCH? 2')
    else:
        freqval = 0.0

    # place dut in standby
    DUT.write('STBY')

    # reset and disconnect
    DUT.write('*RST')
    DMM.write('*RST')

    DUT.disconnect()
    DMM.disconnect()

    return {'data': {'out': outval, 'frequency': freqval}}


if __name__ == "__main__":
    print(test())

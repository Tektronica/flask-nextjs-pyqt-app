from flask_app.testEngine.instruments.f2635A import f2635A

ACTIVE_CHANNELS = 5
COMM = 4


def test():
    dmm_config = {'name': 'dmm', 'address': f'{COMM}', 'port': '3490', 'gpib': '6', 'mode': 'RS232'}
    data = {'channel': [], 'log': []}

    # 1. connect to instruments
    print('\n[STEP 1] connect to meter')
    DMM = f2635A(dmm_config)
    # connect to instruments
    res = DMM.connect()

    if res['status']:
        # log debug to output
        DMM.log_to_screen()

        # 2. meter first setup (reset)
        print(f'\n[STEP 2] setting up meter')
        DMM.reset()

        # 3. deactivate channels
        # deactivates all channels greater than ACTIVE_CHANNELS
        print(f'\n[STEP 3] deactivate all channels greater than {ACTIVE_CHANNELS}')
        for channel in ((n + ACTIVE_CHANNELS) for n in range(20 - ACTIVE_CHANNELS)):
            DMM.deactivate_channel(channel + 1)

        # 4. meter func setup for each channel
        print(f'\n[STEP 4] setup each of the {ACTIVE_CHANNELS} channels active')
        for channel in range(ACTIVE_CHANNELS):
            DMM.setup_channel(channel=(channel + 1), func='VDC', scale=4)

        # trigger a new scan
        timestamp = DMM.scan()
        print(timestamp)

        # 5. retrieve each channel measurement by iterating across active channels
        print(f'\n[STEP 5] retrieve measurement from each of the {ACTIVE_CHANNELS} channels active')
        channels = list(range(1, (ACTIVE_CHANNELS + 1)))
        log = [0.0] * ACTIVE_CHANNELS
        for channel, idx in enumerate(range(ACTIVE_CHANNELS)):
            log[idx] = DMM.reading(channel=(channel + 1))

        # 6. reset and disconnect
        print(f'\n[STEP 6] Reset the instrument and disconnect.')
        DMM.write('*RST')
        DMM.disconnect()

        data = {'channel': channels, 'log': log}

    return {'data': data}


if __name__ == "__main__":
    data = (test())['data']

    for idx, row in enumerate(data['log']):
        print(f"row: {idx}\tchannel: {data['channel'][idx]}", row)

    # done

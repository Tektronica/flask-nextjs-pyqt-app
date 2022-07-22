import Layout from '../components/layout'
import React, { useState, useEffect } from 'react';
import ShadowBox from '../components/containers/ShadowBox';
import ModalNewInstrument from '../components/modal/ModalNewInstrument'
// https://stackoverflow.com/a/53572588
// https://github.com/facebook/react/issues/14326

export default function Instruments() {
    const [tableData, setTableData] = useState([]);
    let [isOpen, setIsOpen] = useState(false)
    const [contentModal, setContentModal] = useState("");
    const [statusIcon, setStatusIcon] = useState(getIcon(undefined));

    // return information from instrument config
    useEffect(() => {
        getInstrument(setTableData);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Create New Instrument
                </h1>

                <div className="grid grid-rows-1 grid-flow-col gap-4">
                    <div>
                        <label className="min-w-[40px]">
                            <span>Name</span>
                            <input type="text" id="name" className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </label>
                    </div>
                    <div>
                        <label className="min-w-[40px]">
                            <span>ID</span>
                            <input type="text" id="instr" className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>Mode</span>
                        </label>
                        <select id="mode" className="h-[28px] border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50">
                            <option value=""></option>
                            <option value="LAN">LAN</option>
                            <option value="GPIB">GPIB</option>
                            <option value="SERIAL">Serial</option>
                            <option value="RS232">RS232</option>
                        </select>
                    </div>
                    <div>
                        <label>
                            <span>Address</span>
                            <input type="text" id="address" className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>Port</span>
                            <input type="text" id="port" className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>GPIB</span>
                            <input type="text" id="gpib" className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </label>
                    </div>
                    <div className="flex items-end">
                        <span>
                            <button
                                id='add'
                                onClick={onClickCreate.bind(this, setTableData)}
                                className="text-gray-600 hover:text-green-500 cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </span>
                    </div>
                </div>
            </ShadowBox>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Available Instruments
                </h1>
                <div className="">
                    <table
                        id='instrument-config-table'
                        className="w-full text-sm text-left text-gray-800"
                    >
                        <thead>
                            <tr>
                                <th className='px-6 py-3'>Name</th>
                                <th className='px-6 py-3'>ID</th>
                                <th className='px-6 py-3'>Mode</th>
                                <th className='px-6 py-3'>Address</th>
                                <th className='px-6 py-3'>Port</th>
                                <th className='px-6 py-3'>GPIB</th>
                                <th className='px-6 py-3'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map(function (item, idx) {

                                    return (
                                        <tr key={idx} className='bg-white border-b hover:bg-gray-200' >
                                            <td className='px-6 py-4 font-bold text-gray-900 whitespace-nowrap'>
                                                <button
                                                    type='button'
                                                    id='btn-name'
                                                    onClick={setResourceName.bind(this, item.name)}>
                                                    {item.name}
                                                </button>
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item.instr}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item.mode}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item.address}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item.port}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item.gpib}
                                            </td>
                                            <td className='pr-2 py-3'>
                                                <button
                                                    onClick={() => { setIsOpen(true); setContentModal(getRow(idx)) }}
                                                    className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white px-2 border border-cyan-500 hover:border-transparent rounded uppercase'
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <ModalNewInstrument isOpen={isOpen} setIsOpen={setIsOpen} config={contentModal} onModalClose={onModalSubmit.bind(this, setTableData)} />
                </div>
            </ShadowBox>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Input/Output
                </h1>
                <div className="flex flex-col">

                    {/* resource menu items */}
                    <div className="p-4 mb-2 grid grid-rows-1 grid-flow-col gap-4 border">
                        {/* resource */}
                        <div>
                            <label>
                                Resource
                            </label>
                            <input
                                type="text"
                                id="resource"
                                placeholder='<NAME> or <IP ADDRESS>'
                                onChange={setStatusIcon.bind(this, getIcon(undefined))}
                                className="font-mono text-cyan-700 border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50"
                            />
                        </div>
                        {/* timeout */}
                        <div>
                            <div>
                                <label>
                                    Timeout
                                </label>
                            </div>
                            <input
                                type="number"
                                id="timeout"
                                defaultValue="2000"
                                className="font-mono text-cyan-700 w-[100px] border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50"
                            />
                        </div>
                        {/* connect */}
                        <div className="flex items-end">
                            <button
                                id='connect-btn'
                                onClick={handleClick.bind(this, 'connect', setStatusIcon)}
                                className="ml-2 mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Connect
                            </button>
                            <div id='connectStatus'>
                                {statusIcon}
                            </div>
                        </div>
                    </div>
                    {/* command menu items */}
                    <div className='mb-2 p-4 flex flex-col border'>
                        {/* command select */}
                        <label>Select Command</label>
                        <div className='pb-2 font-mono'>
                            <select
                                id="cmd-select"
                                className="h-[28px] border-2 w-full bg-cyan-50 hover:bg-green-50 text-cyan-700"
                            >
                                <option value="*IDN?">*IDN?</option>
                                <option value="*OPC">*OPC</option>
                                <option value="*RST">*RST</option>
                                <option value="*ESR?">*ESR?</option>
                            </select>
                        </div>
                        {/* command button row */}
                        <div className='flex flex-row pb-2'>
                            <button
                                id='write-btn'
                                onClick={handleClick.bind(this, 'write')}
                                className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Write
                            </button>
                            <button
                                id='read-btn'
                                onClick={handleClick.bind(this, 'read')}
                                className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Read
                            </button>
                            <button
                                id='query-btn'
                                onClick={handleClick.bind(this, 'query')}
                                className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Query
                            </button>
                            <button
                                id='info-btn'
                                onClick={handleClick.bind(this, 'info')}
                                className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Instrument Info
                            </button>
                        </div>

                        <div className='pb-2'>
                            <textarea
                                id='response-box'
                                spellCheck="false"
                                className='min-h-[150px] font-mono text-xs border-2 w-full bg-cyan-50 text-cyan-900'
                            >
                            </textarea>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div>
                                <button
                                    type='button'
                                    id='clear'
                                    onClick={handleClick.bind(this, 'clear')}
                                    className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                    Clear History
                                </button>
                            </div>
                            <div>
                                <div className='flex items-center mb-6'>
                                    <div className='w-[160px]'>
                                        <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
                                            Read Count:
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        id="count"
                                        defaultValue="1024"
                                        className="font-mono text-cyan-700 w-[100px] border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ShadowBox>

        </>
    )
}


function setResourceName(name, e) {
    document.getElementById('resource').value = name
}

async function getInstrument(setTableData) {
    let url = 'api/instruments';

    const resJSON = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const res = await resJSON.json();
    setTableData(res.data);
}

async function onModalSubmit(setTableData) {
    getInstrument(setTableData)
}

async function onClickCreate(setTableData, e) {

    // collect user input
    const name = document.getElementById('name').value
    const instr = document.getElementById('instr').value
    const mode = document.getElementById('mode').value
    const address = document.getElementById('address').value
    const port = document.getElementById('port').value
    const gpib = document.getElementById('gpib').value

    console.log('client: creating, ', name);

    // build dictionary
    const new_instr = { name: name, instr: instr, mode: mode, address: address, port: port, gpib: gpib }

    // POST method
    // https://stackoverflow.com/a/55647945
    let url = 'api/instruments/add';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_instr)
    })

    const body = await res.json();
    const status = await body.data
    console.log('server: ', status);

    // close modal on success
    if (status === true) {
        document.getElementById('name').value = ''
        document.getElementById('instr').value = ''
        document.getElementById('mode').value = ''
        document.getElementById('address').value = ''
        document.getElementById('port').value = ''
        document.getElementById('gpib').value = ''

        // update data table
        getInstrument(setTableData);
    }
}

const getIcon = (status) => {
    let statusIcon;

    if (status === undefined) {
        statusIcon = (
            <div className='text-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div >
        )
    } else if (status === true) {
        statusIcon = (
            <div className='text-green-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div >
        )
    } else if (status === false) {
        statusIcon = (
            <div className='text-red-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        )
    }

    return statusIcon
}

async function handleClick(id, setStatusIcon, e) {

    if (id == 'connect') {

        const resource = document.getElementById('resource').value
        const timeout = document.getElementById('timeout').value

        let newline = 'Attempting to connect to ' + resource + '\n'
        document.getElementById('response-box').value += newline;

        // fetch if resource value is not null or empty string
        if (resource != '') {
            console.log('client: connecting, ', resource)
            const connect_instr = { cmd: 'connect', name: resource, timeout: timeout }
            let url = 'api/connect';

            // 60 second timeout:
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 60 * 1000)

            const res = await fetch(url, {
                signal: controller.signal,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(connect_instr)
            })
            clearTimeout(timeoutId)

            // get connection status
            let body = await res.json();
            let status = body.status
            let msg = body.data
            newline = 'connection: ' + status + ', ' + msg + '\n\n'
            console.log('server: ', newline);
            setStatusIcon(getIcon(status))
            document.getElementById('response-box').value += newline;


        } else {
            console.log('resource is empty')
        }

    } else if (id == 'disconnect') {
        console.log('disconnect')
        const resource = document.getElementById('resource').value

        // fetch
        const connect_instr = { cmd: 'disconnect', name: resource }

        let url = 'api/connect';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(connect_instr)
        })

        const body = await res.json();
        console.log('server: ', body);

    } else if (['write', 'read', 'query', 'info'].includes(id)) {

        const resource = document.getElementById('resource').value;
        let arg = document.getElementById('cmd-select').value;
        let line = '\n';
        let cmd = '';

        if (id == 'write') {
            // send a WRITE
            console.log('write')
            cmd = 'WRITE: '
            line = '>>' + cmd + arg + '\n'
        } else if (id == 'read') {
            // send a READ
            console.log('read')
            arg = ''
            cmd = 'READ: '
            line = '>>' + cmd + '\n';
        } else if (id == 'query') {
            // send a READ + WRITE
            console.log('query')
            cmd = 'QUERY: '
            line = '>>' + cmd + arg + '\n'
        } else if (id == 'info') {
            // get instrument model information
            console.log('client: retrieving information on instrument...')
            cmd = 'Instrument Model Information:'
            line = '>>' + cmd + '\n'
        }

        // print the sent command to textarea
        document.getElementById('response-box').value += line;

        // build dictionary
        const instr_cmd = { name: resource, cmd: id, arg: arg }

        // POST method
        // https://stackoverflow.com/a/55647945
        let url = 'api/command';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(instr_cmd)
        })

        let body = await res.json();
        const status = body.status
        const data = body.data

        console.log('server: ', body)

        // print the response to textarea
        if (id != 'info') {
            const newline = data + '\n\n';
            document.getElementById('response-box').value += newline;
        } else {
            let newlines = ''
            newlines += 'Model: ' + data.model + '\n';
            newlines += 'Serial: ' + data.serial + '\n';
            newlines += 'Address: ' + `TCPIP0::${data.enet}::${data.port}::SOCKET` + ' / ' + `GPIB0::${data.gpib}::INSTR` + '\n';
            newlines += 'EOL: ' + data.eol + '\n';
            newlines += 'Cal Date: ' + formatDate(data.caldate) + '\n';
            newlines += 'DC Zero Date: ' + formatDate(data.zero) + '\n\n';
            document.getElementById('response-box').value += newlines;
        }

    } else if (id == 'clear') {
        // clear the response text area
        console.log('client: clear')
        document.getElementById('response-box').value = "";
    }
};

function formatDate(mmddyy) {
    var myRegexp = /^([^\s]{2})([^\s]{2})([^\s]{2})$/g
    var match = myRegexp.exec(mmddyy);
    if (match) {
        match.shift();
        return match.join("-")
    } else {
        return mmddyy
    }
}

// returns the selected row as dictionary
function getRow(rowid) {
    var table = document.getElementById("instrument-config-table");
    var row = table.rows[rowid + 1]

    //read row
    const config = {
        'name': row.cells[0].textContent,
        'instr': row.cells[1].textContent,
        'mode': row.cells[2].textContent,
        'address': row.cells[3].textContent,
        'port': row.cells[4].textContent,
        'gpib': row.cells[5].textContent,
    }

    return config
}


Instruments.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

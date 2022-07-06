import Layout from '../components/layout'
import React, { useState, useEffect } from 'react';
import ShadowBox from '../components/containers/ShadowBox';
// https://stackoverflow.com/a/53572588
// https://github.com/facebook/react/issues/14326

export default function Instruments() {
    const [tableData, setTableData] = useState(0);

    // return information from instrument config
    useEffect(() => {
        async function getInstrument() {
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

        getInstrument();
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
                            <option value="socket">LAN</option>
                            <option value="gpib">GPIB</option>
                            <option value="socket">Serial</option>
                            <option value="gpib">RS232</option>
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
                            <button id='add' onClick={handleClick.bind(this, 'add')} className="text-gray-600 hover:text-green-500 cursor-pointer">
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
                    <table className="w-full text-sm text-left text-gray-800 dark:text-gray-400">
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
                                Object.entries(tableData).map(function (item, i) {
                                    return (
                                        <tr key={i} className='bg-white border-b hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700' >
                                            <td className='px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap'>
                                                {item[1].name}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item[1].instr}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item[1].mode}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item[1].address}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item[1].port}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {item[1].gpib}
                                            </td>
                                            <td className='px-6 py-3'>
                                                <button onClick={handleClick.bind(this, 'edit')} className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white  px-2 border border-cyan-500 hover:border-transparent rounded uppercase'>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
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
                            <input type="text" id="resource" placeholder='<NAME> or <IP ADDRESS>' className="font-mono border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </div>
                        {/* timeout */}
                        <div>
                            <div>
                                <label>
                                    Timeout
                                </label>
                            </div>
                            <input type="number" id="timeout" defaultValue="2000" className="font-mono w-[100px] border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                        </div>
                        {/* connect */}
                        <div className="flex items-end">
                            <button id='connect-btn' onClick={handleClick.bind(this, 'connect')} className="ml-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Connect
                            </button>

                            {/* TODO: add a status of connection here */}

                        </div>
                    </div>
                    {/* command menu items */}
                    <div className='mb-2 p-4 flex flex-col border'>
                        {/* command select */}
                        <label>Select Command</label>
                        <div className='pb-2 font-mono'>
                            <select id="cmd-select" className="h-[28px] border-2 w-full bg-cyan-50 hover:bg-green-50">
                                <option value="*IDN?\n">*IDN?\n</option>
                                <option value="*OPC\n">*OPC\n</option>
                                <option value="*RST\n">*RST\n</option>
                                <option value="*ESR?\n">*ESR?\n</option>
                            </select>
                        </div>
                        {/* command button row */}
                        <div className='flex flex-row pb-2'>
                            <button id='write-btn' onClick={handleClick.bind(this, 'write')} className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Write
                            </button>
                            <button id='read-btn' onClick={handleClick.bind(this, 'read')} className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Read
                            </button>
                            <button id='query-btn' onClick={handleClick.bind(this, 'query')} className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
                                Query
                            </button>
                        </div>

                        <div className='pb-2'>
                            <textarea id='response-box' className='min-h-[100px] font-mono text-xs border-2 w-full bg-cyan-50 hover:bg-green-50 '>
                            </textarea>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div>
                                <button type='button' id='clear' onClick={handleClick.bind(this, 'clear')} className="mr-2 pl-2 pr-2 bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white border border-cyan-500 hover:border-transparent rounded">
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
                                    <input type="number" id="count" defaultValue="1024" className="font-mono w-[100px] border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </ShadowBox>

        </>
    )
}

async function handleClick(id, e) {

    if (id == 'add') {
        // collect user input
        const name = document.getElementById('name').value
        const instr = document.getElementById('instr').value
        const mode = document.getElementById('mode').value
        const address = document.getElementById('address').value
        const port = document.getElementById('port').value
        const gpib = document.getElementById('gpib').value

        // build dictionary
        const new_instr = { id: -1, name: name, instr: instr, mode: mode, address: address, port: port, gpib: gpib }

        // POST method
        // https://stackoverflow.com/a/55647945
        let url = 'api/instruments';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_instr)
        })

        console.log(res)

    } else if (id == 'edit') {
        id = 0
        console.log('edit')
        console.log('item id: ', id)
        // fetch here

    } else if (id == 'connect') {
        console.log('connect')
        const resource = document.getElementById('resource').value
        const timeout = document.getElementById('timeout').value

        // fetch
        const connect_instr = { cmd: 'connect', name: resource, timeout: timeout }
        let url = 'api/connect';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(connect_instr)
        })

        console.log(res)
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

        console.log(res)

    } else if (id == 'write') {
        // send a WRITE
        console.log('write')
        const arg = document.getElementById('cmd-select').value
        const cmd = 'WRITE: '
        const line = '>>' + cmd + arg + '\n'
        document.getElementById('response-box').value += line;


        // build dictionary
        const instr_cmd = { cmd: id, arg: arg }

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

        let r = await res.json()
        let newline = r.data + '\n'
        document.getElementById('response-box').value += newline;

    } else if (id == 'read') {
        // send a READ
        console.log('read')
        const cmd = 'READ: '
        const line = '>>' + cmd + '\n'
        document.getElementById('response-box').value += line;

        // GET method
        let url = 'api/command';
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let r = await res.json()
        let newline = r.data + '\n'
        document.getElementById('response-box').value += newline;

    } else if (id == 'query') {
        // send a READ + WRITE
        console.log('query')
        const arg = document.getElementById('cmd-select').value
        const cmd = 'QUERY: '
        const line = '>>' + cmd + arg + '\n'
        document.getElementById('response-box').value += line;

        // build dictionary
        const instr_cmd = { cmd: id, arg: arg }

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

        let r = await res.json()
        let newline = r.data + '\n'
        document.getElementById('response-box').value += newline;

    } else if (id == 'clear') {
        // clear the response text area
        console.log('clear')
        document.getElementById('response-box').value = "";
    }
};


Instruments.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

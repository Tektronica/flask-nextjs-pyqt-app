import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';
import StatBox from '../components/containers/StatBox';

export default function Status() {
    const [dashboard, setDashboard] = useState(0);
    const [tableData, setTableData] = useState([]);


    // return information from instrument config
    useEffect(() => {
        getStats(setDashboard);
        getActiveInstruments(setTableData);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-3xl font-bold underline">
                    Dashboard
                </h1>
                <div className='flex justify-between my-4'>
                    {
                        Object.entries(dashboard).map(function (stat, idx) {
                            return (
                                <StatBox stat={stat[1]} key={idx} />
                            )
                        })
                    }
                </div>
            </ShadowBox>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Active Instruments
                </h1>
                <div className="">
                    <table
                        id='instrument-active-table'
                        className="w-full text-sm text-left text-gray-800 "
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
                                Object.entries(tableData).map(function (item, idx) {
                                    return (
                                        <tr key={idx} className='bg-white border-b hover:bg-gray-200 ' >
                                            <td className='px-6 py-4 font-bold text-gray-900 whitespace-nowrap'>
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
                                            <td className='pr-2 py-3'>
                                                <button
                                                    onClick={disconnectInstrument.bind(this, item[1].name, setTableData)}
                                                    className='px-1 text-xs bg-transparent hover:bg-red-500 text-red-700 font-bold hover:text-white border-2 border-red-500 hover:border-transparent rounded uppercase'

                                                >
                                                    ✕
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
        </>
    )
}

async function getStats(setDashboard) {
    let url = 'api/stats';

    const resJSON = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const res = await resJSON.json();
    console.log(res, res.data)
    setDashboard(res.data);
}

async function getActiveInstruments(setTableData) {
    let url = 'api/instruments';
    const req = { data: 'active' }

    const resJSON = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
    })

    const res = await resJSON.json();
    setTableData(res.data);
}

async function disconnectInstrument(name, setTableData) {
    console.log('client: disconnecting, ', name)

    const disconnect_instr = { cmd: 'disconnect', name: name }
    let url = 'api/connect';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(disconnect_instr)
    })

    // get connection status
    let body = await res.json();
    let status = body.status
    console.log('server: ', body)

    // refresh the data table
    getActiveInstruments(setTableData)
}


Status.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
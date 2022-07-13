import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';

export default function History() {
    const [tableData, setTableData] = useState(0);

    // return contents of backend history folder
    useEffect(() => {
        getHistory(setTableData);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    History
                </h1>

                <div className="">
                    <table
                        id='instrument-config-table'
                        className="w-full text-sm text-left text-gray-800"
                    >
                        <thead>
                            <tr>
                                <th className='px-6 py-3'>File</th>
                                <th className='px-6 py-3'>Date</th>
                                <th className='px-6 py-3'>Time</th>
                                <th className='px-6 py-3'></th>
                                <th className='px-6 py-3'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.entries(tableData).map(function (item, idx) {
                                    let name = item[1].name
                                    let date = new Date(item[1].date * 1000)
                                    let dateSplit = date.toISOString().split('T')

                                    return (
                                        <tr key={idx} className='bg-white border-b hover:bg-gray-200' >
                                            <td className='px-6 py-4 font-bold text-gray-900 whitespace-nowrap'>
                                                <button
                                                    type='button'
                                                    id='btn-name'
                                                    onClick={openFile.bind(this, name)}>
                                                    {item[1].name}
                                                </button>
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {dateSplit[0]}
                                            </td>
                                            <td className='px-6 py-4 text-gray-500'>
                                                {dateSplit[1]}
                                            </td>
                                            <td className='pr-2 py-3'>
                                                <button
                                                    onClick={downloadFile.bind(this, name)}
                                                // className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white px-2 border border-cyan-500 hover:border-transparent rounded uppercase'
                                                >
                                                    {getIcon('download')}
                                                </button>
                                            </td>
                                            <td className='pr-2 py-3'>
                                                <button
                                                    onClick={deleteFile.bind(this, name)}
                                                // className='bg-transparent hover:bg-cyan-500 text-cyan-700 font-semibold hover:text-white px-2 border border-cyan-500 hover:border-transparent rounded uppercase'
                                                >
                                                    {getIcon('trash')}
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

async function getHistory(setTableData) {
    let url = 'api/history';

    const resJSON = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const body = await resJSON.json();
    console.log(body)
    setTableData(body.data);
}

function openFile(name) {
    console.log('client: opening ', name)
}

function downloadFile(name) {
    console.log('client: downloading ', name)
}

function deleteFile(name) {
    console.log('client: deleting ', name)
}

const getIcon = (name) => {
    let dashIcon;

    if (name == 'download') {
        dashIcon = (
            <div className='text-gray-400'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </div>
        )
    } else if (name == 'open') {
        dashIcon = (
            <div className='text-cyan-500'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            </div>
        )
    } else if (name == 'trash') {
        dashIcon = (
            <div className='text-red-400'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
        )
    }

    return (
        <>
            {dashIcon}
        </>
    )
}

History.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
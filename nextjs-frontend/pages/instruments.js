import Layout from '../components/layout'
import React, { useState, useEffect } from 'react';
import ShadowBox from '../components/containers/ShadowBox';

export default function Instruments() {
    const [tableData, setTableData] = useState(0);

    useEffect(() => {
        fetch('api/instruments')
            .then(res => res.json())
            .then(data => {
                setTableData(data.data);
            });
    }, []);

    return (
        <>
            <ShadowBox>
                <>
                    <h1 className="text-xl font-bold pb-4">
                        Create New Instrument
                    </h1>

                    <div className="grid grid-rows-1 grid-flow-col gap-4">
                        <div>
                            <label className="min-w-[40px]">
                                <span>Name</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div>
                            <label className="min-w-[40px]">
                                <span>ID</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Mode</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Address</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Port</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>GPIB</span>
                                <input className="border-2 w-full bg-cyan-50 hover:bg-green-50 focus:bg-green-50" />
                            </label>
                        </div>
                        <div className="">
                            <span>
                            <a className="text-gray-600 hover:text-green-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                            </span>
                        </div>

                    </div>
                </>
            </ShadowBox>
            <ShadowBox>
                <>
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
                                                <th className="px-6 py-3 text-cyan-500 hover:text-green-500">
                                                    Edit
                                                </th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                </>
            </ShadowBox>

        </>
    )
}


Instruments.layout = Layout
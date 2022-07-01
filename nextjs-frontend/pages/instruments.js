import Layout from '../components/layout'
import React, { useState, useEffect } from 'react';

export default function Instruments() {
    // useEffect(() => {
    //     fetch('api/instruments').then(res => res.json()).then(data => {
    //       console.log(data)
    //     });
    //   }, []);
    return (
        <>
            <div className="flex flex-col">
                <div className="m-4 p-4 rounded-lg shadow-md bg-white">
                    <h3>Create New Instrument</h3>
                    <div className="grid grid-rows-1 grid-flow-col gap-4" action="/api/add-instrument">
                        <div>
                            <label className="min-w-[40px]">
                                <span>Name</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <div>
                            <label className="min-w-[40px]">
                                <span>ID</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Mode</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Address</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Port</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>GPIB</span>
                                <input className="bg-yellow-100 border-2 w-full" />
                            </label>
                        </div>
                        <a className="text-gray-600 hover:text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                        </a>
                    </div>
                </div>

                <div className="m-4 p-4 rounded-lg shadow-md bg-white">
                    <h3>Available Instruments</h3>
                    <div>
                        <table id="data" className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Mode</th>
                                    <th>Address</th>
                                    <th>Port</th>
                                    <th>GPIB</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </>
    )
}


Instruments.layout = Layout
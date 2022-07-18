// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires papaparse -->

import Layout from '../../components/layout'
import ShadowBox from '../../components/containers/ShadowBox';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import TimePlot from '../../components/charts/TimePlot';
// import TimePlot from '../../components/charts/_TimePlot' ;
import Papa from 'papaparse';
import TableDisclosure from '../../components/disclosure/tableDisclosure';

// https://stackoverflow.com/questions/68302182/reactjs-fetch-full-csv

export default function DataView() {
    // https://itnext.io/chartjs-tutorial-with-react-nextjs-with-examples-2f514fdc130
    const [tableData, setTableData] = useState([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
    const [haveData, setHaveData] = useState(false);

    const router = useRouter()
    const { filename } = router.query
    console.log(filename)
    const f = '2022-05-05_Sweep_DCI'
    // get csv data determined by the dynamic route of this slug

    useEffect(() => {

        openFile(f, setHaveData, setTableData);
    }, []);

    // const plotData = generateSin(1000, 4, 100);
    const plotData = generateLissajous(5, 4, 1000);

    // testing papa parse

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Lissajous
                </h1>
                <TimePlot pointData={plotData} />
            </ShadowBox>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Highlights
                </h1>
                <p>
                    {
                        getItemsPassed(tableData).fail
                    }
                </p>
            </ShadowBox>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    {f}
                </h1>

                <div className="">
                    <table
                        id='instrument-config-table'
                        className="w-full text-sm text-left text-gray-800"
                    >
                        <thead>
                            <tr>
                                {/* {
                                    // https://www.codegrepper.com/code-examples/javascript/list+of+dictionaries+javascript
                                    csvHeaders.map((key) => {
                                        return (
                                            <th className='px-6 py-3'>{key}</th>
                                        )
                                    })
                                } */}
                                <th className='px-6 py-3'>Index</th>
                                <th className='px-6 py-3'>Mode</th>
                                <th className='px-6 py-3'>Amplitude</th>
                                <th className='px-6 py-3'>DMM</th>
                                <th className='px-6 py-3'>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // TODO: consider a headless ui disclosure here
                                // https://headlessui.com/react/disclosure
                                tableData.map((item, idx) => {
                                    return (
                                        <>
                                            {/* <tr key={idx} className='bg-white border-b hover:bg-gray-200' >
                                                <td className='px-6 text-gray-500'>
                                                    {idx}
                                                </td>
                                                <td className='px-6 text-gray-500'>
                                                    {item.mode}
                                                </td>
                                                <td className='px-6 text-gray-500'>
                                                    {item.amp_nominal}
                                                </td>
                                                <td className='px-6 text-gray-500'>
                                                    {item.dmm}
                                                </td>
                                                <td className='px-6 text-gray-500'>
                                                    {item.passed}
                                                </td>
                                            </tr> */}
                                          
                                                <TableDisclosure key={idx}>
                                                    <>
                                                        <td className='px-6 text-gray-500'>
                                                            {idx}
                                                        </td>
                                                        <td className='px-6 text-gray-500'>
                                                            {item.mode}
                                                        </td>
                                                        <td className='px-6 text-gray-500'>
                                                            {item.amp_nominal}
                                                        </td>
                                                        <td className='px-6 text-gray-500'>
                                                            {item.dmm}
                                                        </td>
                                                        <td className='px-6 text-gray-500'>
                                                            {item.passed}
                                                        </td>
                                                    </>
                                                </TableDisclosure>

                                            
                                        </>
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

function generateLissajous(a = 5, b = 4, dataLength = 10000) {
    let plotData = new Array(dataLength);

    // sampling characteristics
    const Fs = 100

    // waveform variables
    let xt = 0;
    let yt = 0;

    // lissajous parameters
    const A = 100
    const B = 100
    const delta = Math.PI / 2
    let t = 0;

    // lissajous plot
    for (let idx = 0; idx < dataLength; idx++) {
        t = idx / Fs
        // Apply Lissajous Parametric Equations
        xt = A * Math.sin(a * t + delta);
        yt = B * Math.sin(b * t);
        plotData[idx] = { x: xt, y: yt };  // in milli     
    }

    return plotData
}

function generateSin(f0, periods, dataLength) {
    let plotData = new Array(dataLength);

    // sampling characteristics
    const Fs = dataLength * f0 / periods; // sampling frequency

    // waveform parameters
    let xt = 0;
    let yt = 0;
    const ypeak = 1;

    for (let idx = 0; idx < dataLength; idx++) {
        xt = idx / Fs  // increment by dt step
        yt = ypeak * Math.sin(2 * Math.PI * f0 * xt)
        plotData[idx] = { x: xt * 1000, y: yt }  // in milli
    }

    return plotData
}

function getItemsPassed(data) {
    let pass = 0;
    let fail = 0;
    let hasPassed;
    for (let idx = 0; idx < data.length; idx++) {
        hasPassed = data[idx].passed;

        if (hasPassed == 'pass' || hasPassed == '') {
            pass += 1
        } else {
            fail += 1
        }
    }
    return { pass: pass, fail: fail }
}

async function openFile(filename, setHaveData, setTableData) {
    console.log('client: opening ', filename)
    const fileRequest = { cmd: 'download', name: filename }
    let url = '../api/history';
    console.log('fetching')

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileRequest)
    })

    // Papa.parse expects its first argument to be string or File object.
    const resText = await res.text();
    const p = Papa.parse(resText, {
        header: true,
    })

    // const reader = res.body.getReader()
    // const decoder = new TextDecoder('utf-8')

    // FileReaader.readasText argument 1 does not implement interface blob

    // returning only a chunk of data... There's also papa preview option
    // https://stackoverflow.com/a/43087596

    // custom request headers are not currently supported
    // https://github.com/mholt/PapaParse/issues/374#issuecomment-288356596

    // const p = Papa.parse(url, {
    //     header:true,
    //     worker:true, 
    //     download: true,
    //     // rest of config ...
    // })

    const csvHeaders = p.meta.fields
    const csvRows = p.data

    setTableData(csvRows)
    setHaveData(true)
}

const fetchData = async () => {
    try {
        const res = await fetch('/api');
        const data = await res.json();
        setPlotData(data);
        setHaveData(true); // here, and importantly after the above setChartData call
    } catch (error) {
        setHaveData(false);
        setError(error);
    }
}


DataView.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

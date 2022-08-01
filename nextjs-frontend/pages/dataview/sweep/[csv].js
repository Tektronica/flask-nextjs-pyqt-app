// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires papaparse -->
// <!-- requires react-window -->

import Layout from '../../../components/layout'
import ShadowBox from '../../../components/containers/ShadowBox';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import TimePlot from '../../../components/charts/TimePlot';
import Papa from 'papaparse';
import TableDisclosure from '../../../components/disclosure/tableDisclosure';
import DoughnutStat from '../../../components/charts/DoughnutStat';

export default function DataView() {
    const [filename, setFilename] = useState('Loading Data...');

    const [tableData, setTableData] = useState([{ id: -1, x: 0, y: 0 }, { id: -2, x: 0, y: 1 }]);
    const [statData, setStatData] = useState({ passfail: [0, 0], passdetail: [0, 0, 0], faildetail: [0, 0, 0] })

    const [haveData, setHaveData] = useState(false);  // not used, but useful

    const router = useRouter()

    useEffect(() => {
        // wait until router is ready to request slug name
        if (!router.isReady) return;

        // get csv data determined by the dynamic route of this slug
        const slug = router.query  // example: Object { csv: "sweep_DCI_2022-05-05" }
        const filename = slug.csv  // not in scope of the stately constant

        setFilename(filename)
        openFile(filename, setHaveData, setTableData, setStatData);

    }, [router.isReady]);

    // const plotData = generateSin(1000, 4, 100);
    const plotData = generateLissajous(5, 4, 1000);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Highlights
                </h1>
                <DoughnutStat statData={statData} />
            </ShadowBox>

            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    {filename}
                </h1>

                <div className="">
                    <table
                        id='instrument-config-table'
                        className="w-full text-sm text-left text-gray-800"
                    >
                        <thead>
                            <tr>
                                <th className='px-6 py-3'>Index</th>
                                <th className='px-6 py-3'>Mode</th>
                                <th className='px-6 py-3'>Amplitude</th>
                                <th className='px-6 py-3'>DMM</th>
                                <th className='px-6 py-3'>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((item, idx) => {
                                    return (
                                        <TableDisclosure panelContent={item} key={item.id}>
                                            <React.Fragment key={`${item.id}_fragment`}>
                                                <td className='px-6 text-gray-500'>
                                                    {item.id}
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
                                            </React.Fragment>
                                        </TableDisclosure>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </ShadowBox>

            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Lissajous Plot
                </h1>
                <TimePlot pointData={plotData} title='Lissajous' />
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

function getPassFail(data) {
    let pass = 0;
    let fail = 0;
    let hasPassed;

    let good = 0;
    let decent = 0;
    let marginal = 0;

    let medicore = 0;
    let bad = 0;
    let terrible = 0;

    let percentOfLimit = 0;

    for (let idx = 0; idx < data.length; idx++) {
        hasPassed = data[idx].passed;

        if (hasPassed == 'pass') {
            pass += 1
            percentOfLimit = Math.abs(data[idx].PercentofLimit);
            if (percentOfLimit >= 0 && percentOfLimit < 50) {
                '0 to 50 percent of spec'
                good += 1
            } else if (percentOfLimit >= 50 && percentOfLimit < 75) {
                '50 to 75 percent of spec'
                decent += 1
            } else if (percentOfLimit >= 75 && percentOfLimit < 100) {
                '75 to 100 percent of spec'
                marginal += 1
            }

        } else if (hasPassed == 'fail') {
            fail += 1
            percentOfLimit = Math.abs(data[idx].PercentofLimit);
            if (percentOfLimit >= 100 && percentOfLimit < 125) {
                '100 to 125 percent of spec'
                medicore += 1
            } else if (percentOfLimit >= 120 && percentOfLimit > 150) {
                '125 to 150 percent of spec'
                bad += 1
            } else if (percentOfLimit >= 150) {
                '150 and above percent of spec'
                terrible += 1
            }
        } else {
            // pass
        }
    }

    const passfail = { passfail: [pass, fail], passdetail: [good, decent, marginal], faildetail: [medicore, bad, terrible] }
    return passfail

}

async function openFile(filename, setHaveData, setTableData, setStatData) {
    console.log('client: opening ', filename)
    const fileRequest = { cmd: 'download', name: filename }
    let url = '../../../api/history';
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

    const csvHeaders = p.meta.fields
    const csvRows = p.data
    csvRows.pop()
    const passfail = getPassFail(csvRows)

    setStatData(passfail)
    setTableData(csvRows)
    setHaveData(true)
}


DataView.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

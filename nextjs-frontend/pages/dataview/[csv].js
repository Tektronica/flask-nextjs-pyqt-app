// <!-- requires Tailwind CSS v2.0+ -->
// <!-- requires papaparse -->

import Layout from '../../components/layout'
import ShadowBox from '../../components/containers/ShadowBox';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import TimePlot from '../../components/charts/TimePlot';
// import TimePlot from '../../components/charts/_TimePlot' ;
import Papa from 'papaparse';

// https://stackoverflow.com/questions/68302182/reactjs-fetch-full-csv

export default function DataView() {
    // https://itnext.io/chartjs-tutorial-with-react-nextjs-with-examples-2f514fdc130
    // const [plotData, setPlotData] = useState([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
    const [haveData, setHaveData] = useState(false);

    const router = useRouter()
    const { filename } = router.query
    console.log(filename)

    // get csv data determined by the dynamic route of this slug

    // useEffect(() => {
    //     openFile(filename, setHaveData, setPlotData);
    // }, []);

    // const plotData = generateSin(1000, 4, 100);
    const plotData = generateLissajous(5, 4, 1000);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    {filename}
                </h1>
                <TimePlot pointData={plotData} />
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

async function openFile(filename) {
    console.log('client: opening ', filename)
    const fileRequest = { cmd: 'download', name: filename }
    let url = 'api/history';

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileRequest)
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')

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

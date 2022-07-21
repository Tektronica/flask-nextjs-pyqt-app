import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
// import SpectrumPlot from '../components/charts/SpectrumPlot';
import dynamic from 'next/dynamic';

const SpectrumPlot = dynamic(
    () => import('../components/charts/SpectrumPlot'),
    { ssr: false }
)

export default function Spectrum() {
    const [plotData, setPlotData] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    const [haveData, setHaveData] = useState(false);

    const f = 'generated_Harmonics_Noise'

    useEffect(() => {
        openFile(f, setHaveData, setPlotData);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Spectrum Analyzer
                </h1>

                {/* main panel */}
                <div className='flex flex-row'>

                    {/* left-hand options */}
                    <div className='flex-none w-1/4'>
                        <div className="grid grid-cols-1 gap-4">

                            {/* instrument setup */}
                            <div>
                                <div className="border-b font-bold">
                                    Instruments
                                </div>
                            </div>

                            {/* amplitude setup */}
                            <div>
                                <div className="border-b font-bold">
                                    Amplitude
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        Amplitude:
                                    </div>
                                    <input />
                                    <select id="amplitude_type" name="amplitude_type">
                                        <option value="rms">RMS</option>
                                        <option value="peak">Peak</option>
                                    </select>

                                    <div>
                                        Frequency:
                                    </div>
                                    <input />
                                    {'(Hz)'}
                                </div>
                            </div>

                            {/* measurement setup */}
                            <div>
                                <div className="border-b font-bold">
                                    Measurement
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <select id="mainlobe_width" name="mainlobe_width">
                                        <option value="relative">Relative</option>
                                        <option value="absolute">Absolute</option>
                                    </select>
                                    <input />
                                    <div>
                                        {"MLW (HZ)"}
                                    </div>

                                    <div>
                                        Filter:
                                    </div>
                                    <select id="filter_val" name="filter_val">
                                        <option value="none">None</option>
                                        <option value="100khz">100kHz</option>
                                        <option value="2mhz">2MHz</option>
                                        <option value="2.4mhz">2.4MHz</option>
                                        <option value="3mhz">3MHz</option>
                                    </select>
                                    <div> {/* blank */} </div>

                                    <div>
                                        Coupling:
                                    </div>
                                    <select id="coupling_val" name="coupling_val">
                                        <option value="ac1m">AC1M</option>
                                        <option value="ac10m">AC10M</option>
                                        <option value="dc1m">DC1M</option>
                                        <option value="dc10m">DC10M</option>
                                        <option value="dcauto">DCAuto</option>
                                    </select>
                                    <div> {/* blank */} </div>

                                    <div>Fs:</div>
                                    <div>--</div>
                                    <div> {/* blank */} </div>

                                    <div>Samples:</div>
                                    <div>--</div>
                                    <div> {/* blank */} </div>

                                    <div>Aperture:</div>
                                    <div>--</div>
                                    <div> {/* blank */} </div>
                                </div>

                                {/* distortion results */}
                                <div>
                                    <div className="border-b"> {/* blank */} </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div>Fs:</div>
                                        <div>--</div>
                                        <div> {/* blank */} </div>

                                        <div>Samples:</div>
                                        <div>--</div>
                                        <div> {/* blank */} </div>

                                        <div>Aperture:</div>
                                        <div>--</div>
                                        <div> {/* blank */} </div>
                                    </div>
                                </div>
                            </div>

                            {/* measurement setup */}
                            <div>
                                <div className="border-b">{/* blank */}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <button>Run</button>
                                <select id="run_mode" name="run_mode">
                                    <option value="single">Single</option>
                                    <option value="sweep">Sweep</option>
                                    <option value="single_shunt">Single w/ Shunt</option>
                                    <option value="sweep_shunt">Sweep w/ Shunt</option>
                                    <option value="continuous">Continuous</option>
                                </select>
                                <button>Breakpoints</button>
                            </div>
                        </div>
                    </div>

                    {/* right-hand plot */}
                    <div className='grow m-2 p-2 border rounded'>
                        <div className=''>
                            <SpectrumPlot pointData={plotData} />
                            <SpectrumPlot pointData={plotData} />
                        </div>


                    </div>

                </div>
            </ShadowBox>
        </>
    )
}

async function openFile(filename, setHaveData, setPlotData) {
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
        dynamicTyping: true,

    })

    const csvHeaders = p.meta.fields
    const csvRows = p.data
    csvRows.pop()

    setPlotData(csvRows)
    setHaveData(true)
}


Spectrum.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
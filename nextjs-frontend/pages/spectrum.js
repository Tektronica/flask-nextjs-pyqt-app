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
                        <div className='h-full'>
                            {
                                haveData ? (
                                    <>
                                        <SpectrumPlot pointData={plotData} title='Temporal Plot' />
                                        <SpectrumPlot pointData={plotData} title='Spectral Plot' />
                                    </>
                                ) : (
                                    <>
                                        <div role="status" className="h-full flex items-center justify-center">
                                            <svg aria-hidden="true" className="mr-2 w-32 h-32 text-gray-200 animate-spin fill-cyan-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </>
                                )
                            }
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
import Layout from '../components/layout'
import ShadowBox from '../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
// import SpectrumPlot from '../components/charts/SpectrumPlot';
import dynamic from 'next/dynamic';

import * as dsp from '../modules/dsp/dsp';

const SpectrumPlot = dynamic(
    () => import('../components/charts/SpectrumPlot'),
    { ssr: false }
)

export default function Spectrum() {
    const [timeData, setTimeData] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    const [spectralData, setSpectralData] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    const [haveData, setHaveData] = useState(false);
    const [isRelative, setIsRelative] = useState(false);
    const [instrumentList, setInstrumentList] = useState({ matching: ['k'], allOther: ['k'] });
    const [isRunning, setIsRunning] = useState(false);
    const [distortion, setDistortion] = useState({});

    const f = 'timeseries_generated_Harmonics_Noise'

    useEffect(() => {
        getInstrumentsMatching('f8588A', setInstrumentList);
        openFile(f, setHaveData, setTimeData, setSpectralData);
    }, []);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    Spectrum Analyzer
                </h1>

                {/* main panel */}
                <div className='flex flex-col'>

                    {/* left-hand options */}

                    <div className="p-2 grid grid-cols-3 gap-4 border">

                        {/* instrument setup */}
                        <div>
                            <div className="border-b font-bold">
                                Instruments
                            </div>
                            <div className='mt-2 text-sm grid grid-rows-2 gap-2'>
                                <div className='flex flex-cols-2'>
                                    <div className='w-24'>
                                        Fluke 8588A:
                                    </div>
                                    <select
                                        id="amplitude_type"
                                        name="amplitude_type"
                                        className='form-select form-select-sm grow px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                    >

                                        {
                                            instrumentList.matching.map(function (name, idx) {

                                                return (
                                                    <option
                                                        key={`${idx}_${name}`}
                                                        value={name}
                                                    >
                                                        {name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='flex flex-cols-2'>
                                    <div className='w-24'>
                                        Fluke 5730A:
                                    </div>

                                    <select
                                        id="amplitude_type"
                                        name="amplitude_type"
                                        className='form-select form-select-sm grow px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                    >
                                        {
                                            instrumentList.allOther.map(function (name, idx) {
                                                return (
                                                    <option
                                                        key={`${idx}_${name}`}
                                                        value={name}
                                                    >
                                                        {name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>

                                </div>
                            </div>
                        </div>

                        {/* amplitude setup */}
                        <div>
                            <div className="border-b font-bold">
                                Amplitude
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    Amplitude:
                                </div>
                                <input className='shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                                <select
                                    id="amplitude_type"
                                    name="amplitude_type"
                                    className='form-select form-select-sm px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                >
                                    <option value="rms">RMS</option>
                                    <option value="peak">Peak</option>
                                </select>

                                <div>
                                    Frequency:
                                </div>
                                <input className='shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                                {'(Hz)'}
                            </div>
                        </div>

                        {/* measurement setup */}
                        <div>
                            <div className="border-b font-bold">
                                Measurement
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                <select
                                    id="mainlobe_width"
                                    name="mainlobe_width"
                                    onChange={e => setIsRelative(e.target.value)}
                                    defaultValue='absolute'
                                    className='form-select form-select-sm px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                >
                                    <option value={true}>Relative</option>
                                    <option value={false}>Absolute</option>
                                </select>
                                <input className='shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                                <div>
                                    {(isRelative === 'true') ? ('MLW/f0') : ('MLW (HZ)')}
                                </div>

                                <div>
                                    Filter:
                                </div>
                                <select
                                    id="filter_val"
                                    name="filter_val"
                                    className='form-select form-select-sm px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                >
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

                                <select
                                    id="coupling_val"
                                    name="coupling_val"
                                    className='form-select form-select-sm px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                                >
                                    <option value="ac1m">AC1M</option>
                                    <option value="ac10m">AC10M</option>
                                    <option value="dc1m">DC1M</option>
                                    <option value="dc10m">DC10M</option>
                                    <option value="dcauto">DCAuto</option>
                                </select>
                                <div> {/* blank */} </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm flex flex-cols-3 space-x-4 justify-start">
                        {
                            (isRunning) ? (
                                <button
                                    type="button"
                                    // disabled
                                    onClick={e => handleClick(e, isRunning, setIsRunning)}
                                    className="w-[126px] text-white font-medium bg-yellow-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
                                >
                                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Running...
                                </button>
                            ) : (
                                <button
                                    onClick={e => handleClick(e, isRunning, setIsRunning)}
                                    className='px-12 text-white font-bold uppercase bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center'
                                >
                                    Run
                                </button>
                            )

                        }
                        <select
                            id="run_mode"
                            name="run_mode"
                            className='form-select form-select-sm px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-cyan-600 focus:outline-none'
                        >
                            <option value="single">Single</option>
                            <option value="sweep">Sweep</option>
                            <option value="single_shunt">Single w/ Shunt</option>
                            <option value="sweep_shunt">Sweep w/ Shunt</option>
                            <option value="continuous">Continuous</option>
                        </select>
                        <button className='px-4 border round uppercase bg-orange-400 text-white font-bold'>
                            Breakpoints
                        </button>
                    </div>

                </div>

            </ShadowBox>

            <ShadowBox>
                <div className="flex">
                    <div className="grow grid grid-cols-2 text-sm">

                        {/* distortion results */}
                        <div className="text-sm grid grid-cols-3">
                            <div>Fs:</div>
                            <div>{haveData ? (distortion.fs) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>Samples:</div>
                            <div>{haveData ? (distortion.samples) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>Aperture:</div>
                            <div>{haveData ? (distortion.aperture) : ('--')}</div>
                            <div> {/* blank */} </div>
                        </div>

                        {/* distortion results */}
                        <div className="text-sm grid grid-cols-3">
                            <div>RMS:</div>
                            <div>{haveData ? (distortion.rms) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>THD</div>
                            <div>{haveData ? (distortion.thd) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>THD+N:</div>
                            <div>{haveData ? (distortion.thdn) : ('--')}</div>
                            <div> {/* blank */} </div>
                        </div>
                    </div>
                </div>

            </ShadowBox >

            <ShadowBox>
                {/* bottom plot */}
                <div className='grow m-2 p-2 border rounded'>
                    {
                        haveData ? (
                            <div className='h-full grid grid-rows-2 gap-8'>
                                <div className='h-[300px]'>
                                    <SpectrumPlot pointData={timeData} title='Temporal Plot' />
                                </div>
                                <div className='h-[300px]'>
                                    <SpectrumPlot pointData={spectralData} title='Spectral Plot' color='rgba(162,20,47,1)' />
                                </div>
                            </div>
                        ) : (
                            <div className='h-full'>
                                <div role="status" className="h-full flex items-center justify-center">
                                    <svg aria-hidden="true" className="mr-2 w-32 h-32 text-gray-200 animate-spin fill-cyan-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </ShadowBox>
        </>
    )
}

async function getInstrumentsMatching(matchingInstr, setState) {

    let url = 'api/instruments';

    const resJSON = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const res = await resJSON.json();
    const instrumentList = res.data
    let matching = [];
    let allOther = [];

    for (const instrument of instrumentList) {
        if (instrument.instr == matchingInstr) {
            matching.push(instrument.name)
        } else {
            allOther.push(instrument.name)
        }
    }

    setState({ matching: matching, allOther: allOther });
};

async function openFile(filename, setHaveData, setTimeData, setSpectralData) {
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

    const yt = toDictOfLists(csvRows).y
    const xt = toDictOfLists(csvRows).x
    const out = dsp.windowed_fft(yt, xt, 'blackman')
    const spectralData = toListOfDicts(out.yf, out.xf)
    // const distortionData = getDistortion(out.yf, out.xf)

    setTimeData(csvRows)
    setSpectralData(spectralData)
    // setDistortion(distortionData)
    setHaveData(true)
};

function handleClick(e, thisState, setState) {
    if (thisState == false) {
        setState(true)
    } else {
        setState(false)
    }

};

function toDictOfLists(obj) {
    // converts a list of data points to array
    // [ {x: 0.0, y: 0.0}, ... ] ==> { x:[0.0, ...], y:[0.0, ...] }

    let dictOfLists = {};

    // all objects must have the same key
    Object.keys(obj[0]).forEach(k => {
        dictOfLists[k] = obj.map(o => o[k]);
    });

    return dictOfLists
};

function toListOfDicts(a1, a2) {
    // https://stackoverflow.com/a/54640282
    return Array.from(a1).map((y, idx) => ({ x: a2[idx], y: y }))
};


Spectrum.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
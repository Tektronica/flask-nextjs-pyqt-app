import Layout from '../../../components/layout'
import ShadowBox from '../../../components/containers/ShadowBox';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
// import SpectrumPlot from '../components/charts/SpectrumPlot';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as dsp from '../../../modules/dsp/dsp';

const SpectrumPlot = dynamic(
    () => import('../../../components/charts/SpectrumPlot'),
    { ssr: false }
)

export default function Spectrum() {
    const [filename, setFilename] = useState('Loading Data...');

    const [timeData, setTimeData] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    const [spectralData, setSpectralData] = useState([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    const [distortion, setDistortion] = useState({});

    const [haveData, setHaveData] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // wait until router is ready to request slug name
        if (!router.isReady) return;

        // get csv data determined by the dynamic route of this slug
        const slug = router.query  // example: Object { distortion: "timeseries_generated_Clean" }
        const filename = slug.distortion


        setFilename(filename)
        openFile(filename, setHaveData, setTimeData, setSpectralData, setDistortion);

    }, [router.isReady]);

    return (
        <>
            <ShadowBox>
                <h1 className="text-xl font-bold pb-4">
                    {filename}
                </h1>

                <div className="flex">
                    <div className="grow grid grid-cols-2 text-sm">
                        {/* distortion results */}
                        <div className="text-sm grid grid-cols-3">
                            <div>Fs:</div>
                            <div>{haveData ? (`${distortion.fs} Hz`) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>Samples:</div>
                            <div>{haveData ? (distortion.samples) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>Aperture:</div>
                            <div>{haveData ? (`${distortion.thdn.f0} Hz`) : ('--')}</div>
                            <div> {/* blank */} </div>
                        </div>

                        {/* distortion results */}
                        <div className="text-sm grid grid-cols-3">
                            <div>RMS:</div>
                            <div>{haveData ? ((distortion.rms).toFixed(6)) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>THD</div>
                            <div>{haveData ? (`${((distortion.thd) * 100).toFixed(4)} %`) : ('--')}</div>
                            <div> {/* blank */} </div>

                            <div>THD+N:</div>
                            <div>{haveData ? (`${((distortion.thdn.thdn) * 100).toFixed(4)} %`) : ('--')}</div>
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
};

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

async function openFile(filename, setHaveData, setTimeData, setSpectralData, setDistortion) {
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
        dynamicTyping: true,

    })

    const csvHeaders = p.meta.fields
    const csvRows = p.data
    csvRows.pop()

    const yt = toDictOfLists(csvRows).y
    const xt = toDictOfLists(csvRows).x
    const out = dsp.windowed_fft(yt, xt, 'blackman')
    const spectralData = toListOfDicts(out.yf, out.xf)

    const distortionData = { thdn: out.thdn, thd: out.thd, rms: out.rms, samples: out.samples, fs: out.fs, f0: out.f0 }

    setTimeData(csvRows)
    setSpectralData(spectralData)
    setDistortion(distortionData)
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
};

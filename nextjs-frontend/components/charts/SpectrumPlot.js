// <!-- requires chart.js -->
// <!-- requires react-chartjs-2 -->
// <!-- chartjs-plugin-zoom -->

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LogarithmicScale,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LogarithmicScale,
    zoomPlugin,
);

const SpectrumPlot = ({ pointData, yscale = 'linear', title, color = 'rgba(75,192,192,1)' }) => {
    const rangeSliderPosition = 20;

    let xScaleMax = pointData[pointData.length - 1].x;
    let newRangeMax = getRangeMax(rangeSliderPosition, xScaleMax);

    const [rangeMax, setRangeMax] = useState(newRangeMax);


    // tracks when data updates by an external state
    useEffect(() => {
        xScaleMax = pointData[pointData.length - 1].x
        const newRangeMax = getRangeMax(rangeSliderPosition, xScaleMax);
        console.log('Client starting plot scale:', rangeSliderPosition, xScaleMax, newRangeMax)
        setRangeMax(newRangeMax)

    }, [pointData])

    // data is a list of point objects
    const data = {
        datasets: [
            {
                // data
                data: pointData,
                indexAxis: 'x',
                // showLine: true,

                //label
                label: title,
                // fill: false,
                lineTension: 0.1,
                borderColor: color,
                backgroundColor: color,
                pointRadius: 0,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        events: [],
        animation: false,
        scales: {
            x: {
                type: 'linear',
                suggestedMin: '0',
                max: `${rangeMax}`,
                gridLines: {
                    display: false,
                    color: "#FFFFFF"
                },
            },
            y: {
                type: yscale,
            },
        },
        plugins: {
            title: {
                display: false,
                text: title,
            },
            legend: {
                // position: 'left',
                labels: {
                    // boxWidth: 10,
                    usePointStyle: true,
                    // pointStyle: 'rect'
                }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: false
                    },
                    mode: "xy",
                    speed: 100
                },
                pan: {
                    enabled: true,
                    mode: "x",
                    // speed: 100
                }
            }
        }
    };

    return (
        <>
            <Line
                // className='bg-zinc-800'
                data={data}
                options={options}
            />
            <input
                onChange={updateMax.bind(this, xScaleMax, setRangeMax)}
                type="range"
                id="end"
                min="10"
                max="100"
                step="10"
                defaultValue={rangeSliderPosition}
                // className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                className="w-full h-2 rounded-lg cursor-pointer"
            />
        </>
    )
}

function getRangeMax(percentOfRange, maxRange) {
    let newRangeMax = Math.round(Math.round((percentOfRange / 100 * maxRange) * 10000 * 6)) / (6 * 10000);

    if (newRangeMax === 0) {
        newRangeMax = maxRange
    }
    return newRangeMax

}

function updateMax(xScaleMax, setRangeMax, e) {
    // slices a percent of the plot array based on range value
    const newSliderValue = parseInt(e.target.value)
    const newRangeMax = getRangeMax(newSliderValue, xScaleMax)
    console.log('client: range slider adjusted to:', newRangeMax, 'Updating max range to: ', newRangeMax)
    setRangeMax(newRangeMax)
}

export default SpectrumPlot

// <!-- requires chart.js -->
// <!-- requires react-chartjs-2 -->
// <!-- chartjs-plugin-zoom -->

import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
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
    zoomPlugin,
);

const SpectrumPlot = ({ pointData }) => {
    const rangeSliderPosition = 20;

    let xScaleMax = pointData[pointData.length - 1].x;
    let newRangeMax = getRangeMax(rangeSliderPosition, xScaleMax);

    const [rangeMax, setRangeMax] = useState(newRangeMax);


    // tracks when data updates by an external state
    useEffect(() => {
        xScaleMax = pointData[pointData.length - 1].x
        const newRangeMax = getRangeMax(rangeSliderPosition, xScaleMax);
        console.log(rangeSliderPosition, xScaleMax, newRangeMax)
        setRangeMax(newRangeMax)

    }, [pointData])

    // data is a list of point objects
    const data = {
        datasets: [
            {
                // data
                data: pointData,
                indexAxis: 'x',
                showLine: true,

                //label
                label: 'test',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            }
        ]
    };

    const options = {
        responsive: true,
        title: {
            // optional: your title here
        },
        events: [],
        animation: false,
        // pan: {
        //     enabled: true,
        //     mode: 'x'
        // },
        scales: {
            x: {
                suggestedMin: '0',
                max: `${rangeMax}`,
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
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
            <Scatter
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
    let newRangeMax = Math.round((percentOfRange / 100 * maxRange) * 10000) / 10000;

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

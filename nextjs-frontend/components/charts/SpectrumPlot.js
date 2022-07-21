// <!-- requires chart.js -->
// <!-- requires react-chartjs-2 -->

import { Scatter } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';

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
);

const SpectrumPlot = ({ pointData }) => {
    const rangePosition = 20;
    let dataLength = pointData.length
    let sliceRange = Math.floor(rangePosition / 100 * dataLength);

    // default is 50% slice
    let newSlice = pointData.slice(0, sliceRange);

    const [dataPoints, setDataPoints] = useState(newSlice);

    useEffect(() => {
        // tracks when data updates by an external state
        newSlice = pointData.slice(0, sliceRange);
        setDataPoints(newSlice)
     }, [pointData]) 

    // data is a list of point objects
    const data = {
        datasets: [
            {
                // data
                data: dataPoints,
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
        // scales: {
        //     xAxes: [{
        //         type: 'linear', // MANDATORY TO SHOW YOUR POINTS! (THIS IS THE IMPORTANT BIT) 
        //         display: true, // mandatory
        //         ticks: {
        //             max: 100,
        //             min: 0,
        //             stepSize: 10
        //         },
        //         scaleLabel: {
        //             display: true, // mandatory
        //             labelString: 'Your label' // optional 
        //         },
        //     }],
        //     yAxes: [{ // and your y axis customization as you see fit...
        //         display: true,
        //         scaleLabel: {
        //             display: true,
        //             labelString: 'Count'
        //         }
        //     }],
        // }
    };

    return (
        <>
            <Scatter
                data={data}
                options={options}
            />
            <input
                onChange={updateMax.bind(this, pointData, setDataPoints)}
                type="range"
                id="end"
                min="10"
                max="100"
                step="10"
                defaultValue={rangePosition}
                // className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                className="w-full h-2 rounded-lg cursor-pointer"
            />
        </>
    )
}

function updateMax(pointData, setPointData, e) {
    // slices a percent of the plot array based on range value
    const range_value = Math.floor(e.target.value)
    const newSliceRange = Math.floor(range_value / 100 * pointData.length)
    console.log('client: range slider adjusted to:', range_value, 'Updating slice to: ', newSliceRange)
    setPointData(pointData.slice(0, newSliceRange))
}

export default SpectrumPlot

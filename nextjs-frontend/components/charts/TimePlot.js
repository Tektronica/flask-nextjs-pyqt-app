// <!-- requires chart.js -->
// <!-- requires react-chartjs-2 -->

import { Line } from 'react-chartjs-2';

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

const TimePlot = ({ pointData, title }) => {

    // https://stackoverflow.com/questions/70684106/react-chartjs-2-typeerror-undefined-is-not-an-object-evaluating-nextdatasets
    // https://www.learnnext.blog/blogs/using-chartjs-in-your-nextjs-application
    // https://www.chartjs.org/docs/latest/general/data-structures.html
    // https://stackoverflow.com/questions/38341758/how-to-dynamically-set-chartjs-line-chart-width-based-on-dataset-size
    // https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a

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
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                pointRadius: 0,
            }
        ]
    };

    const options = {
        responsive: true,
        events: [],
        animation: false,
        scales: {
            x: {
                type: 'linear',
                // suggestedMin: '0',
                // suggestedMax: '100',
                gridLines: {
                    display: false,
                    color: "#FFFFFF"
                },
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
            // zoom: {
            //     zoom: {
            //         wheel: {
            //             enabled: true
            //         },
            //         mode: "xy",
            //         speed: 100
            //     },
            //     pan: {
            //         enabled: true,
            //         mode: "x",
            //         // speed: 100
            //     }
            // }
        }
    };

    return (
        <>
            <Line
                data={data}
                options={options}
            />
        </>
    )
}


export default TimePlot

// <!-- requires chart.js -->
// <!-- requires react-chartjs-2 -->
// https://www.youtube.com/watch?v=x9TLusP2pj0

import { Doughnut } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
);


const DoughnutStat = ({ statData }) => {
    // https://react-chartjs-2.js.org/examples/doughnut-chart

    const passfail = statData.passfail  // [pass, fail]
    const passdetail = statData.passdetail  // ['0-50', '50-75', '75-100']
    const faildetail = statData.faildetail  // ['100-125', '125-150', '150+']

    const pfDoughnut = {
        labels: ['<100%', '>100%'],
        datasets: [
            {
                // data
                data: passfail,

                // label: '# of Votes',
                backgroundColor: [
                    'rgb(130, 192, 204)',
                    'rgb(255, 166, 43)',
                ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                // ],
                borderWidth: 1,
            },
        ],
    };

    const options00 = {
        plugins: {
            title: {
                display: true,
                text: 'Pass/Fail',
            },
            legend: {
                // position: 'left',
                labels: {
                    // boxWidth: 10,
                    usePointStyle: true,
                    // pointStyle: 'rect'
                }
            }
        }
    };

    const passDoughnut = {
        labels: ['<50%', '50-75%', '>75%'],
        datasets: [
            {
                // data
                data: passdetail,

                // label: '# of Votes',
                backgroundColor: [
                    'rgb(130, 192, 204)',
                    'rgb(237, 231, 227)',
                    'rgb(255, 166, 43)',
                ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                // ],
                borderWidth: 1,
            },
        ],
    };

    const options01 = {
        plugins: {
            title: {
                display: true,
                text: 'Passing w.r.t. Spec',
            },
            legend: {
                // position: 'left',
                labels: {
                    render: 'label',
                    // boxWidth: 10,
                    usePointStyle: true,
                    // pointStyle: 'rect'
                }
            }
        }
    };

    const failDoughnut = {
        labels: ['<125%', '125-150%', '>150%'],
        datasets: [
            {
                // data
                data: faildetail,

                // label: '# of Votes',
                backgroundColor: [
                    'rgb(237, 231, 227)',
                    'rgb(255, 166, 43)',
                    'rgb(255, 58, 43)',
                ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                // ],
                borderWidth: 1,
            },
        ],
    };

    const options02 = {
        plugins: {
            title: {
                display: true,
                text: 'Failing w.r.t. Spec',
            },
            legend: {
                // position: 'left',
                labels: {
                    // boxWidth: 10,
                    usePointStyle: true,
                    // pointStyle: 'rect'
                }
            }
        }
    };



    return (
        <>
            <div className='grid grid-cols-3 gap-2'>
                <div className=''>
                    <Doughnut
                        data={pfDoughnut}
                        options={options00}
                    />
                </div>
                <div className=''>
                    <Doughnut
                        data={passDoughnut}
                        options={options01}
                    />
                </div>
                <div className=''>
                    <Doughnut
                        data={failDoughnut}
                        options={options02}
                    />
                </div>
            </div>
        </>
    )
}


export default DoughnutStat

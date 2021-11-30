import React, { useEffect, useState } from 'react';

import { useParams, withRouter } from 'react-router';
//import Highcharts from 'highcharts';
import './barChart.css';
import { getWindowDimensions } from '@utilities/util';
import HighchartsReact from 'highcharts-react-official';

import * as Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more.src';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);


const BarChart: React.FC = () => {

    const { name } = useParams<{ name: string; }>();
    const { meterId } = useParams<{ meterId: string; }>();
    const [options, setOptions] = useState<Highcharts.Options | null>(null);

    const renderIcon = () => {

    }

    let timer: any = null;

    useEffect(() => {
        // This gets called after every render, by default
        // (the first one, and every one after that)

        // If you want to implement componentWillUnmount,
        // return a function from here, and React will call
        // it prior to unmounting.
        return () => {
            if (timer != null) {
                clearInterval(timer);
            }
        };
    }, [
        // dependencies to watch = leave blank to run once or you will get a stack overflow 
    ]);

    setTimeout(() => {
        setOptions({
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
            },

            title: {
                text: "Today's Power Consumption"
            },

            // subtitle: {
            //     text: 'Resize the frame or click buttons to change appearance'
            // },

            // legend: {
            //     align: 'right',
            //     verticalAlign: 'middle',
            //     layout: 'vertical'
            // },

            xAxis: {
                categories: ['TPR - 345', 'TPR - 610', 'TPR - 300', 'TPR - 615', 'TPR - 612'],
                labels: {
                    x: -10
                }
            },

            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Amount'
                }
            },

            series: [{
                type: 'column',
                name: 'Power X',
                data: [1, 4, 3, 5, 2]
            }, {
                type: 'column',
                name: 'Power Y',
                data: [6, 4, 2, 9, 2]
            }, {
                type: 'column',
                name: 'Power Z',
                data: [8, 4, 3, 5, 7]
            }],

            // responsive: {
            //     rules: [{
            //         condition: {
            //             maxWidth: 300
            //         },
            //         // chartOptions: {
            //         //     legend: {
            //         //         align: 'center',
            //         //         verticalAlign: 'bottom',
            //         //         layout: 'horizontal'
            //         //     }
            //         // }
            //         chartOptions: {
            //             legend: {
            //                 align: 'center',
            //                 verticalAlign: 'bottom',
            //                 layout: 'horizontal'
            //             },
            //             yAxis: {
            //                 // labels: {
            //                 //     align: 'left',
            //                 //     x: 0,
            //                 //     y: -5
            //                 // },
            //                 title: {
            //                     text: null
            //                 }
            //             },
            //             subtitle: {
            //                 text: ''// null
            //             },
            //             credits: {
            //                 enabled: false
            //             }
            //         }
            //     }]
            // }
        })
    }, 2000);

    if (options == null) {
        return <p>Loading..</p>;
    }
    else
        return (
            <HighchartsReact
                options={options}
                highcharts={Highcharts}
                allowChartUpdate={true}
                immutable={false}
                updateArgs={[true, true, true]}
                containerProps={{ className: 'chartContainer' }}
            // callback={this.chartCallback}
            />
        );
};

export default BarChart;
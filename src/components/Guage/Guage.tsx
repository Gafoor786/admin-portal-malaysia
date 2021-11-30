import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router';
import { getWindowDimensions } from '@utilities/util';
import './guage.css';
//import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more.src';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);


const Guage: React.FC = () => {

    const { name } = useParams<{ name: string; }>();
    const { meterId } = useParams<{ meterId: string; }>();

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

    const randomNumber = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }





    const options: Highcharts.Options = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'solidgauge',
            // plotBackgroundColor: null,
            // plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            events: {
                load: function () {
                    // set up the updating of the chart each second
                    var series = this.series[0];
                    timer = setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(randomNumber(105, 110));
                        series.setData([y], true, true);
                    }, 1000);
                }
            },


            height: 350
        },

        title: {
            text: 'Motor Speed'
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                // rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' // red
            }]
        },

        series: [{
            type: 'solidgauge',
            name: 'Speed',
            data: [80, 50],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    };

    // // Add some life
    // function (chart: any) {
    //     if (!chart.renderer.forExport) {
    //         setInterval(function () {
    //             var point = chart.series[0].points[0],
    //                 newVal,
    //                 inc = Math.round((Math.random() - 0.5) * 20);

    //             newVal = point.y + inc;
    //             if (newVal < 0 || newVal > 200) {
    //                 newVal = point.y - inc;
    //             }

    //             point.update(newVal);

    //         }, 3000);
    //     }
    // }


    return (
        <HighchartsReact
            options={options}
            highcharts={Highcharts}
            allowChartUpdate={true}
            immutable={false}
            updateArgs={[true, true, true]}
            // containerProps={{ className: 'chartContainer', style: { height: "100%", width: "200px" } }}
            containerProps={{ className: 'chartContainer' }}
        // callback={this.chartCallback}
        />
    );
};

export default Guage;
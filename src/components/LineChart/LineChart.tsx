import * as React from 'react';
import * as ReactDom from 'react-dom';
import './lineChart.css';
import { getWindowDimensions } from '@utilities/util';
import HighchartsReact from 'highcharts-react-official';

import * as Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more.src';
import HighchartsTimeline from 'highcharts/modules/timeline';

HighchartsMore(Highcharts);
HighchartsTimeline(Highcharts);


const options: Highcharts.Options = {
    chart: {

    },
    title: {
        text: 'My chart'
    },
    series: [{
        type: 'line',
        data: [1, 2, 3]
    }],
    // responsive: {
    //     rules: [{
    //         condition: {
    //             maxWidth: 240
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
}

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

const LineChart = (props: HighchartsReact.Props) => <div>
    <HighchartsReact
        options={options}
        highcharts={Highcharts}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[true, true, true]}
        containerProps={{ className: 'chartContainer' }}
        {...props}
    />
</div>


export default LineChart;
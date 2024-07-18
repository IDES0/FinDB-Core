import Highcharts from 'highcharts';

Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: '#1e1e1e',
        style: {
            fontFamily: 'Arial, sans-serif'
        }
    },
    title: {
        style: {
            color: '#FFF',
            fontSize: '20px'
        }
    },
    subtitle: {
        style: {
            color: '#FFF'
        }
    },
    xAxis: {
        gridLineColor: '#444',
        labels: {
            style: {
                color: '#FFF'
            }
        },
        lineColor: '#444',
        minorGridLineColor: '#444',
        tickColor: '#444',
        title: {
            style: {
                color: '#FFF'
            }
        }
    },
    yAxis: {
        gridLineColor: '#444',
        labels: {
            style: {
                color: '#FFF'
            }
        },
        lineColor: '#444',
        minorGridLineColor: '#444',
        tickColor: '#444',
        tickWidth: 1,
        title: {
            style: {
                color: '#FFF'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        style: {
            color: '#FFF'
        }
    },
    legend: {
        itemStyle: {
            color: '#FFF'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#444'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#FFF'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#FFF'
        },
        activeDataLabelStyle: {
            color: '#FFF'
        }
    }
};

// Apply them
Highcharts.setOptions(Highcharts.theme);
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Treemap from 'highcharts/modules/treemap';
import PhotoCarousel from './PhotoCarousel';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';
import './highcharts-dark-theme';

// Initialize the Treemap module
Treemap(Highcharts);

const formatNumber = (num) => {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num;
    }
};

function Home() {
    const [treemapData, setTreemapData] = useState(null);

    useEffect(() => {
        fetch('https://quantum-yen-427619-c5.lm.r.appspot.com/api/treemap_data')
            .then(response => response.json())
            .then(data => setTreemapData(data));
    }, []);

    useEffect(() => {
        if (treemapData) {
            const points = [];
            treemapData.forEach((sector, sectorIndex) => {
                const sectorId = `id_${sectorIndex}`;
                points.push({
                    id: sectorId,
                    name: `${sector.name} (${(sector.percentage_of_total * 100).toFixed(2)}%)`,
                    color: Highcharts.getOptions().colors[sectorIndex],
                    value: sector.market_cap
                });
                sector.industries.forEach((industry, industryIndex) => {
                    points.push({
                        id: `${sectorId}_${industryIndex}`,
                        name: industry.industry,
                        parent: sectorId,
                        value: industry.percentage
                    });
                });
            });

            Highcharts.chart('container', {
                series: [{
                    name: 'Sectors',
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    animationLimit: 1000,
                    dataLabels: {
                        enabled: false
                    },
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true
                        },
                        borderColor: '#1e1e1e', // Darken the border lines between sectors
                        borderWidth: 3,
                        levelIsConstant: false
                    }, {
                        level: 2,
                        dataLabels: {
                            style: {
                                fontSize: '14px'
                            }
                        },
                        borderColor: '#1e1e1e', // Darken the border lines between industries
                        borderWidth: 1
                    }],
                    tooltip: {
                        pointFormatter: function () {
                            return `<b>${this.name}</b>: ${formatNumber(this.value)}`;
                        }
                    },
                    accessibility: {
                        exposeAsGroupOnly: true
                    },
                    data: points
                }],
                subtitle: {
                    text: 'Click points to drill down.',
                    align: 'left'
                },
                title: {
                    text: 'Market Sectors and Industries',
                    align: 'left'
                }
            });
        }
    }, [treemapData]);

    return (
        <div className="Home">
            <PhotoCarousel /> {/* PhotoCarousel as header */}
            <Container className="pt-5">
                <h1 style={{color: "#FFFFFF"}}>FinDB</h1>
                <p>
                    Welcome to FinDB, your all-in-one platform designed to empower users with the insights needed to make informed investment decisions. Our comprehensive models of stocks, indexes, and industries create an extensive database that significantly reduces the time required for investment research. FinDB offers a variety of investment options, enabling you to diversify your portfolio with ease. Whether you're a seasoned investor or just starting out, FinDB provides the tools and information you need to navigate the complexities of the financial markets confidently.
                </p>
                <div id="container" style={{ height: '600px', width: '100%', margin: '0 auto' }}></div>
            </Container>
        </div>
    );
}

export default Home;
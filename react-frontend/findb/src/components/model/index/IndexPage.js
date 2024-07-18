import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import HistoricalChart from './HistoricalChart';

function IndexPage() {
    const [data, setData] = useState(null);
    const { indexTicker } = useParams();

    // Flask API call to get specific instance data from Index model
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/index/${indexTicker}`)
            .then((res) => res.json())
            .then((json_data) => setData(json_data));
    }, [indexTicker]);

    // Utility function to simplify large numbers
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

    return (
        <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px', borderRadius: '10px' }}>
            {data && (
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'white', marginRight: '10px' }}>{data.ticker}</h2>
                        <h1 style={{ color: 'white' }}>{data.name}</h1>
                    </div>
                    <p style={{ marginBottom: '20px', fontSize: '1.2em' }}><strong>NAV: </strong>{data.nav}</p>
                    <div style={{ marginBottom: '20px' }}>
                        <HistoricalChart data={data.last_30_days_prices} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <p><strong>Total Assets: </strong>{formatNumber(data.total_asset)}</p>
                        <p><strong>Top Sector: </strong><Link to={`/sectors/${data.top_sector}`} style={{ color: '#1e90ff' }}>{data.top_sector}</Link></p>
                        <p><strong>Top Sector Percentage: </strong>{data.top_sector_percentage}%</p>
                        <p><strong>YTD Return: </strong>{(data.ytd_return * 100).toFixed(2)}%</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h4>Top Stocks</h4>
                            <Table striped bordered hover variant="dark" size="sm">
                                <tbody>
                                    {data.top_stocks.map((stock, idx) => (
                                        <tr key={idx}>
                                            <td><Link to={`/stocks/${stock}`} style={{ color: '#1e90ff' }}>{stock}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <h4>Sectors</h4>
                            <Table striped bordered hover variant="dark" size="sm">
                                <tbody>
                                    {data.sectors.map((sector, idx) => (
                                        <tr key={idx}>
                                            <td><Link to={`/sectors/${sector}`} style={{ color: '#1e90ff' }}>{sector}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Container>
            )}
        </div>
    );
}

export default IndexPage;
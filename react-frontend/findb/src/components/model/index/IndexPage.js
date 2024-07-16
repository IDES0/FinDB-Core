import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
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
                    <div style={{ marginBottom: '10px' }}>
                        <p><strong>Total Assets: </strong>{data.total_asset}</p>
                        <p><strong>Top Sector: </strong><Link to={`/sectors/${data.top_sector}`} style={{ color: '#1e90ff' }}>{data.top_sector}</Link></p>
                        <p><strong>Top Sector Percentage: </strong>{data.top_sector_percentage}%</p>
                        <p><strong>YTD Return: </strong>{(data.ytd_return * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                        <p><strong>Top Stocks: </strong>
                            {data.top_stocks.map((stock, idx) => (
                                <span key={idx}>
                                    {idx > 0 && ', '}
                                    <Link to={`/stocks/${stock}`} style={{ color: '#1e90ff' }}>{stock}</Link>
                                </span>
                            ))}
                        </p>
                        <p><strong>Sectors: </strong>
                            {data.sectors.map((sector, idx) => (
                                <span key={idx}>
                                    {idx > 0 && ', '}
                                    <Link to={`/sectors/${sector}`} style={{ color: '#1e90ff' }}>{sector}</Link>
                                </span>
                            ))}
                        </p>
                    </div>
                </Container>
            )}
        </div>
    );
}

export default IndexPage;
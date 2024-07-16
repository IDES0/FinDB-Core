import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import HistoricalChart from './HistoricalChart';

function StockPage() {
    const [data, setData] = useState(null);
    const { stockTicker } = useParams();

    // Flask API call to get specific instance data from Stock model
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/stock/${stockTicker}`)
            .then((res) => res.json())
            .then((json_data) => setData(json_data));
    }, [stockTicker]);

    return (
        <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px', borderRadius: '10px' }}>
            {data && (
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: 'white', marginRight: '10px' }}>{data.ticker}</h2>
                        <h1 style={{ color: 'white' }}>{data.name}</h1>
                    </div>
                    <p style={{ marginBottom: '20px', fontSize: '1.2em' }}><strong>Current Price: </strong>{data.current_price}</p>
                    <div style={{ marginBottom: '20px' }}>
                        <HistoricalChart data={data.last_30_days_prices} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <p><strong>Market Cap: </strong>{data.market_cap}</p>
                        <p><strong>Sector: </strong><Link to={`/sectors/${data.sector_key}`} style={{ color: '#1e90ff' }}>{data.sector_key}</Link></p>
                        <p><strong>Industry: </strong>{data.industry_key}</p>
                    </div>
                    <div>
                        <p><strong>Top Indexes: </strong>
                            {data.top_indexes.map((index, idx) => (
                                <span key={idx}>
                                    {idx > 0 && ', '}
                                    <Link to={`/indexes/${index}`} style={{ color: '#1e90ff' }}>{index}</Link>
                                </span>
                            ))}
                        </p>
                    </div>
                </Container>
            )}
        </div>
    );
}

export default StockPage;

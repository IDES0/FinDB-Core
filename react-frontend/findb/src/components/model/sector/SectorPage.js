import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

function SectorPage() {
    const [data, setData] = useState(null);
    const { sectorKey } = useParams();

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

    // Flask API call to get specific instance data from Sector model
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/sector/${sectorKey}`)
            .then((res) => res.json())
            .then((json_data) => setData(json_data));
    }, [sectorKey]);

    let video;
    // Display video for sector
    if (sectorKey === "technology") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/6koYf5GmZ48?si=V_rgvk5IV_vLFvKz" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "financial-services") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/xXStP80NwuM?si=UYZ_zvyCK56tRmue" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "healthcare") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/nkdvvrld5tQ?si=iBX83fBlSFJVqMGH" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "consumer-cyclical") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/MdhUJWoA-Bc?si=YqiTY9MkGjlpmbdR" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "communication-services") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/WIeKQ7hh_XQ?si=rIgnDe5TMJDU66Fp" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "industrials") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/meRKd2a9p9w?si=qEvynAlG9nPdubC_" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "consumer-defensive") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/ZnmpPIY4vkI?si=DKm_CG7LlajGXODL" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "energy") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/bBcOQWosT1w?si=2We34F2t-60cjdRo" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "basic-materials") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/uPCe2jzS5nA?si=zfY9Q2naOR9o47w0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "real-estate") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/WlqYhER9Dd8?si=4ZDkZoCaB8QeRd-p" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else if (sectorKey === "utilities") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/1s375WFZAng?si=yr6tLz9DxRP7zoYm" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    } else {
        video = <iframe width="560" height="315" src="" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>;
    }

    return (
        <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px', borderRadius: '10px' }}>
            {data && (
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 style={{ color: 'white', marginRight: '10px' }}>{data.name}</h1>
                        <h2 style={{ color: 'white', fontSize: '1em' }}> Market Cap: {formatNumber(data.market_cap)}</h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '45%' }}>
                            <h4>Top Stocks</h4>
                            <Table striped bordered hover variant="dark" style={{ fontSize: '0.9em' }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.top_stocks.map((stock, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td><Link to={`/stocks/${stock}`} style={{ color: '#1e90ff' }}>{stock}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div style={{ width: '45%' }}>
                            <h4>Top Indexes</h4>
                            <Table striped bordered hover variant="dark" style={{ fontSize: '0.9em' }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Index</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.top_indexes.map((index, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td><Link to={`/indexes/${index}`} style={{ color: '#1e90ff' }}>{index}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {video}
                    </div>
                </Container>
            )}
        </div>
    );
}

export default SectorPage;
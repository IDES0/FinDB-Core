import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import '../PaginationFormat.css';

function SectorModelTable() {
    const [apiData, setApiData] = useState([]);
    const [activePage, setActivePage] = useState(1);

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

    // Flask API call to get data from Sector model
    useEffect(() => {
        fetch(`http://localhost:5000/api/sector/?page=${activePage}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        ));
    }, [activePage]);

    // Add Sector model data to table element
    const modelEntries = apiData.length && apiData[0].length ? apiData[0].map((sector, index) => (
        <tr key={index}>
            <td>{(activePage - 1) * 10 + index + 1}</td>
            <td><Link to={`/sectors/${sector.sector_key}`} style={{ color: '#1e90ff' }}>{sector.name}</Link></td>
            <td>{formatNumber(sector.market_cap)}</td>
            <td><Link to={`/indexes/${sector.top_index}`} style={{ color: '#1e90ff' }}>{sector.top_index}</Link></td>
            <td><Link to={`/stocks/${sector.top_stock}`} style={{ color: '#1e90ff' }}>{sector.top_stock}</Link></td>
            <td>{sector.market_cap_ratio.toFixed(2)}</td>
        </tr>
    )) : [];

    // Prepare pagination
    const paginationItems = apiData.length && apiData[1] && apiData[1].pages ? Array.from({ length: apiData[1].pages }, (_, number) => (
        <Pagination.Item key={number + 1} active={number + 1 === activePage} onClick={() => setActivePage(number + 1)}>
            {number + 1}
        </Pagination.Item>
    )) : [];

    return (
        <div className='pt-5'>
            <div className="justify-center">
                <Pagination>{paginationItems}</Pagination>
                <br />
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Market Cap</th>
                        <th>Top Index</th>
                        <th>Top Stock</th>
                        <th>Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    {modelEntries}
                </tbody>
            </Table>
        </div>
    );
}

export default SectorModelTable;
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import '../PaginationFormat.css';

function IndexModelTable() {
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

    // Flask API call to get data from Index model
    useEffect(() => {
        fetch(`http://localhost:5000/api/index/?page=${activePage}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        ));
    }, [activePage]);

    // Add Index model data to table element
    const modelEntries = apiData.length && apiData[0].length ? apiData[0].map((index, idx) => (
        <tr key={idx}>
            <td><Link to={`/indexes/${index.ticker}`} style={{ color: '#1e90ff' }}>{index.ticker}</Link></td>
            <td>{index.name}</td>
            <td>{index.nav.toFixed(2)}</td>
            <td>{formatNumber(index.total_asset)}</td>
            <td>{(index.ytd_return * 100).toFixed(2)}%</td>
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
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>NAV</th>
                        <th>Total Asset</th>
                        <th>YTD Return</th>
                    </tr>
                </thead>
                <tbody>
                    {modelEntries}
                </tbody>
            </Table>
        </div>
    );
}

export default IndexModelTable;
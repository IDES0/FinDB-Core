import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import '../PaginationFormat.css';

function StockModelTable() {
    const [apiData, setApiData] = useState([]);
    const [activePage, setActivePage] = useState(1);

    // Fetch data from the Stock model API
    useEffect(() => {
        fetch(`http://localhost:5000/api/stock/?page=${activePage}`)
            .then((res) => res.json())
            .then((json_data) => setApiData([json_data.data, json_data.meta]));
    }, [activePage]);

    // Generate table headers and entries
    const generateTableContent = () => {
        if (apiData.length === 0) return { headers: [], entries: [] };

        const data = apiData[0];
        const preHeaderArr = Object.keys(data[0]).filter((key) => key !== 'industry_key').reverse();

        const headers = ['#', ...preHeaderArr.map((key) => key.replace(/_/g, ' ').toUpperCase())];

        const entryNumber = activePage === 1 ? 0 : (activePage - 1) * 10;
        const entries = data.map((entry, index) => {
            const cells = preHeaderArr.map((key) => {
                if (key === 'ticker') {
                    return (
                        <td key={key}>
                            <Link to={`/stocks/${entry[key]}`}>{entry[key]}</Link>
                        </td>
                    );
                }
                return <td key={key}>{entry[key]}</td>;
            });

            return (
                <tr key={index}>
                    <td>{entryNumber + index + 1}</td>
                    {cells}
                </tr>
            );
        });

        return { headers, entries };
    };

    const { headers, entries } = generateTableContent();

    // Generate pagination
    const paginationItems = apiData.length > 0 ? Array.from({ length: apiData[1].pages }, (_, index) => (
        <Pagination.Item key={index + 1} active={index + 1 === activePage}>
            <button
                style={{ border: 'none', outline: 'none', background: 'transparent', color: 'white' }}
                onClick={() => setActivePage(index + 1)}
            >
                {index + 1}
            </button>
        </Pagination.Item>
    )) : [];

    return (
        <div className="pt-5" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>
            <div className="justify-center mb-3">
                <Pagination>{paginationItems}</Pagination>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries}
                </tbody>
            </Table>
        </div>
    );
}

export default StockModelTable;
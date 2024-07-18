import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import '../PaginationFormat.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function StockModelTable() {
    const [apiData, setApiData] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [sortBy, setSortBy] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const [filterQuery, setFilterQuery] = useState("")
    const [filterAttribute, setFilterAttribute] = useState("")

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

    // Flask API call to get data from Stock model
    useEffect(() => {
        fetch(`http://localhost:5000/api/stock/?page=${activePage}&sort_by=${sortBy}&sort_order=${sortOrder}&q=${filterQuery}&q_in=${filterAttribute}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        ));
    }, [activePage, sortBy, sortOrder, filterAttribute, filterQuery]);

    // Add Stock model data to table element
    const modelEntries = apiData.length && apiData[0].length ? apiData[0].map((stock, idx) => (
        <tr key={idx}>
            <td><Link to={`/stocks/${stock.ticker}`} style={{ color: '#1e90ff' }}>{stock.ticker}</Link></td>
            <td>{stock.name ? stock.name : 'N/A'}</td>
            <td>{stock.current_price ? stock.current_price.toFixed(2) : 'N/A'}</td>
            <td>{stock.market_cap ? formatNumber(stock.market_cap) : 'N/A'}</td>
            <td>{stock.sector_key ? <Link to={`/sectors/${stock.sector_key}`} style={{ color: '#1e90ff' }}>{stock.sector_key}</Link> : 'N/A'}</td>
            <td>{stock.industry_key ? stock.industry_key : 'N/A'}</td>
        </tr>
    )) : [];

    //Sort dropdowns
    const sortButtons = (<ButtonGroup className='pb-3'>
        <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => setSortBy("ticker")}>Ticker</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => setSortBy("name")}>Name</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onClick={() => setSortBy("current_price")}>Current Price</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onClick={() => setSortBy("market_cap")}>Market Cap</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="5" onClick={() => setSortBy("sector_key")}>Sector Key</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="6" onClick={() => setSortBy("industry_key")}>Industry Key</Dropdown.Item>
        </DropdownButton>

        <DropdownButton as={ButtonGroup} title="Sort Order" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => setSortOrder("asc")}>Ascending</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => setSortOrder("des")}>Descending</Dropdown.Item>
        </DropdownButton>
    </ButtonGroup>)

    //Filter dropdown
    const filterButtons = (<ButtonGroup className='pb-3'>
        <DropdownButton as={ButtonGroup} title="Filter By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => {
                setFilterQuery("basic-materials")
                setFilterAttribute("sector_key")
            }}>Basic Materials</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => {
                setFilterQuery("communication-services")
                setFilterAttribute("sector_key")
            }}>Communication Services</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onClick={() => {
                setFilterQuery("consumer-cyclical")
                setFilterAttribute("sector_key")
            }}>Consumer Cyclical</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onClick={() => {
                setFilterQuery("consumer-defensive")
                setFilterAttribute("sector_key")
            }}>Consumer Defensive</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="5" onClick={() => {
                setFilterQuery("energy")
                setFilterAttribute("sector_key")
            }}>Energy</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="6" onClick={() => {
                setFilterQuery("financial-services")
                setFilterAttribute("sector_key")
            }}>Finanacial Services</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="7" onClick={() => {
                setFilterQuery("healthcare")
                setFilterAttribute("sector_key")
            }}>Healthcare</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="8" onClick={() => {
                setFilterQuery("industrials")
                setFilterAttribute("sector_key")
            }}>Industrials</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="9" onClick={() => {
                setFilterQuery("real-estate")
                setFilterAttribute("sector_key")
            }}>Real Estate</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="10" onClick={() => {
                setFilterQuery("technology")
                setFilterAttribute("sector_key")
            }}>Technology</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="11" onClick={() => {
                setFilterQuery("utilities")
                setFilterAttribute("sector_key")
            }}>Utilities</Dropdown.Item>
        </DropdownButton>
    </ButtonGroup>)

    //Add search
    const search = (
        <Form onSubmit={(event) => {
            event.preventDefault()
            setFilterQuery(event.target.search_query.value)
            setFilterAttribute("")
        }}> 
        <Form.Control type="text" name="search_query" placeholder="Search" /> 
        <Button variant="primary" type="submit"> Search </Button> 
        </Form> )

    // Prepare pagination
    const paginationItems = apiData.length && apiData[1] && apiData[1].pages ? Array.from({ length: apiData[1].pages }, (_, number) => (
        <Pagination.Item key={number + 1} active={number + 1 === activePage} onClick={() => setActivePage(number + 1)}>
            {number + 1}
        </Pagination.Item>
    )) : [];

    return (
        <div className='pt-5'>
            <div>
                <div className='pb-3'>
                    {search}
                </div>
                <div>
                    {sortButtons}
                </div>
                <div>
                    {filterButtons}
                </div>
            </div>
            <div className="justify-center">
                <Pagination>{paginationItems}</Pagination>
                <br />
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Current Price</th>
                        <th>Market Cap</th>
                        <th>Sector</th>
                        <th>Industry</th>
                    </tr>
                </thead>
                <tbody>
                    {modelEntries}
                </tbody>
            </Table>
        </div>
    );
}

export default StockModelTable;
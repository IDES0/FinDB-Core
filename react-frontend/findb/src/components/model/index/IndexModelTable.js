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
import Highlighter from 'react-highlight-words';

function IndexModelTable() {
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

    // Flask API call to get data from Index model
    useEffect(() => {
        fetch(`https://quantum-yen-427619-c5.lm.r.appspot.com/api/index/?page=${activePage}&sort_by=${sortBy}&sort_order=${sortOrder}&q=${filterQuery}&q_in=${filterAttribute}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        ));
    }, [activePage, sortBy, sortOrder, filterAttribute, filterQuery]);

    let numInstances = 0;
    if (apiData[1] !== undefined) {
        numInstances = apiData[1].total_instances
    }

    // Add Index model data to table element
    const modelEntries = apiData.length && apiData[0].length ? apiData[0].map((index, idx) => (
        <tr key={idx}>
            <td>{index.ticker ? <Link to={`/indexes/${index.ticker}`} style={{ color: '#1e90ff' }}><Highlighter searchWords={[filterQuery]} textToHighlight={index.ticker}></Highlighter></Link> : index.ticker }</td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={index.name ? index.name : 'N/A'}></Highlighter></td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={index.nav ? index.nav.toFixed(2) : 'N/A'}></Highlighter></td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={index.total_asset ? formatNumber(index.total_asset) : 'N/A'}></Highlighter></td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={index.ytd_return ? (index.ytd_return * 100).toFixed(2) + '%' : 'N/A'}></Highlighter></td>
        </tr>
    )) : [];

    //Sort dropdowns
    const sortButtons = (<ButtonGroup className='pb-3'>
        <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => setSortBy("ticker")}>Ticker</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => setSortBy("name")}>Name</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onClick={() => setSortBy("nav")}>NAV</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onClick={() => setSortBy("total_asset")}>Total Asset</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="5" onClick={() => setSortBy("ytd_return")}>YTD Return</Dropdown.Item>
        </DropdownButton>

        <DropdownButton as={ButtonGroup} title="Sort Order" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => setSortOrder("asc")}>Ascending</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => setSortOrder("des")}>Descending</Dropdown.Item>
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
            <div className='pb-3'>
                {search}
            </div>
            <div>
                {sortButtons}
            </div>
            <div>
                <h1 style={{ color: '#FFFFFF', fontSize: '24px'}}>Total: {numInstances} Indexes</h1>
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
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

function SectorModelTable() {
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

    // Flask API call to get data from Sector model
    useEffect(() => {
        fetch(`https://quantum-yen-427619-c5.lm.r.appspot.com/api/sector/?page=${activePage}&sort_by=${sortBy}&sort_order=${sortOrder}&q=${filterQuery}&q_in=${filterAttribute}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        ));
    }, [activePage, sortBy, sortOrder, filterQuery, filterAttribute]);

    let numInstances = 0;
    if (apiData[1] !== undefined) {
        numInstances = apiData[1].total_instances
    }

    // Add Sector model data to table element
    const modelEntries = apiData.length && apiData[0].length ? apiData[0].map((sector, index) => (
        <tr key={index}>
            <td>{sector.sector_key ? <Link to={`/sectors/${sector.sector_key}`} style={{ color: '#1e90ff' }}><Highlighter searchWords={[filterQuery]} textToHighlight={sector.name}></Highlighter></Link> : <Highlighter searchWords={[filterQuery]} textToHighlight='N/A'></Highlighter>}</td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={sector.market_cap ? formatNumber(sector.market_cap) : 'N/A'}></Highlighter></td>
            <td>{sector.top_index ? <Link to={`/indexes/${sector.top_index}`} style={{ color: '#1e90ff' }}><Highlighter searchWords={[filterQuery]} textToHighlight={sector.top_index}></Highlighter></Link> : 'N/A'}</td>
            <td>{sector.top_stock ? <Link to={`/stocks/${sector.top_stock}`} style={{ color: '#1e90ff' }}><Highlighter searchWords={[filterQuery]} textToHighlight={sector.top_stock}></Highlighter></Link> : 'N/A'}</td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={sector.top_industry ? sector.top_industry: 'N/A'}></Highlighter></td>
            <td><Highlighter searchWords={[filterQuery]} textToHighlight={sector.top_industry ? sector.top_industry_percentage + '%' : 'N/A'}></Highlighter></td>
        </tr>
    )) : [];

    //Sort dropdowns
    const sortButtons = (<ButtonGroup className='pb-3'>
        <DropdownButton as={ButtonGroup} title="Sort By" id="bg-nested-dropdown">
            <Dropdown.Item eventKey="1" onClick={() => setSortBy("name")}>Name</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={() => setSortBy("market_cap")}>Market Cap</Dropdown.Item>
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
                <h1 style={{ color: '#FFFFFF', fontSize: '24px'}}>Total: {numInstances} Sectors</h1>
            </div>
            <div className="justify-center">
                <Pagination>{paginationItems}</Pagination>
                <br />
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Market Cap</th>
                        <th>Top Index</th>
                        <th>Top Stock</th>
                        <th>Top Industry</th>
                        <th>Top Industry Percentage</th>
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
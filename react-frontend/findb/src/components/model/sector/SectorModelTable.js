import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import '../PaginationFormat.css'

function SectorModelTable() {
    const [apiData, setApiData] = useState([]);
    const [activePage, setActivePage] = useState(1);    let modelEntries = [];
    let modelHeaders = [];

    //Flask API call to get data from Sector model
    useEffect(() => {
        fetch(`http://localhost:5000/api/sector/?page=${activePage}`).then((res) => res.json().then((json_data) =>
            setApiData([json_data.data, json_data.meta])
        )
        );
    }, [activePage]);

    //Add Sector model data to table element
    if(apiData.length !== 0) {
        let data = apiData[0];
        let header_arr = Object.keys(data[0]).reverse()
        let index = header_arr.indexOf("sector_key")
        header_arr.splice(index, 1)
        modelHeaders = header_arr.map((h) => <th>{h}</th>)
        let entryNumber = activePage === 1 ? 0 : (activePage - 1) * 10
        for(let i = 0; i < data.length; i++) {
            let th_eles = []
            let arr = Object.keys(data[i]).reverse()
            for(let j = 0; j < arr.length; j++) {
                if(arr[j] === "name"){
                    // Add link to sector instance
                    th_eles.push(<td><Link  to={`/sectors/${data[i]["sector_key"]}`}>{data[i][arr[j]]}</Link></td>)
                } else {
                    if(arr[j] !== "sector_key") {
                        th_eles.push(<td>{data[i][arr[j]]}</td>)
                    }
                }
            }
            modelEntries.push(<tr>
                <td>{entryNumber + 1}</td>
                {th_eles}
            </tr>)
            entryNumber++;
        }
    }

    let items = [];
    let paginationBasic;
    if (apiData.length > 0) {
        for (let number = 1; number <= apiData[1].pages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === activePage}>
                    <button style={{ border: "none", outline: "none", background: "#FFFFFF"}} onClick={() => setActivePage(number)}>
                        {number}
                    </button>
                </Pagination.Item>,
            );
        }

        paginationBasic = (
            <div>
                <Pagination>{items}</Pagination>
                <br />
            </div>
        );
    }

    return (
        <div className='pt-5'>
            <div className="justify-center">
                {paginationBasic}
            </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            {modelHeaders}
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
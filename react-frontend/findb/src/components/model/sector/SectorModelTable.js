import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function SectorModelTable() {
    const [data, setData] = useState([]);
    let modelEntries = [];
    let modelHeaders = [];

    //Flask API call to get data from Sector model
    useEffect(() => {
        fetch("http://localhost:5000/api/sector/").then((res) => res.json().then((json_data) =>
            setData(json_data)
        )
        );
    }, []);

    //Add Sector model data to table element
    if(data.length != 0) {
        let header_arr = Object.keys(data[0]).reverse()
        let index = header_arr.indexOf("sector_key")
        header_arr.splice(index, 1)
        modelHeaders = header_arr.map((h) => <th>{h}</th>)
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
                <td>{i}</td>
                {th_eles}
            </tr>)

        }
    }
    return (
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
    );
}

export default SectorModelTable;
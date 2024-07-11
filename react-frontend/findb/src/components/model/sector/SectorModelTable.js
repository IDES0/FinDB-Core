import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function SectorModelTable() {
    const [data, setData] = useState([]);
    let modelEntries = [];
    let modelHeaders = [];
    useEffect(() => {
        fetch("http://localhost:5000/api/sector/").then((res) => res.json().then((json_data) =>
            setData(json_data)
        )
        );
    }, []);
    if(data.length != 0) {
        let header_arr = Object.keys(data[0]).reverse()
        header_arr.splice(0, 1)
        modelHeaders = header_arr.map((h) => <th>{h}</th>)
        for(let i = 0; i < data.length; i++) {
            let th_eles = []
            let arr = Object.keys(data[i]).reverse()
            for(let j = 0; j < arr.length; j++) {
                if (arr[j] == "sector_key") {
                    continue
                }
                if(arr[j] === "name"){
                    th_eles.push(<td><Link  to={`/sectors/${data[i]["sector_key"]}`}>{data[i][arr[j]]}</Link></td>)
                } else {
                    th_eles.push(<td>{data[i][arr[j]]}</td>)
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
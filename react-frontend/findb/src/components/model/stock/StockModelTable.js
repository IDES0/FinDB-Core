import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function StockModelTable() {
    const [data, setData] = useState([]);
    let modelEntries = [];
    let modelHeaders = [];

    //Flask API call to get data from Stock model
    useEffect(() => {
        fetch("http://localhost:5000/api/stock/").then((res) => res.json().then((json_data) =>
            setData(json_data.data)
        )
        );
    }, []);

    //Add Stock model data to table element
    if (data.length !== 0) {
        let header_arr = Object.keys(data[0]).reverse()
        let index = header_arr.indexOf("industry_key")
        header_arr.splice(index, 1)
        modelHeaders = header_arr.map((h) => <th>{h}</th>)
        for (let i = 0; i < data.length; i++) {
            let th_eles = []
            let arr = Object.keys(data[i]).reverse()
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] === "ticker") {
                    // Add link to stock instance
                    th_eles.push(<td><Link to={`/stocks/${data[i][arr[j]]}`}>{data[i][arr[j]]}</Link></td>)
                } else {
                    if (arr[j] !== "industry_key") {
                        th_eles.push(<td>{data[i][arr[j]]}</td>)
                    }
                }
            }
            modelEntries.push(<tr>
                <td>{i + 1}</td>
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

export default StockModelTable;
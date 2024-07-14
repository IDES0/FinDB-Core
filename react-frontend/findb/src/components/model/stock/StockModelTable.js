import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function StockModelTable() {
    const [data, setData] = useState([]);
    let modelEntries = [];
    let modelHeaders = [];

    //Flask API call to get data from Stock model
    useEffect(() => {
        fetch("https://quantum-yen-427619-c5.lm.r.appspot.com/api/stock/").then((res) => res.json().then((json_data) =>
            setData(json_data)
        )
        );
    }, []);

    //Add Stock model data to table element
    if(data.length != 0) {
        modelHeaders = Object.keys(data[0]).reverse().map((h) => <th>{h}</th>)
        for(let i = 0; i < data.length; i++) {
            let th_eles = []
            let arr = Object.keys(data[i]).reverse()
            for(let j = 0; j < arr.length; j++) {
                if(arr[j] === "ticker"){
                    // Add link to stock instance
                    th_eles.push(<td><Link  to={`/stocks/${data[i][arr[j]]}`}>{data[i][arr[j]]}</Link></td>)
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

export default StockModelTable;
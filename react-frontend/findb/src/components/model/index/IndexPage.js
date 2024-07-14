import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function IndexPage() {
    const [data, setData] = useState();
    let output = []

    const { indexTicker } = useParams();

    // Flask API call to get specific instance data from Index model
    useEffect(() => {
        fetch(`https://quantum-yen-427619-c5.lm.r.appspot.com/api/index/${indexTicker}`).then((res) => res.json().then((json_data) =>
            setData(json_data)
        )
        );
    },[]);

    //Display information for instance
    if (data !== undefined) {
        let list_items = []
        for (let a in data) {
            if(a === "sectors") {
                let links = []
                for(let i in data[a]) {
                    links.push(<div><Link to={`/sectors/${data[a][i]}`}> {data[a][i]} </Link></div>)
                }
                list_items.push(<ListGroup.Item>{links}</ListGroup.Item>)
            } else if(a === "top_stock") {
                list_items.push(<ListGroup.Item><strong>{a}: </strong> <Link to={`/stocks/${data[a]}`}> {data[a]} </Link></ListGroup.Item>)
            } else {
                if(a !== "ticker") {
                    list_items.push(<ListGroup.Item><strong>{a}: </strong>{data[a]}</ListGroup.Item>)
                }
            }
        }
        output.push(
            <Container>
                <h1>{data.ticker}</h1>
                <ListGroup>
                   {list_items}
                </ListGroup>
            </Container>
        )

    }
    return (
        <div className="pt-5">
            {output}
        </div>
    );
}

export default IndexPage;
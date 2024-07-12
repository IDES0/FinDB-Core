import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

function SectorPage() {
    const [data, setData] = useState();
    let output = []

    const { sectorKey } = useParams();

    // Flask API call to get specific instance data from Sector model
    useEffect(() => {
        fetch(`http://quantum-yen-427619-c5.lm.r.appspot.com/api/sector/${sectorKey}`).then((res) => res.json().then((json_data) =>
            setData(json_data)
        )
        );
    }, []);

    //Display information for instance
    if (data != undefined) {
        let list_items = []
        for (let a in data) {
            if (a !== "sector_key" && a !== "name") {
                list_items.push(<ListGroup.Item><strong>{a}: </strong>{data[a]}</ListGroup.Item>)
            }
        }
        output.push(
            <Container>
                <h1>{data.name}</h1>
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

export default SectorPage;
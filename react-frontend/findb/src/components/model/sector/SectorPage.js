import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

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
    });

    let video;
    //Display video for sector
    if (sectorKey === "technology") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/6koYf5GmZ48?si=V_rgvk5IV_vLFvKz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "financial-services") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/xXStP80NwuM?si=UYZ_zvyCK56tRmue" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "healthcare") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/cM4aep7VXb8?si=edywZ4910I7G3s2I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "consumer-cyclical") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/MdhUJWoA-Bc?si=YqiTY9MkGjlpmbdR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "communication-services") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/WIeKQ7hh_XQ?si=rIgnDe5TMJDU66Fp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "industrials") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/meRKd2a9p9w?si=qEvynAlG9nPdubC_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "consumer-defensive") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/ZnmpPIY4vkI?si=DKm_CG7LlajGXODL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if(sectorKey === "energy") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/bBcOQWosT1w?si=2We34F2t-60cjdRo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "basic-materials") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/uPCe2jzS5nA?si=zfY9Q2naOR9o47w0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if (sectorKey === "real-estate") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/WlqYhER9Dd8?si=4ZDkZoCaB8QeRd-p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else if(sectorKey === "utilities") {
        video = <iframe width="560" height="315" src="https://www.youtube.com/embed/dvNOpxS3Mpg?si=vO-NuAB-kF_cjccp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    } else {
        video = <iframe width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    }

    //Display information for instance
    if (data !== undefined) {
        let list_items = []
        for (let a in data) {
            if (a === "top_index") {
                list_items.push(<ListGroup.Item><strong>{a}: </strong> <Link to={`/indexes/${data[a]}`}> {data[a]} </Link></ListGroup.Item>)
            } else if (a === "top_stock") {
                list_items.push(<ListGroup.Item><strong>{a}: </strong> <Link to={`/stocks/${data[a]}`}> {data[a]} </Link></ListGroup.Item>)
            } else {
                if (a !== "name" || a !== "sector_key") {
                    list_items.push(<ListGroup.Item><strong>{a}: </strong>{data[a]}</ListGroup.Item>)
                }
            }
        }
        output.push(
            <Container>
                <h1>{data.name}</h1>
                <div className='pt-3'>
                    {video}
                </div>
                <div className='pt-3'>
                    <ListGroup>
                        {list_items}
                    </ListGroup>
                </div>
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
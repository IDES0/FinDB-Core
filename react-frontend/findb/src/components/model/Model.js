import Container from 'react-bootstrap/Container';
import StockModelTable from "./stock/StockModelTable";
import SectorModelTable from "./sector/SectorModelTable";
import IndexModelTable from "./index/IndexModelTable";

function Model(props) {
    return (
        <div className="Model" style={{ backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
            <header className="Model-header"></header>
            <Container className="pt-5">
                <h1 style={{ color: 'white' }}>{props.name}</h1>
                {props.name === "Stocks" && <StockModelTable />}
                {props.name === "Sectors" && <SectorModelTable />}
                {props.name === "Indexes" && <IndexModelTable />}
            </Container>
        </div>
    );
}

export default Model;
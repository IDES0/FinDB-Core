import Container from 'react-bootstrap/Container';
import StockModelTable from "./stock/StockModelTable";
import SectorModelTable from "./sector/SectorModelTable";
import IndexModelTable from "./index/IndexModelTable";

function Model(props) {
    if (props.name === "Stocks") {
        return (
            <div className="Model">
                <header className="Model-header">
                </header>
                <Container className="pt-5">
                    <h1>{props.name}</h1>
                    <StockModelTable>
                    </StockModelTable>
                </Container>
            </div>
        );
    } else if (props.name === "Sectors") {
        return (
            <div className="Model">
                <header className="Model-header">
                </header>
                <Container className="pt-5">
                    <h1>{props.name}</h1>
                    <SectorModelTable>
                    </SectorModelTable>
                </Container>
            </div>
        )
    } else if (props.name === "Indexes") {
        return (
            <div className="Model">
                <header className="Model-header">
                </header>
                <Container className="pt-5">
                    <h1>{props.name}</h1>
                    <IndexModelTable>
                    </IndexModelTable>
                </Container>
            </div>
        );
    }

}

export default Model;
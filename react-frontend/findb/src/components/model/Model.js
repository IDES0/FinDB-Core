import ModelTable from "./ModelTable";
import Container from 'react-bootstrap/Container';
import StockModelTable from "./StockModelTable";
import IndexModelTable from "./IndexModelTable";
import SectorModelTable from "./SectorModelTable";

function Model(props) {
    if (props.name === "Stock") {
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
    } else if (props.name === "Sector") {
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
    } else if (props.name === "Index") {
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
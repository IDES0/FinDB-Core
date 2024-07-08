import ModelTable from "./ModelTable";
import Container from 'react-bootstrap/Container';

function Model(props) {
    return (
        <div className="Model">
            <header className="Model-header">
            </header>
            <Container className="pt-5">
                <h1>{props.name}</h1>
                <ModelTable>
                </ModelTable>
            </Container>
        </div>
    );
}

export default Model;
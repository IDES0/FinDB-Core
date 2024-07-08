import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary bg-dark-subtle">
                <Container fluid>
                    <Navbar.Brand href="#">FinDB</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="m-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link className='px-5' as={Link} to="/">Home</Nav.Link>
                            <Nav.Link className='px-5' as={Link} to="/about">About</Nav.Link>
                            <Nav.Link className='px-5' as={Link} to="/stocks">Stocks</Nav.Link>
                            <Nav.Link className='px-5' as={Link} to="/sectors">Sectors</Nav.Link>
                            <Nav.Link className='px-5' as={Link} to="/indexes">Indexes</Nav.Link>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavigationBar;
import AboutAccordian from './AboutAccordian';
import Container from 'react-bootstrap/Container';
import GetStats from './GetStats';
import Table from 'react-bootstrap/Table';

function AboutListGroup() {
    return (
        <Container>
            <div style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p><strong>Group Name: Cache Thrashers</strong></p>
                <div style={{ marginBottom: '20px' }}>
                    <strong>Group Members: </strong>
                    <AboutAccordian />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <strong>Stats:</strong>
                    <Table striped bordered hover variant="dark" size="sm">
                        <tbody>
                            <tr>
                                <td><strong>Postman API Link:</strong></td>
                                <td><a href="https://documenter.getpostman.com/view/21850040/2sA3duFDMC" style={{ color: '#1e90ff' }}>Collection</a></td>
                            </tr>
                            <tr>
                                <td><strong>GitLab Issue Tracker Link:</strong></td>
                                <td><a href="https://gitlab.com/stoven2k17/findb/-/issues" style={{ color: '#1e90ff' }}>Issue Tracker</a></td>
                            </tr>
                            <tr>
                                <td><strong>GitLab Repo Link:</strong></td>
                                <td><a href="https://gitlab.com/stoven2k17/findb" style={{ color: '#1e90ff' }}>Repository</a></td>
                            </tr>
                            <tr>
                                <td><strong>GitLab Wiki Link:</strong></td>
                                <td><a href="https://gitlab.com/stoven2k17/findb/-/wikis/technical-report" style={{ color: '#1e90ff' }}>Technical Report</a></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <strong>Data:</strong>
                    <Table striped bordered hover variant="dark" size="sm">
                        <tbody>
                            <tr>
                                <td><strong>Data Sources Link:</strong></td>
                                <td><a href="https://finance.yahoo.com/" style={{ color: '#1e90ff' }}>Yahoo! Finance</a></td>
                            </tr>
                            <tr>
                                <td><strong>Published Postman Collection:</strong></td>
                                <td><a href="https://documenter.getpostman.com/view/21850040/2sA3duFDMC" style={{ color: '#1e90ff' }}>Collection</a></td>
                            </tr>
                            <tr>
                                <td><strong>Description:</strong></td>
                                <td>Data is gathered using the yfinance Python library which calls the Yahoo! Finance REST API. Historical data is scraped as the API does not provide it.</td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <GetStats forTeam={true} user={""} />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div>
                    <strong>Tools:</strong>
                    <Table striped bordered hover variant="dark" size="sm">
                        <tbody>
                            <tr>
                                <td><strong>Tools Used:</strong></td>
                                <td>Flask, yfinance, Pandas, React, React-Bootstrap, PostgreSQL</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
}

export default AboutListGroup;
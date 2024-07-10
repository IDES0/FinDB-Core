import ListGroup from 'react-bootstrap/ListGroup';
import AboutAccordian from './AboutAccordian';
import Container from 'react-bootstrap/Container';
import GetStats from './GetStats';

function AboutListGroup() {
  return (
    <Container className='pt-5'>
      <ListGroup>
        <ListGroup.Item><strong>Group Name: Cache Thrashers</strong></ListGroup.Item>
        <ListGroup.Item>
          <strong>Group Members: </strong>
          <AboutAccordian></AboutAccordian>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Stats:</strong>
          <ul id="team-stats">
            <li><strong>Postman API Link:</strong> <a href="https://documenter.getpostman.com/view/21850040/2sA3duFDMC">Collection</a> </li>
            <li><strong>GitLab Issue Tracker Link:</strong> <a href="https://gitlab.com/stoven2k17/findb/-/issues">Issue Tracker</a></li>
            <li><strong>GitLab Repo Link:</strong> <a href="https://gitlab.com/stoven2k17/findb">Repository</a></li>
            <li><strong>GitLab Wiki Link:</strong> <a href="https://gitlab.com/stoven2k17/findb/-/wikis/technical-report">Technical Report</a></li>
          </ul>
        </ListGroup.Item>
        <ListGroup.Item>
          <ul>
            <strong>Data: </strong>
            <li><strong>Data Sources Link:</strong> <a href="https://finance.yahoo.com/"> Yahoo! Finance</a></li>
            <li><strong>Published Postman Collection:</strong> TBD Phase II</li>
            <li><strong>Description:</strong> Data is gathered using the yfinance Python library which calls the Yahoo! Finance REST API. Historical data is scraped as the API does not provide it.</li>
            <GetStats forTeam={true} user={""} ></GetStats>
          </ul>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Tools: </strong>
          <ul>
            <li><strong>Tools Used:</strong> Flask, yfinance, Pandas, Boostrap, AJAX </li>
          </ul>
        </ListGroup.Item>
      </ListGroup>
    </Container>

  );
}

export default AboutListGroup;
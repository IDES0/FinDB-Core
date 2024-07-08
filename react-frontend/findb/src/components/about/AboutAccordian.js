import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import mihirPhoto from '../../images/mihir.jpg';
import alexPhoto from '../../images/alex.jpg';
import joshuaPhoto from '../../images/josh.jpg'
import mabelPhoto from '../../images/mabel.jpeg'
import stevenPhoto from '../../images/steven.png'
import './AboutAccordian.css';

function AboutAccordian() {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Mihir Arora</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li><strong>Name:</strong> Mihir Arora </li>
            <li><Image className="img-fluid" src={mihirPhoto} rounded /></li>
            <li><strong>Bio:</strong> I’m an undergraduate Computer Science Major at UT Austin. I hope to use my skills both technologically and personal qualities to solve real-world problems. Through my experiences personally and professionally that my growth as a leader, ability to collaborate in group settings, and strong determination have all contributed to my achievements.</li>
            <li><strong>Major Responsibilities:</strong> Contributing to the design of the project in order to articulate it within the technical report and also help with implementation. Additionally, I kept track of different issues and features within the gitlab for the project. </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Alex Borkowski</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li><strong>Name:</strong> Alex Borkowski </li>
            <li><Image className="img-fluid" src={alexPhoto} rounded /></li>
            <li><strong>Bio:</strong> I am Alex Borkowski, a junior at the University of Texas at Austin, dual majoring in Computer Science and Math, with minors in Business and Statistics and Data Science. With work as Product Analyst and projects like electric skateboards and various quantitative research models for stocks, I am also the Team Manager of Texas Wake, showcasing my leadership and organizational skills.</li>
            <li><strong>Major Responsibilities:</strong> Data Sourcing. Developing the Backend</li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Joshua Dierker</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li><strong>Name:</strong> Joshua Dierker</li>
            <li><Image className="img-fluid" src={joshuaPhoto} rounded /></li>
            <li><strong>Bio:</strong> I am a fifth-year Computer Science major with a Business minor and an Applied Statistical Modeling certificate. I like trying new restaurants and collecting vinyl records and wristwatches in my free time.</li>
            <li><strong>Major Responsibilities:</strong> API implementation and documentation. App Engine deploys</li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Mabel Egbirika</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li><strong>Name:</strong> Mabel Egbirika </li>
            <li><Image className="img-fluid" src={mabelPhoto} rounded /></li>
            <li><strong>Bio:</strong> Hello, my name is Mabel Egbirika and I am a senior at the University of Texas at Austin pursuing a BS in Computer Science. From my many years of programming, I have acquired experience in a variety of programming languages including Java, C, C#, Swift, Go, and HTML/CSS. </li>
            <li><strong>Major Responsibilities:</strong> Developing the frontend (Home page, About page, and Model pages) with intuitive website navigation. Displaying collected model data on the frontend.</li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>Steven Nguyen</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li><strong>Name:</strong>Steven Nguyen</li>
            <li><Image className="img-fluid" src={stevenPhoto} rounded /></li>
            <li><strong>Bio:</strong> Hello, I'm Steven, an aspiring software developer with an interest in backend development and database management. </li>
            <li><strong>Major Responsibilities:</strong> Currently in charge of gathering data from various and ensuring its in a format usable by the frontend. </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AboutAccordian;
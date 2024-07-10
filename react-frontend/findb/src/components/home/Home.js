import './Home.css';
import 'bootstrap/dist/css/bootstrap.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ModelCarousel from './ModelCarousel.js';
import PhotoCarousel from './PhotoCarousel.js';

function Home() {
    return (
        <div className="Home">
            <style>{'h1 {font-size: 80px}'}</style>
            <h1> FinDB</h1>
            <Container className="pt-5">
                <p>Welcome to FinDB, your all-in-one platform designed to empower users with the insights needed to make informed investment decisions. Our comprehensive models of stocks, indexes, and industries create an extensive database that significantly reduces the time required for investment research. FinDB offers a variety of investment options, enabling you to diversify your portfolio with ease. Whether you're a seasoned investor or just starting out, FinDB provides the tools and information you need to navigate the complexities of the financial markets confidently.</p>
            
                <PhotoCarousel>  {/* Add the PhotoCarousel component */}
                </PhotoCarousel>
            </Container>
        </div>
    );
}

export default Home;
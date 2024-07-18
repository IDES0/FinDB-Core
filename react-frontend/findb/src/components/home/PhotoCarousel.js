import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.css';
import './PhotoCarousel.css';
import newspaperPhoto from '../../images/newspaper.jpg';
import stockboardPhoto from '../../images/stockboard.jpg';
import stockgraphPhoto from '../../images/stockgraph.png';

function PhotoCarousel() {
    return (
        <div className="photo-carousel">
            <Carousel controls={false} interval={3000}>
                <Carousel.Item>
                    <img className="d-block w-100" src={newspaperPhoto} alt="Newspaper" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={stockboardPhoto} alt="Stockboard" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={stockgraphPhoto} alt="Stockgraph" />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default PhotoCarousel;
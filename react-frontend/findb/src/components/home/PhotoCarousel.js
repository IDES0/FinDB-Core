import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.css';
import './PhotoCarousel.css';
import Image from 'react-bootstrap/Image';
import newspaperPhoto from '../../images/newspaper.jpg';
import stockboardPhoto from '../../images/stockboard.jpg';
import stockgraphPhoto from '../../images/stockgraph.png'
import './PhotoCarousel.css';

function PhotoCarousel() {
    return (
        // <div>
        // <Carousel>
        //     <Carousel.Item>
        //     <Image className="img-fluid" src={newspaperPhoto}  />
        //     </Carousel.Item>
        //     <Carousel.Item>
        //     <Image className="img-fluid" src={stockboardPhoto}  />
        //     </Carousel.Item>
        //     <Carousel.Item>
        //     <Image className="img-fluid" src={stockgraphPhoto}  />
        //     </Carousel.Item>
        // </Carousel>
        // </div>



    <div>
        <Carousel controls = {false}>
            <Carousel.Item>
                <div>
                    <Image className="img-fluid" src={newspaperPhoto}  />
                </div>
            </Carousel.Item>
            <Carousel.Item>
                <div>
                    <Image className="img-fluid" src={stockboardPhoto}  />
                </div>
            </Carousel.Item>
            <Carousel.Item>
                <div>
                    <Image className="img-fluid" src={stockgraphPhoto}  />
                </div>
            </Carousel.Item>
        </Carousel>
    </div>
    );
}

export default PhotoCarousel;

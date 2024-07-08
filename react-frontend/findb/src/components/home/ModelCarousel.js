import Carousel from 'react-bootstrap/Carousel';
import ModelTable from '../model/ModelTable';
import './ModelCarousel.css'

function ModelCarousel() {
  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <h1>Top Stocks</h1>
          <div>
            <ModelTable></ModelTable>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <h1>Top Sectors</h1>
          <div>
            <ModelTable></ModelTable>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <h1> Top Indexes</h1>
          <div>
            <ModelTable></ModelTable>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default ModelCarousel;
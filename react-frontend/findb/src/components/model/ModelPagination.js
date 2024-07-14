import Pagination from 'react-bootstrap/Pagination';
import { Link } from 'react-router-dom';

let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
    <Link to={`/indexes/?page=${number}`}> {number} </Link> 
    </Pagination.Item>,
  );
}

const paginationBasic = (
  <div>
    <Pagination>{items}</Pagination>
    <br />
  </div>
);

render(paginationBasic);
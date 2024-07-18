import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

function NestedExample() {
  return (
    <ButtonGroup>
      <DropdownButton as={ButtonGroup} title="Dropdown1" id="bg-nested-dropdown">
        <Dropdown.Item eventKey="1"><Link onClick={{}}></Link>Dropdown link</Dropdown.Item>
      </DropdownButton>

      <DropdownButton as={ButtonGroup} title="Dropdown2" id="bg-nested-dropdown">
        <Dropdown.Item eventKey="1"><Link onClick={{}}>Dropdown link</Link></Dropdown.Item>
        <Dropdown.Item eventKey="2"><Link onClick={{}}>Dropdown link</Link></Dropdown.Item>
      </DropdownButton>
    </ButtonGroup>
  );
}

export default NestedExample;
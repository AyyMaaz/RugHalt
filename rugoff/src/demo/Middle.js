
import Card from 'react-bootstrap/Card';
import "../demoStyles/Middle.css"

function Middle({ name, role, about }) {
  return (
    <>

      <Card
        key={'Primary'}
        text={'Primary'.toLowerCase() === 'light' ? 'dark' : 'white'}
        style={{ width: '18rem' }}
        className="bg"
      >
        <Card.Header>{name}</Card.Header>
        <Card.Body>
          <Card.Title>{role}</Card.Title>
          <hr />
          <Card.Text>
            {about}
          </Card.Text>
        </Card.Body>
      </Card>

    </>
  );
}

export default Middle;

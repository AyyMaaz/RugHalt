import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';


const FormOwner = ({ App }) => {
  return (
    <Container style={{ background: '#0a0e1a' ,color:'white' }}>
      <Form className='form'>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Full Name</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.OwnerHandler} value={App.owner.name} name='name' type="text" placeholder="Enter Name" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>

      
       

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Your Photo</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.imageHandler} type="file" placeholder="Photo" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.OwnerHandler} value={App.owner.contact} name='contact' type="text" placeholder="Contact" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>NIC</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.OwnerHandler} value={App.owner.nic} name='nic' type="text" placeholder="nic" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Discord Url</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.OwnerHandler} value={App.owner.discord} name='discord' type="text" placeholder="Discord" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Home Address</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.OwnerHandler} value={App.owner.home} name='home' type="text" placeholder="home" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>



        <Button onClick={App.submitOwner} variant="info" >
          Signature
        </Button>
        <br />
        <br />
        <hr />

        <p>Your data is gonna store in blockchain.If we see the proj is rugged it will automatically revealed by automation </p>
      </Form>
    </Container>
  )
}

export default FormOwner

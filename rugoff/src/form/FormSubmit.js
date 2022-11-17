import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { AiOutlineCopy } from "react-icons/ai";



function FormSubmit({ App, setlink }) {
  const [textArea, setTextArea] = useState('')

  function copy() {

    navigator.clipboard.writeText(textArea);
    setlink(true)


  }

  useEffect(() => {
    const id = () => App.data.map((e) => setTextArea(e.args.code))
    id()

  }, [App.data])

  // Select the text field

  return (

    <Container>
      <Form style={{ color: '#0a0e1a' }} className='form'>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ color: 'white' }}>Project Name</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.FormHandler} value={App.form.name} name='name' type="text" placeholder="Enter Name" />
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label style={{ color: 'white' }}>Description</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.FormHandler} value={App.form.desc} name="desc" as="textarea" rows={3} placeholder='Project Description' />
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicImage">
          <Form.Label style={{ color: 'white' }}>Project Photo</Form.Label>
          <Form.Control style={{ background: '#0a0e1a' }} onChange={App.profileHandler} type='file' accept='image/*' placeholder="Photo" />
          <Form.Text className="text-muted">

          </Form.Text>
        </Form.Group>

       
          <Button onClick={App.sendProfileToIPFS} variant="info" >upload</Button>
        

        ..

        <Button onClick={App.submitProject} variant="info" >
          Submit
        </Button>
        {/* {toast.success('goo')} */}
        <p>{App.error}</p>
        <br />
        {App.data.map((e) => {
          return (
            <>
              <p style={{ color: 'white' }}>{e.args.code.toString()}</p>
       
            </>
          )
        })}
        
        {App.loading === true &&
          <>
       
            <AiOutlineCopy color='white' cursor='pointer' onClick={copy} />
            <hr style={{ color: 'white' }} />
            <p style={{ color: 'white' }}>Paste this code on your discord is for Your community.</p>
          </>
        }
      </Form>
    </Container>
  );
}
export default FormSubmit
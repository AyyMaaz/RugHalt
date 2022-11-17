import React, { useState } from 'react'
import NavMain from '../Components/NavMain'
import FormOwner from './FormOwner'
import FormSubmit from './FormSubmit'
import "../formStyle/Main.css"
import Footer from '../demo/Footer'
import { useContext } from 'react';
import { myApp } from '../App';



const Main = () => {
  const App=useContext(myApp)
  const [link, setlink] = useState(false)
  return (
    <div className='main'>
      <NavMain />
      <div className='mainDiv'>
        <button className='mainButton' onClick={() => { setlink(true) }}>Owner Details</button>...
        <button className='mainButton' onClick={() => { setlink(false) }}>Project Details</button>
      </div>
      {link ? <FormOwner App={App} setlink={setlink}/> : <FormSubmit App={App} setlink={setlink} />}
      <Footer />
    </div>

  )
}

export default Main
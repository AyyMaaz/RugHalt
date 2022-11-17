import React from 'react'
import Navbar from './Navbar'
import Heading from './Heading'
import Middle from './Middle'
import Footer from './Footer'
import '../demoStyles/Home.css'

const Home = () => {
  return (
    <div>
    <Navbar/>
    <Heading/>
    <div className='middle'>
            <Middle name='Maaz' role='Development and Design' about='Hey i m maaz a self taught Junior full stack blockchain developer.
            All the thing in this project i built alone from scratch .Its my first hackathon ever so it was difficult for me first.But Luckily i completed the project at time.Much fun in this project.Lets Goo'/>
          
           

    </div>
      <Footer/>
    </div>
  )
}

export default Home

import React from 'react'
import NavMain from './NavMain'
import Banner from './Banner'
import List from './List'
import Footer from '../demo/Footer'
// import Reference from './Reference'
import { useContext } from 'react';
import { myApp } from '../App';



export const Projects = () => {
  const App=useContext(myApp)
  return (
  <>
    <NavMain App={App} />
    <Banner/>
    <List App={App} />
    <Footer/>
  </>
  )
}

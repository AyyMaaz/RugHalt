import React from 'react'
import image from '../static/rug.jpg'
import image2 from '../static/Rug-pull.jpeg'
import image3 from '../static/Avoid-Rug-Pull.png'
import "../ComponentStyle/Banner.css"

const Banner = () => {
  return (
    <div className='banner'>
   
      <img
        className='img'
        width={400}
        height={300}

        src={image}
        alt="First slide"
      />

      <img className='img' width={400}
        height={300}
        src={image2}
        alt="Second slide"
      />

      <img
        className='img'
        width={400}
        height={300}

        src={image3}
        alt="Third slide"
      />
   
    </div>
  )
}

export default Banner




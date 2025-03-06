import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './style/RotatingTagline.css';
import Image1 from '../assets/Create1.png'; 
import Image2 from '../assets/Innovate1 (4).png';
import Image3 from '../assets/Transform1.png';

const RotatingTagline = () => {
  const images = [Image1 , Image2 , Image3]; // Replace with your actual image variables or paths

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Set to true to enable automatic scrolling
    autoplaySpeed: 3000, // Adjust the speed (in milliseconds)
    arrows: false, // Hide arrows
  };

  return (
    <div className="rotating-tagline-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="tagline-item">
            <h1 className="rotating-tagline-container font-bold text-transparent text-3xl md:text-8xl mt-2 bg-clip-text bg-gradient-to-r from-blue-800 via-blue-500 to-blue-200 leading-none">{tagline}</h1>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RotatingTagline;

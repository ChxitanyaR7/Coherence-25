import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './style/RotatingTagline.css';

import Image1 from '../assets/Create.png'; // Replace with your actual image paths
import Image2 from '../assets/Innovate.png';
import Image3 from '../assets/Transform.png';

const RotatingTagline = () => {
  const images = [Image1, Image2, Image3]; // Replace with your actual image variables or paths

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
            <img src={image} alt={`${index + 1}`} className="rotating-tagline-container" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RotatingTagline;

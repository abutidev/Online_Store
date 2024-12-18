import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
// import hero_image from '../Assets/hero_image.png';
import new_hero_image from '../Assets/hero_2.png';




const Hero = () => {

  return (
    <div className="hero" data-testid="hero">
      <div className="hero-left">       
        <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>Fashion</p>
        
                </div>
                <p>collections</p>
                <p>for everyone</p>
            </div>
            <div className="hero-latest-btn">
                <div>Latest Collection</div>
                <img src={arrow_icon} alt="" />
            </div>
       </div>
       <div className="hero-right">
            {/* <img src={hero_image} alt="" /> */}
            <img src={new_hero_image} alt="" />
       </div>
      
    </div>

  ) 
}

export default Hero
import React from "react";
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navprofile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className="navbar" data-testid= "banner">
        <img src={navlogo} alt="logo" className="nav-logo" />
        <img src={navprofile} alt="profile" className="nav-profile" /> 
    </div>
  );
};

export default Navbar
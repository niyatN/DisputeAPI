import React from 'react';
import {NavLink} from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav-wrapper blue darken-3">
      <div className="container">
        <a className="brand-logo left">
        <img src ="https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom-white.svg" />
        </a>
        <ul className="right">
      
          <li><NavLink to='/'>Home</NavLink></li>
          
          <li><NavLink to="/search">Search</NavLink></li>
          <li><NavLink to="/insight">Dispute Insight</NavLink></li>
        </ul>
      </div>
    </nav> 
  )
}
export default Navbar;
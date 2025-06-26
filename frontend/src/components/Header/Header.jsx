import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Satisfy Your Cravings with Every Bite</h2>
        <p>Explore a wide range of delicious dishes crafted with premium ingredients and expert care. From comfort food to gourmet meals, we're here to elevate your dining experience—one flavorful bite at a time.</p>
        <a href="#explore-menu" className="view-menu-button">View Menu</a>
      </div>
    </div>
  )
}

export default Header
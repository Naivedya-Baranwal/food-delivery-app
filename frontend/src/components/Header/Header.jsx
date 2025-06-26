import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your favourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable arrau of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience , one delicious meal at a time.</p>
            <a href="#explore-menu" className="view-menu-button" onClick={() => document.getElementById('explore-menu').scrollIntoView({ behavior: 'smooth' })}>View Menu</a>
        </div>
    </div>
  )
}

export default Header
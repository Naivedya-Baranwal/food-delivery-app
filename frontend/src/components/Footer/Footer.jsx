import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
function Footer() {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo1} alt="" />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit vel accusamus, ipsum expedita, aperiam ut necessitatibus incidunt animi aspernatur quas quia ullam, voluptate voluptatem nihil cumque harum consequatur neque at.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-345-234-4564</li>
                        <li>contact@tomato.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2025 © Tomato.com - All Right Reserved</p>
        </div>
    )
}

export default Footer
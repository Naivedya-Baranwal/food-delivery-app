import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isLoggedIn, setShowLogin }) => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                {isLoggedIn ? (
                    <NavLink to="/add" className="sidebar-option">
                        <img src={assets.add_icon} alt="" />
                        <p>Add Items</p>
                    </NavLink>
                ) : (
                    <div onClick={() => setShowLogin(true)} className="sidebar-option">
                        <img src={assets.add_icon} alt="" />
                        <p>Add Items</p>
                    </div>
                )}


                {isLoggedIn ? (
                  <NavLink to='/list' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>List Items</p>
                </NavLink>
                ) : (
                    <div onClick={() => setShowLogin(true)} className="sidebar-option">
                        <img src={assets.order_icon} alt="" />
                        <p>List Items</p>
                    </div>
                )}


                {isLoggedIn ? (
                     <NavLink to='/orders' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Orders</p>
                </NavLink>
                ) : (
                    <div onClick={() => setShowLogin(true)} className="sidebar-option">
                        <img src={assets.order_icon} alt="" />
                        <p>Orders</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar
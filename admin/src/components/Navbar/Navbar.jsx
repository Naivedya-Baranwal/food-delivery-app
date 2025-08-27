import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom';
import axios from '../../../utils/credentials';
import { toast } from 'react-toastify';

const Navbar = ({isLoggedIn,setIsLoggedIn,setShowLogin}) => {
  const handleLogout = async()=>{
     try {
      const response = await axios.post("/api/admin/logout");
      if(response.data.success){
        setIsLoggedIn(false);
        toast.success(response.data.message);
      }
     } catch (error) {
       toast.error('error in logout');
       console.log(error)
     }
  }
  return (
<div className="navbar">
  <Link to='/'>
    <img src={assets.logo} alt="" className="logo" />
  </Link>
  <div className="nav-actions">
    {isLoggedIn ? (
      <button className="nav-btn" onClick={handleLogout}>LogOut</button>
    ) : (
      <button className="nav-btn" onClick={() => setShowLogin(true)}>LogIn</button>
    )}
    <img className='profile' src={assets.profile_image} alt="" />
  </div>
</div>

  )
}

export default Navbar
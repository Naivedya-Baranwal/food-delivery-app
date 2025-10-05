import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";

const Navbar = ({ setShowLogin }) => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    dispatch(logout());
  }
  return (
    <div className='flex justify-between mx-8'>
      <h1>naivedyam</h1>
      <div className='flex gap-x-6'>
        <span>Past orders</span>
        {!token ? (
          <span onClick={()=>setShowLogin(true)}>Login</span>
        ) : (
          <div className='flex gap-x-6'>
          <span>My Orders {user?.name}</span>
          <span onClick={handleLogout}>Logout</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

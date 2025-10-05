import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser,registerUser } from '../store/auth/authThunk';

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      if (currState === "Login") {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Login successful!");
    } else {
       await dispatch(registerUser(data)).unwrap();
      toast.success("Account created!");
    }
     setShowLogin(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid bg-black/60 -mt-[90px]">
      <form
        onSubmit={onLogin}
        className="place-self-center w-[min(90%,23vw)] min-w-[330px] bg-white flex flex-col gap-6 p-6 rounded-lg text-gray-500 text-sm animate-fadeIn"
      >
        {/* Title */}
        <div className="flex justify-between items-center text-black">
          <h2 className="text-lg font-semibold">{currState}</h2>
         <button onClick={() => setShowLogin(false)}>X</button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-5">
          {currState === "Login" ? null : (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
                className="border border-gray-300 p-2 rounded-md outline-none focus:border-tomato focus:ring-1 focus:ring-tomato"
              />
              <input
                name="phone"
                onChange={onChangeHandler}
                value={data.phone}
                type="text"
                placeholder="Your phone number"
                required
                className="border border-gray-300 p-2 rounded-md outline-none focus:border-tomato focus:ring-1 focus:ring-tomato"
              />
            </>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
            className="border border-gray-300 p-2 rounded-md outline-none focus:border-tomato focus:ring-1 focus:ring-tomato"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
            className="border border-gray-300 p-2 rounded-md outline-none focus:border-tomato focus:ring-1 focus:ring-tomato"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="text-black py-2 border rounded-md text-base font-medium hover:opacity-90 transition"
        >
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {/* Checkbox */}
        <div className="flex items-start gap-2 -mt-3">
          <input type="checkbox" required className="mt-1" />
          <p className="text-xs">
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>

        {/* Switch between Login / Signup */}
        {currState === "Login" ? (
          <p className="text-sm">
            Create a new account?
            <span
              onClick={() => setCurrState("Sign Up")}
              className="text-tomato font-medium cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?
            <span
              onClick={() => setCurrState("Login")}
              className="text-tomato font-medium cursor-pointer ml-1"
            >
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;

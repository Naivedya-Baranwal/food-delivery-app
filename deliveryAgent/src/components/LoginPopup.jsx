// // components/LoginPopup.jsx
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, registerUser } from '../store/auth/authThunk';
// import { clearMessages } from '../store/auth/authSlice';

// function LoginPopup({ setShowLogin }) {
//     const [currState, setCurrState] = useState("Login");
//     const [data, setData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         password: ""
//     });

//     const dispatch = useDispatch();
//     const { loading, error, successMessage } = useSelector((state) => state.auth);

//     // Prevent body scroll
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'auto';
//             dispatch(clearMessages());
//         };
//     }, [dispatch]);

//     // Display success/error messages
//     useEffect(() => {
//         if (successMessage) {
//             toast.success(successMessage);
            
//             if (currState === "Sign Up") {
//                 setCurrState("Login");
//                 setData({
//                     name: "",
//                     email: "",
//                     phone: "",
//                     password: ""
//                 });
//             } else {
//                 setShowLogin(false);
//             }
//         }

//         if (error) {
//             toast.error(error);
//         }
//     }, [successMessage, error, currState, setShowLogin]);

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData((prev) => ({ ...prev, [name]: value }));
//     };

//     const onSubmit = async (event) => {
//         event.preventDefault();
//         dispatch(clearMessages());

//         try {
//             if (currState === "Login") {
//                 await dispatch(loginUser({
//                     email: data.email,
//                     password: data.password
//                 })).unwrap();
//             } else {
//                 await dispatch(registerUser(data)).unwrap();
//             }
//         } catch (err) {
//             console.error("Auth error:", err);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
//             <div 
//                 className="fixed inset-0 cursor-pointer" 
//                 onClick={() => setShowLogin(false)}
//             ></div>
            
//             <form
//                 onSubmit={onSubmit}
//                 className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slideUp"
//             >
//                 {/* Header with Gradient - Smaller */}
//                 <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-4 text-white">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h2 className="text-xl font-bold">Naivedyam Partner</h2>
//                             <p className="text-sm opacity-90 mt-0.5">
//                                 {currState === "Login" 
//                                     ? "Welcome back!" 
//                                     : "Join us today"}
//                             </p>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={() => setShowLogin(false)}
//                             className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm cursor-pointer"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Form Body - Compact */}
//                 <div className="p-6">
//                     {/* Toggle Tabs - Smaller */}
//                     <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setCurrState("Login");
//                                 dispatch(clearMessages());
//                             }}
//                             className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
//                                 currState === "Login"
//                                     ? "bg-white text-orange-600 shadow-md"
//                                     : "text-gray-600 hover:text-orange-600"
//                             }`}
//                         >
//                             Login
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setCurrState("Sign Up");
//                                 dispatch(clearMessages());
//                             }}
//                             className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
//                                 currState === "Sign Up"
//                                     ? "bg-white text-orange-600 shadow-md"
//                                     : "text-gray-600 hover:text-orange-600"
//                             }`}
//                         >
//                             Sign Up
//                         </button>
//                     </div>

//                     {/* Input Fields - Compact */}
//                     <div className="space-y-3">
//                         {currState === "Sign Up" && (
//                             <>
//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                         Full Name
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                             </svg>
//                                         </div>
//                                         <input
//                                             name="name"
//                                             onChange={onChangeHandler}
//                                             value={data.name}
//                                             type="text"
//                                             placeholder="Enter your full name"
//                                             required
//                                             className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 transition"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                         Phone Number
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                             </svg>
//                                         </div>
//                                         <input
//                                             name="phone"
//                                             onChange={onChangeHandler}
//                                             value={data.phone}
//                                             type="tel"
//                                             placeholder="Enter your phone number"
//                                             required
//                                             className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 transition"
//                                         />
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         <div>
//                             <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                 Email Address
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     name="email"
//                                     onChange={onChangeHandler}
//                                     value={data.email}
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     required
//                                     className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 transition"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     name="password"
//                                     onChange={onChangeHandler}
//                                     value={data.password}
//                                     type="password"
//                                     placeholder="Enter your password"
//                                     required
//                                     minLength={8}
//                                     className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-orange-500 transition"
//                                 />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">Min. 8 characters</p>
//                         </div>
//                     </div>

//                     {/* Terms Checkbox - Compact */}
//                     <div className="flex items-start gap-2 mt-4 p-2.5 bg-gray-50 rounded-lg">
//                         <input 
//                             type="checkbox" 
//                             required 
//                             className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
//                         />
//                         <p className="text-xs text-gray-600">
//                             By continuing, I agree to the <span className="text-orange-600 font-semibold cursor-pointer hover:underline">terms of use</span> & <span className="text-orange-600 font-semibold cursor-pointer hover:underline">privacy policy</span>
//                         </p>
//                     </div>

//                     {/* Submit Button - Compact */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full mt-4 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg cursor-pointer ${
//                             loading
//                                 ? 'bg-gray-400 cursor-not-allowed'
//                                 : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl'
//                         }`}
//                     >
//                         {loading ? (
//                             <span className="flex items-center justify-center">
//                                 <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                                 </svg>
//                                 Processing...
//                             </span>
//                         ) : (
//                             <>
//                                 {currState === "Sign Up" ? "Create Account" : "Login"}
//                             </>
//                         )}
//                     </button>
//                 </div>

//                 {/* Footer - Compact */}
//                 <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200">
//                     <p className="text-xs text-gray-600">
//                         Need help? <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Contact Support</span>
//                     </p>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default LoginPopup;

// components/LoginPopup.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../store/auth/authThunk';
import { clearMessages } from '../store/auth/authSlice';

function LoginPopup({ setShowLogin }) {
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector((state) => state.auth);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
            dispatch(clearMessages());
        };
    }, [dispatch]);

    // Display success/error messages
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            
            if (currState === "Sign Up") {
                setCurrState("Login");
                setData({
                    name: "",
                    email: "",
                    phone: "",
                    password: ""
                });
            } else {
                setShowLogin(false);
            }
        }

        if (error) {
            toast.error(error);
        }
    }, [successMessage, error, currState, setShowLogin]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        dispatch(clearMessages());

        try {
            if (currState === "Login") {
                await dispatch(loginUser({
                    email: data.email,
                    password: data.password
                })).unwrap();
            } else {
                await dispatch(registerUser(data)).unwrap();
            }
        } catch (err) {
            console.error("Auth error:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div 
                className="fixed inset-0 cursor-pointer" 
                onClick={() => setShowLogin(false)}
            ></div>
            
            <form
                onSubmit={onSubmit}
                className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slideUp"
            >
                {/* Header with Purple-Blue Gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Naivedyam</h2>
                            <p className="text-sm opacity-90 mt-0.5">
                                {currState === "Login" 
                                    ? "Welcome back!" 
                                    : "Join us today"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowLogin(false)}
                            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    {/* Toggle Tabs */}
                    <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setCurrState("Login");
                                dispatch(clearMessages());
                            }}
                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
                                currState === "Login"
                                    ? "bg-white text-purple-600 shadow-md"
                                    : "text-gray-600 hover:text-purple-600"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrState("Sign Up");
                                dispatch(clearMessages());
                            }}
                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
                                currState === "Sign Up"
                                    ? "bg-white text-purple-600 shadow-md"
                                    : "text-gray-600 hover:text-purple-600"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-3">
                        {currState === "Sign Up" && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            name="name"
                                            onChange={onChangeHandler}
                                            value={data.name}
                                            type="text"
                                            placeholder="Enter your full name"
                                            required
                                            className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            name="phone"
                                            onChange={onChangeHandler}
                                            value={data.phone}
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            required
                                            className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    name="email"
                                    onChange={onChangeHandler}
                                    value={data.email}
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    name="password"
                                    onChange={onChangeHandler}
                                    value={data.password}
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    minLength={8}
                                    className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2 mt-4 p-2.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                        <input 
                            type="checkbox" 
                            required 
                            className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <p className="text-xs text-gray-600">
                            By continuing, I agree to the <span className="text-purple-600 font-semibold cursor-pointer hover:underline">terms of use</span> & <span className="text-purple-600 font-semibold cursor-pointer hover:underline">privacy policy</span>
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-4 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg cursor-pointer ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:shadow-xl hover:scale-[1.02]'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <>
                                {currState === "Sign Up" ? "Create Account" : "Login"}
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 text-center border-t border-purple-100">
                    <p className="text-xs text-gray-600">
                        Need help? <span className="text-purple-600 font-semibold cursor-pointer hover:underline">Contact Support</span>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginPopup;

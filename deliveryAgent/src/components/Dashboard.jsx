
// // components/Dashboard.jsx
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     getAllAssignments, 
//     acceptAssignmentThunk, 
//     getCurrentAssignmentThunk,
//     initializeSocketThunk,
// } from '../store/delivery/deliveryThunk';
// import { disconnectSocket, removeOrderFromSocket } from '../store/delivery/deliverySlice';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// const Dashboard = ({setShowLogin}) => {
//   const dispatch = useDispatch();
//   const { user, token } = useSelector(state => state.auth);
//   const isAuthenticated = !!token;
//   const { 
//     assignments, 
//     loading: assignmentsLoading, 
//     accepting,
//     acceptedOrder,
//     loadingData,
//     socketConnected,
//     socket,
//   } = useSelector(state => state.delivery);
//   const navigate = useNavigate();

//   // Initialize socket
//   useEffect(() => {
//     if (isAuthenticated && !socketConnected) {
//       console.log("🔌 Initializing socket connection...");
//       dispatch(initializeSocketThunk());
//     }
//     return () => {
//       if (socketConnected && socket) {
//         socket.disconnect();
//         dispatch(disconnectSocket());
//       }
//     };
//   }, [isAuthenticated, dispatch, socketConnected, socket]);

//   // Socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewOrderBroadcast = (data) => {
//       console.log("📦 NEW ORDER BROADCAST:", data);
//       toast.info(
//         `New order available! From ${data.order.name} - ₹${data.order.amount}`,
//         { autoClose: 5000, position: 'top-right' }
//       );
//       dispatch(getAllAssignments());
//     };

//     const handleOrderAcceptedByOther = (data) => {
//       console.log("🚫 ORDER TAKEN BY OTHER AGENT:", data);
//       toast.warning(
//         'An order was just accepted by another agent',
//         { autoClose: 3000, position: 'top-right' }
//       );
//       dispatch(removeOrderFromSocket(data.assignmentId));
//     };

//     socket.on('orderAcceptedByOther', handleOrderAcceptedByOther);
//     socket.on('newOrderAvailable', handleNewOrderBroadcast);
    
//     return () => {
//       socket.off('newOrderAvailable', handleNewOrderBroadcast);
//       socket.off('orderAcceptedByOther', handleOrderAcceptedByOther);
//     };
//   }, [socket, dispatch]);

//   // Fetch assignments on mount
//   useEffect(() => {
//     if (user?.id) {
//       console.log("📦 Fetching assignments for user:", user.id);
//       dispatch(getAllAssignments());
//       dispatch(getCurrentAssignmentThunk());
//     }
//   }, [user?.id, dispatch]);

//   // ✅ Landing Page when not authenticated
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br mt-17 from-orange-50 via-white to-green-50">
//         {/* Hero Section */}
//         <div className="container mx-auto px-4 py-5">
//           <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
//             <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
//               Delivery Partner App
//             </p>
//             <p className="text-lg text-gray-600 mb-12 max-w-2xl">
//               Join our delivery partner network and start earning on your own schedule. 
//               Fast deliveries, instant payments, and 24/7 support.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-16">
//               <button 
//                  onClick={() => setShowLogin(true)}
//                 className="px-8 py-4 cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
//               >
//                 Login as Partner
//               </button>
//               <button 
//                 onClick={() => setShowLogin(true)}
//                 className="px-8 py-4 cursor-pointer bg-white text-orange-600 text-lg font-bold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-lg"
//               >
//                 Become a Partner
//               </button>
//             </div>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
//             {/* Feature 1 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Flexible Hours</h3>
//               <p className="text-gray-600 text-center">
//                 Work whenever you want. Set your own schedule and maintain work-life balance.
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Instant Payments</h3>
//               <p className="text-gray-600 text-center">
//                 Get paid immediately after every delivery. No waiting, no hassle.
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">24/7 Support</h3>
//               <p className="text-gray-600 text-center">
//                 Our support team is always available to help you with any issues.
//               </p>
//             </div>
//           </div>

//           {/* How It Works */}
//           <div className="mt-24 max-w-6xl mx-auto">
//             <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
//                 <h4 className="font-bold text-lg mb-2">Sign Up</h4>
//                 <p className="text-gray-600 text-sm">Register and get verified in minutes</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
//                 <h4 className="font-bold text-lg mb-2">Go Online</h4>
//                 <p className="text-gray-600 text-sm">Turn on availability to receive orders</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
//                 <h4 className="font-bold text-lg mb-2">Deliver</h4>
//                 <p className="text-gray-600 text-sm">Pick up and deliver orders efficiently</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
//                 <h4 className="font-bold text-lg mb-2">Earn</h4>
//                 <p className="text-gray-600 text-sm">Get paid instantly after delivery</p>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-24 text-center text-gray-500">
//             <p>© 2025 Naivedyam. All rights reserved.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handleAcceptAssignment = async (assignmentId) => {
//     try {
//       await dispatch(acceptAssignmentThunk(assignmentId)).unwrap();
//       toast.success("Assignment accepted! Loading details...");
//       setTimeout(() => {
//         dispatch(getCurrentAssignmentThunk());
//         dispatch(getAllAssignments());
//       }, 1000);
//     } catch (error) {
//       toast.error(error || "Failed to accept assignment");
//     }
//   };

//   // ✅ Main Dashboard (when logged in) - 75% width
//   return (
//     <div className="min-h-screen bg-gradient-to-br mt-17 from-orange-50 via-white to-green-50 py-6">
//       <div className="w-[90%] lg:w-[75%] mx-auto">
//         {/* Header with Branding */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
//                   Naivedyam Partner
//                 </h1>
//                 <p className="text-gray-600 text-sm">Welcome back, {user?.name}! 👋</p>
//               </div>
//             </div>
//             {/* Status Badge */}
//             <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${user?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
//               <div className={`w-2 h-2 rounded-full ${user?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
//               <span className="text-sm font-semibold">{user?.isAvailable ? 'Available' : 'On Delivery'}</span>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Today's Deliveries */}
//           <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-green-100 text-sm font-medium mb-1">Today's Deliveries</p>
//                   <p className="text-5xl font-bold">{user?.todayDeliveries || 0}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
//                   <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex items-center text-green-100 text-sm">
//                 <svg className="w-4 h-4 mr-1 " fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                 </svg>
//                 Keep up the great work!
//               </div>
//             </div>
//           </div>
          
//           {/* Total Deliveries */}
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-blue-100 text-sm font-medium mb-1">Total Deliveries</p>
//                   <p className="text-5xl font-bold">{user?.totalDeliveries || 0}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
//                   <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex items-center text-blue-100 text-sm">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
//                 </svg>
//                 You're doing amazing!
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Rest of dashboard content - Current Delivery or Available Assignments */}
//         {loadingData ? (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="flex flex-col items-center justify-center">
//               <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
//               <p className="text-gray-600 font-medium">Loading current delivery...</p>
//             </div>
//           </div>
//         ) : acceptedOrder ? (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
//             <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                 </svg>
//                 Current Delivery
//               </h3>
//             </div>
            
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <p className="text-gray-500 text-sm mb-1">Order Number</p>
//                   <p className="text-3xl font-bold text-gray-800">#{acceptedOrder.order?._id?.slice(-6)}</p>
//                 </div>
//                 <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-sm font-semibold text-green-700">Active</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
//                   <div className="flex items-start">
//                     <div className="bg-green-500 p-2 rounded-lg mr-3">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-green-700 text-xs font-bold mb-1">PICKUP LOCATION</p>
//                       <p className="font-bold text-gray-800">{acceptedOrder.pickup?.name}</p>
//                       <p className="text-sm text-gray-600 mt-1">{acceptedOrder.pickup?.address}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
//                   <div className="flex items-start">
//                     <div className="bg-blue-500 p-2 rounded-lg mr-3">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-blue-700 text-xs font-bold mb-1">DROP LOCATION</p>
//                       <p className="text-sm text-gray-800 font-medium">{acceptedOrder.drop?.address}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {acceptedOrder.order && (
//                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-4 border border-gray-200">
//                   <h4 className="font-bold text-gray-700 mb-3 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     Customer Details
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-semibold text-gray-800">{acceptedOrder.order.name}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Phone:</span>
//                       <span className="font-semibold text-gray-800">{acceptedOrder.order.phone}</span>
//                     </div>
//                     <div className="flex justify-between items-center pt-2 border-t border-gray-300">
//                       <span className="text-gray-700 font-medium">Amount:</span>
//                       <span className="text-xl font-bold text-green-600">₹{acceptedOrder.order.amount}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <button 
//                 onClick={() => navigate('/deliveryAgentTracking')}
//                 className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
//               >
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//                 </svg>
//                 Start Navigation
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
//             <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 Available Assignments
//               </h3>
//               <button
//                 onClick={() => dispatch(getAllAssignments())}
//                 disabled={assignmentsLoading}
//                 className="bg-white cursor-pointer  bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center backdrop-blur-sm"
//               >
//                 {assignmentsLoading ? (
//                   <>
//                     <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                     Refreshing...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="p-6">
//               {assignmentsLoading && assignments.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12">
//                   <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
//                   <p className="text-gray-600 font-medium">Loading assignments...</p>
//                 </div>
//               ) : assignments.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-700 font-semibold text-lg mb-2">No assignments available</p>
//                   <p className="text-gray-500 text-sm">New delivery requests will appear here</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {assignments.map((assignment) => (
//                     <div 
//                       key={assignment._id} 
//                       className="border-2 border-orange-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50 hover:scale-[1.01]"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div>
//                           <h4 className="text-2xl font-bold text-gray-800 mb-2">Order #{assignment.order?._id?.slice(-6)}</h4>
//                           <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-xs font-bold rounded-full">
//                             {assignment.status}
//                           </span>
//                         </div>
                        
//                         <button
//                           onClick={() => handleAcceptAssignment(assignment._id)}
//                           disabled={accepting}
//                           className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
//                         >
//                           {accepting ? (
//                             <>
//                               <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                               Accepting...
//                             </>
//                           ) : (
//                             <>
//                               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Accept
//                             </>
//                           )}
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                         <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
//                           <p className="text-green-700 text-xs font-bold mb-2 flex items-center">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                             </svg>
//                             PICKUP
//                           </p>
//                           <p className="font-bold text-gray-800">{assignment.pickup?.name}</p>
//                           <p className="text-xs text-gray-600 mt-1">{assignment.pickup?.address}</p>
//                         </div>

//                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
//                           <p className="text-blue-700 text-xs font-bold mb-2 flex items-center">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                             </svg>
//                             DROP
//                           </p>
//                           <p className="text-sm text-gray-800 font-semibold">{assignment.drop?.address}</p>
//                         </div>
//                       </div>

//                       {assignment.order && (
//                         <div className="flex items-center justify-between pt-4 border-t-2 border-orange-100">
//                           <div className="flex items-center text-gray-600">
//                             <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                             </svg>
//                             <span className="font-medium">{assignment.order.items?.length || 0} item(s)</span>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-xs text-gray-500 font-medium">Order Amount</p>
//                             <p className="text-2xl font-bold text-green-600">₹{assignment.order.amount}</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// // deliveryPartner/src/components/Dashboard.jsx
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     getAllAssignments, 
//     acceptAssignmentThunk, 
//     getCurrentAssignmentThunk,
//     initializeSocketThunk,
// } from '../store/delivery/deliveryThunk';
// import { disconnectSocket, removeOrderFromSocket } from '../store/delivery/deliverySlice';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = ({setShowLogin}) => {
//   const dispatch = useDispatch();
//   const { user, token } = useSelector(state => state.auth);
//   const isAuthenticated = !!token;
//   const { 
//     assignments, 
//     loading: assignmentsLoading, 
//     accepting,
//     acceptedOrder,
//     loadingData,
//     socketConnected,
//     socket,
//   } = useSelector(state => state.delivery);
//   const navigate = useNavigate();

//   // Initialize socket
//   useEffect(() => {
//     if (isAuthenticated && !socketConnected) {
//       console.log("🔌 Initializing socket connection...");
//       dispatch(initializeSocketThunk());
//     }
//     return () => {
//       if (socketConnected && socket) {
//         socket.disconnect();
//         dispatch(disconnectSocket());
//       }
//     };
//   }, [isAuthenticated, dispatch, socketConnected, socket]);

//   // Socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewOrderBroadcast = (data) => {
//       console.log("📦 NEW ORDER BROADCAST:", data);
//       toast.info(
//         `New order available! From ${data.order.name} - ₹${data.order.amount}`,
//         { autoClose: 5000, position: 'top-right' }
//       );
//       dispatch(getAllAssignments());
//     };

//     const handleOrderAcceptedByOther = (data) => {
//       console.log("🚫 ORDER TAKEN BY OTHER AGENT:", data);
//       toast.warning(
//         'An order was just accepted by another agent',
//         { autoClose: 3000, position: 'top-right' }
//       );
//       dispatch(removeOrderFromSocket(data.assignmentId));
//     };

//     socket.on('orderAcceptedByOther', handleOrderAcceptedByOther);
//     socket.on('newOrderAvailable', handleNewOrderBroadcast);
    
//     return () => {
//       socket.off('newOrderAvailable', handleNewOrderBroadcast);
//       socket.off('orderAcceptedByOther', handleOrderAcceptedByOther);
//     };
//   }, [socket, dispatch]);

//   // Fetch assignments on mount
//   useEffect(() => {
//     if (user?.id) {
//       console.log("📦 Fetching assignments for user:", user.id);
//       dispatch(getAllAssignments());
//       dispatch(getCurrentAssignmentThunk());
//     }
//   }, [user?.id, dispatch]);

//   // ✅ Landing Page when not authenticated
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br mt-17 from-purple-50 via-white to-blue-50">
//         {/* Hero Section */}
//         <div className="container mx-auto px-4 py-5">
//           <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
//             <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
//               Delivery Partner App
//             </p>
//             <p className="text-lg text-gray-600 mb-12 max-w-2xl">
//               Join our delivery partner network and start earning on your own schedule. 
//               Fast deliveries, instant payments, and 24/7 support.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-16">
//               <button 
//                 onClick={() => setShowLogin(true)}
//                 className="px-8 py-4 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
//               >
//                 Login as Partner
//               </button>
//               <button 
//                 onClick={() => setShowLogin(true)}
//                 className="px-8 py-4 cursor-pointer bg-white text-purple-600 text-lg font-bold rounded-xl border-2 border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-lg"
//               >
//                 Become a Partner
//               </button>
//             </div>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
//             {/* Feature 1 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Flexible Hours</h3>
//               <p className="text-gray-600 text-center">
//                 Work whenever you want. Set your own schedule and maintain work-life balance.
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Instant Payments</h3>
//               <p className="text-gray-600 text-center">
//                 Get paid immediately after every delivery. No waiting, no hassle.
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">24/7 Support</h3>
//               <p className="text-gray-600 text-center">
//                 Our support team is always available to help you with any issues.
//               </p>
//             </div>
//           </div>

//           {/* How It Works */}
//           <div className="mt-24 max-w-6xl mx-auto">
//             <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">1</div>
//                 <h4 className="font-bold text-lg mb-2">Sign Up</h4>
//                 <p className="text-gray-600 text-sm">Register and get verified in minutes</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">2</div>
//                 <h4 className="font-bold text-lg mb-2">Go Online</h4>
//                 <p className="text-gray-600 text-sm">Turn on availability to receive orders</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">3</div>
//                 <h4 className="font-bold text-lg mb-2">Deliver</h4>
//                 <p className="text-gray-600 text-sm">Pick up and deliver orders efficiently</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">4</div>
//                 <h4 className="font-bold text-lg mb-2">Earn</h4>
//                 <p className="text-gray-600 text-sm">Get paid instantly after delivery</p>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-24 text-center text-gray-500">
//             <p>© 2025 Naivedyam. All rights reserved.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handleAcceptAssignment = async (assignmentId) => {
//     try {
//       await dispatch(acceptAssignmentThunk(assignmentId)).unwrap();
//       toast.success("Assignment accepted! Loading details...");
//       setTimeout(() => {
//         dispatch(getCurrentAssignmentThunk());
//         dispatch(getAllAssignments());
//       }, 1000);
//     } catch (error) {
//       toast.error(error || "Failed to accept assignment");
//     }
//   };

//   // ✅ Main Dashboard (when logged in) - 80% width
//   return (
//     <div className="min-h-screen bg-gradient-to-br mt-17 from-purple-50 via-white to-blue-50 py-6">
//       <div className="w-[90%] lg:w-[80%] mx-auto">
//         {/* Header with Branding */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                   Naivedyam Partner
//                 </h1>
//                 <p className="text-gray-600 text-sm">Welcome back, {user?.name}! 👋</p>
//               </div>
//             </div>
//             {/* Status Badge */}
//             <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${user?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
//               <div className={`w-2 h-2 rounded-full ${user?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-purple-500'}`}></div>
//               <span className="text-sm font-semibold">{user?.isAvailable ? 'Available' : 'On Delivery'}</span>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Today's Deliveries */}
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-purple-100 text-sm font-medium mb-1">Today's Deliveries</p>
//                   <p className="text-5xl font-bold">{user?.todayDeliveries || 0}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
//                   <svg className="w-8 h-8 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex items-center text-purple-100 text-sm">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                 </svg>
//                 Keep up the great work!
//               </div>
//             </div>
//           </div>
          
//           {/* Total Deliveries */}
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
//             <div className="relative z-10">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-blue-100 text-sm font-medium mb-1">Total Deliveries</p>
//                   <p className="text-5xl font-bold">{user?.totalDeliveries || 0}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
//                   <svg className="w-8 h-8 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex items-center text-blue-100 text-sm">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
//                 </svg>
//                 You're doing amazing!
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Rest of dashboard content continues with same color updates... */}
//         {loadingData ? (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="flex flex-col items-center justify-center">
//               <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
//               <p className="text-gray-600 font-medium">Loading current delivery...</p>
//             </div>
//           </div>
//         ) : acceptedOrder ? (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
//             <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//                 </svg>
//                 Current Delivery
//               </h3>
//             </div>
            
//             <div className="p-6">
//               {/* ... existing content with updated colors ... */}
//               <button 
//                 onClick={() => navigate('/deliveryAgentTracking')}
//                 className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
//               >
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//                 </svg>
//                 Start Navigation
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
//             <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 Available Assignments
//               </h3>
//               <button
//                 onClick={() => dispatch(getAllAssignments())}
//                 disabled={assignmentsLoading}
//                 className="bg-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center backdrop-blur-sm"
//               >
//                 {assignmentsLoading ? (
//                   <>
//                     <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                     Refreshing...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="p-6">
//               {assignmentsLoading && assignments.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12">
//                   <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
//                   <p className="text-gray-600 font-medium">Loading assignments...</p>
//                 </div>
//               ) : assignments.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-700 font-semibold text-lg mb-2">No assignments available</p>
//                   <p className="text-gray-500 text-sm">New delivery requests will appear here</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {assignments.map((assignment) => (
//                     <div 
//                       key={assignment._id} 
//                       className="border-2 border-purple-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:scale-[1.01]"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div>
//                           <h4 className="text-2xl font-bold text-gray-800 mb-2">Order #{assignment.order?._id?.slice(-6)}</h4>
//                           <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-bold rounded-full">
//                             {assignment.status}
//                           </span>
//                         </div>
                        
//                         <button
//                           onClick={() => handleAcceptAssignment(assignment._id)}
//                           disabled={accepting}
//                           className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
//                         >
//                           {accepting ? (
//                             <>
//                               <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                               Accepting...
//                             </>
//                           ) : (
//                             <>
//                               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Accept
//                             </>
//                           )}
//                         </button>
//                       </div>

//                       {/* ... rest of assignment card with same structure ... */}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// deliveryPartner/src/components/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getAllAssignments, 
    acceptAssignmentThunk, 
    getCurrentAssignmentThunk,
    initializeSocketThunk,
} from '../store/delivery/deliveryThunk';
import { disconnectSocket, removeOrderFromSocket } from '../store/delivery/deliverySlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({setShowLogin}) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const isAuthenticated = !!token;
  const { 
    assignments, 
    loading: assignmentsLoading, 
    accepting,
    acceptedOrder,
    loadingData,
    socketConnected,
    socket,
  } = useSelector(state => state.delivery);
  const navigate = useNavigate();

  // Initialize socket
  useEffect(() => {
    if (isAuthenticated && !socketConnected) {
      console.log("🔌 Initializing socket connection...");
      dispatch(initializeSocketThunk());
    }
    return () => {
      if (socketConnected && socket) {
        socket.disconnect();
        dispatch(disconnectSocket());
      }
    };
  }, [isAuthenticated, dispatch, socketConnected, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewOrderBroadcast = (data) => {
      console.log("📦 NEW ORDER BROADCAST:", data);
      toast.info(
        `New order available! From ${data.order.name} - ₹${data.order.amount}`,
        { autoClose: 5000, position: 'top-right' }
      );
      dispatch(getAllAssignments());
    };

    const handleOrderAcceptedByOther = (data) => {
      console.log("🚫 ORDER TAKEN BY OTHER AGENT:", data);
      toast.warning(
        'An order was just accepted by another agent',
        { autoClose: 3000, position: 'top-right' }
      );
      dispatch(removeOrderFromSocket(data.assignmentId));
    };

    socket.on('orderAcceptedByOther', handleOrderAcceptedByOther);
    socket.on('newOrderAvailable', handleNewOrderBroadcast);
    
    return () => {
      socket.off('newOrderAvailable', handleNewOrderBroadcast);
      socket.off('orderAcceptedByOther', handleOrderAcceptedByOther);
    };
  }, [socket, dispatch]);

  // Fetch assignments on mount
  useEffect(() => {
    if (user?.id) {
      console.log("📦 Fetching assignments for user:", user.id);
      dispatch(getAllAssignments());
      dispatch(getCurrentAssignmentThunk());
    }
  }, [user?.id, dispatch]);

  // ✅ Landing Page when not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br mt-17 from-purple-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
              Delivery Partner App
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl">
              Join our delivery partner network and start earning on your own schedule. 
              Fast deliveries, instant payments, and 24/7 support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-8 py-4 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Login as Partner
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="px-8 py-4 cursor-pointer bg-white text-purple-600 text-lg font-bold rounded-xl border-2 border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-lg"
              >
                Become a Partner
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Flexible Hours</h3>
              <p className="text-gray-600 text-center">
                Work whenever you want. Set your own schedule and maintain work-life balance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Instant Payments</h3>
              <p className="text-gray-600 text-center">
                Get paid immediately after every delivery. No waiting, no hassle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">24/7 Support</h3>
              <p className="text-gray-600 text-center">
                Our support team is always available to help you with any issues.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">1</div>
                <h4 className="font-bold text-lg mb-2">Sign Up</h4>
                <p className="text-gray-600 text-sm">Register and get verified in minutes</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">2</div>
                <h4 className="font-bold text-lg mb-2">Go Online</h4>
                <p className="text-gray-600 text-sm">Turn on availability to receive orders</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">3</div>
                <h4 className="font-bold text-lg mb-2">Deliver</h4>
                <p className="text-gray-600 text-sm">Pick up and deliver orders efficiently</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">4</div>
                <h4 className="font-bold text-lg mb-2">Earn</h4>
                <p className="text-gray-600 text-sm">Get paid instantly after delivery</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-24 text-center text-gray-500">
            <p>© 2025 Naivedyam. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAcceptAssignment = async (assignmentId) => {
    try {
      await dispatch(acceptAssignmentThunk(assignmentId)).unwrap();
      toast.success("Assignment accepted! Loading details...");
      setTimeout(() => {
        dispatch(getCurrentAssignmentThunk());
        dispatch(getAllAssignments());
      }, 1000);
    } catch (error) {
      toast.error(error || "Failed to accept assignment");
    }
  };

  // ✅ Main Dashboard (when logged in) - 80% width
  return (
    <div className="min-h-screen bg-gradient-to-br mt-17 from-purple-50 via-white to-blue-50 py-6">
      <div className="w-[90%] lg:w-[80%] mx-auto">
        {/* Header with Branding */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Naivedyam Partner
                </h1>
                <p className="text-gray-600 text-sm">Welcome back, {user?.name}! 👋</p>
              </div>
            </div>
            {/* Status Badge */}
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${user?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
              <div className={`w-2 h-2 rounded-full ${user?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-purple-500'}`}></div>
              <span className="text-sm font-semibold">{user?.isAvailable ? 'Available' : 'On Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Today's Deliveries */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Today's Deliveries</p>
                  <p className="text-5xl font-bold">{user?.todayDeliveries || 0}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-purple-100 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Keep up the great work!
              </div>
            </div>
          </div>
          
          {/* Total Deliveries */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Deliveries</p>
                  <p className="text-5xl font-bold">{user?.totalDeliveries || 0}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center text-blue-100 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                You're doing amazing!
              </div>
            </div>
          </div>
        </div>

        {/* Current Delivery or Available Assignments */}
        {loadingData ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 font-medium">Loading current delivery...</p>
            </div>
          </div>
        ) : acceptedOrder ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Current Delivery
              </h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Order Number</p>
                  <p className="text-3xl font-bold text-gray-800">#{acceptedOrder.order?._id?.slice(-6)}</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-start">
                    <div className="bg-green-500 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-green-700 text-xs font-bold mb-1">PICKUP LOCATION</p>
                      <p className="font-bold text-gray-800">{acceptedOrder.pickup?.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{acceptedOrder.pickup?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                  <div className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-700 text-xs font-bold mb-1">DROP LOCATION</p>
                      <p className="text-sm text-gray-800 font-medium">{acceptedOrder.drop?.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {acceptedOrder.order && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-800">{acceptedOrder.order.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-800">{acceptedOrder.order.phone}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                      <span className="text-gray-700 font-medium">Amount:</span>
                      <span className="text-xl font-bold text-green-600">₹{acceptedOrder.order.amount}</span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => navigate('/deliveryAgentTracking')}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Start Navigation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Available Assignments
              </h3>
              <button
                onClick={() => dispatch(getAllAssignments())}
                disabled={assignmentsLoading}
                className="bg-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center backdrop-blur-sm"
              >
                {assignmentsLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>

            <div className="p-6">
              {assignmentsLoading && assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">No assignments available</p>
                  <p className="text-gray-500 text-sm">New delivery requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div 
                      key={assignment._id} 
                      className="border-2 border-purple-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800 mb-2">Order #{assignment.order?._id?.slice(-6)}</h4>
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-bold rounded-full">
                            {assignment.status}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleAcceptAssignment(assignment._id)}
                          disabled={accepting}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                        >
                          {accepting ? (
                            <>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Accepting...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Accept
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
                          <p className="text-green-700 text-xs font-bold mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            PICKUP
                          </p>
                          <p className="font-bold text-gray-800">{assignment.pickup?.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{assignment.pickup?.address}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                          <p className="text-blue-700 text-xs font-bold mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            DROP
                          </p>
                          <p className="text-sm text-gray-800 font-semibold">{assignment.drop?.address}</p>
                        </div>
                      </div>

                      {assignment.order && (
                        <div className="flex items-center justify-between pt-4 border-t-2 border-purple-100">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="font-medium">{assignment.order.items?.length || 0} item(s)</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium">Order Amount</p>
                            <p className="text-2xl font-bold text-green-600">₹{assignment.order.amount}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// components/DeliveryAgentTracking.jsx
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, Marker, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import scooter from '../assets/scooter.png';
import home from '../assets/home.png';
import { getCurrentAssignmentThunk } from '../store/delivery/deliveryThunk';
import { toast } from 'react-toastify';
import axios from "../../utils/credentials.js";
import { useNavigate } from "react-router-dom";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const deliveryBoyIcon = new L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const homeIcon = new L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Auto-fit bounds component
function AutoFitBounds({ agentPos, customerPos }) {
  const map = useMap();
  
  useEffect(() => {
    if (agentPos && customerPos) {
      const bounds = L.latLngBounds([agentPos, customerPos]);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16
      });
    }
  }, [agentPos, customerPos, map]);
  
  return null;
}

// Change view component
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const DeliveryAgentTracking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    deliveryAgentLocation, 
    UserLocation, 
    acceptedOrder,
    loadingData 
  } = useSelector(state => state.delivery);

  const [mapReady, setMapReady] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatingOtp, setGeneratingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Fetch assignment on mount
  useEffect(() => {
    dispatch(getCurrentAssignmentThunk());
  }, [dispatch]);

  // Extract coordinates safely
  const deliveryAgentLat = deliveryAgentLocation?.lat;
  const deliveryAgentLon = deliveryAgentLocation?.lon;
  const userLocationLat = UserLocation?.lat;
  const userLocationLon = UserLocation?.lon;

  // Check if we have valid coordinates
  const hasAgentLocation = deliveryAgentLat && deliveryAgentLon;
  const hasUserLocation = userLocationLat && userLocationLon;
  const hasAllLocations = hasAgentLocation && hasUserLocation;

  // Calculate distance
  const distance = useMemo(() => {
    if (!hasAllLocations) return null;
    
    const R = 6371;
    const dLat = (userLocationLat - deliveryAgentLat) * Math.PI / 180;
    const dLon = (userLocationLon - deliveryAgentLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deliveryAgentLat * Math.PI / 180) * Math.cos(userLocationLat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  }, [hasAllLocations, deliveryAgentLat, deliveryAgentLon, userLocationLat, userLocationLon]);

  // Define center
  const center = hasAgentLocation 
    ? [deliveryAgentLat, deliveryAgentLon]
    : [19.0760, 72.8777];

  // Define path for route
  const path = hasAllLocations 
    ? [
        [deliveryAgentLat, deliveryAgentLon],
        [userLocationLat, userLocationLon]
      ]
    : null;

  // Open navigation
  const handleOpenNavigation = () => {
    if (!hasUserLocation) {
      toast.error("Customer location not available");
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      const url = isIOS 
        ? `maps://maps.apple.com/?daddr=${userLocationLat},${userLocationLon}`
        : `google.navigation:q=${userLocationLat},${userLocationLon}`;
      window.location.href = url;
      
      setTimeout(() => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${userLocationLat},${userLocationLon}`, '_blank');
      }, 2000);
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${userLocationLat},${userLocationLon}`, '_blank');
    }
  };

  // Generate OTP
  const handleMarkAsDelivered = async (orderId) => {
    setGeneratingOtp(true);
    try {
      const res = await axios.post("/api/order/generateOtp", { orderId });
      
      if (res.data.success) {
        setShowOtpBox(true);
        toast.success(showOtpBox ? "New OTP sent! 📨" : "OTP sent to customer! 📨");
      } else {
        toast.error(res.data.message || "Failed to generate OTP");
      }
    } catch (err) {
      console.error("❌ Generate OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to generate OTP");
    } finally {
      setGeneratingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await axios.post("/api/order/verifyOtp", {
        otp: enteredOtp,
      });
      
      if (res.data.success) {
        toast.success("Order delivered successfully! ✅");
        setShowOtpBox(false);
        setEnteredOtp('');
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("❌ Verify OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Cancel OTP entry
  const handleCancelOtp = () => {
    setShowOtpBox(false);
    setEnteredOtp('');
  };

  // Loading state
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading delivery tracking...</p>
        </div>
      </div>
    );
  }

  // No active order
  if (!acceptedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-800 text-xl font-bold mb-2">No Active Delivery</p>
          <p className="text-gray-500 mb-6">Accept an order from the dashboard to start tracking</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-17 from-orange-50 via-white to-green-50 py-6">
      <div className="w-[90%] lg:w-[75%] mx-auto space-y-4">
        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Order #{acceptedOrder.order?._id?.slice(-6)}
                  </h3>
                  <p className="text-white text-sm opacity-90">Active Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Tracking Live</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                <div className="flex items-start">
                  <div className="bg-blue-500 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-700 text-xs font-bold mb-1">CUSTOMER</p>
                    <p className="font-bold text-gray-800">{acceptedOrder.order?.name}</p>
                    <p className="text-sm text-gray-600 mt-1">📞 {acceptedOrder.order?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Amount Info */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                <div className="flex items-start">
                  <div className="bg-green-500 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-green-700 text-xs font-bold mb-1">ORDER AMOUNT</p>
                    <p className="text-3xl font-bold text-green-600">₹{acceptedOrder.order?.amount}</p>
                    {distance && (
                      <p className="text-sm text-gray-600 mt-1">📍 {distance} away</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            {hasUserLocation && (
              <button
                onClick={handleOpenNavigation}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-lg mb-4"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open in Maps & Navigate
              </button>
            )}
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200 shadow-lg">
          <div className="flex items-start">
            <div className="bg-purple-500 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-purple-700 text-sm font-bold mb-2">📍 DELIVERY ADDRESS</p>
              <p className="text-gray-800 font-medium leading-relaxed">
                {acceptedOrder.drop?.address || 'Address not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-3">
            <h3 className="text-lg font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Live Route Map
            </h3>
          </div>

          <div className="h-[500px]">
            {hasAgentLocation ? (
              <MapContainer 
                center={center} 
                zoom={14} 
                className="h-full w-full"
                whenReady={() => setMapReady(true)}
                key={`${deliveryAgentLat}-${deliveryAgentLon}`}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {hasAgentLocation && (
                  <Marker 
                    position={[deliveryAgentLat, deliveryAgentLon]} 
                    icon={deliveryBoyIcon}
                  />
                )}

                {hasUserLocation && (
                  <Marker 
                    position={[userLocationLat, userLocationLon]} 
                    icon={homeIcon}
                  />
                )}

                {path && (
                  <Polyline 
                    positions={path} 
                    color="#F97316" 
                    weight={5}
                    opacity={0.8}
                    dashArray="10, 10"
                  />
                )}

                {hasAllLocations ? (
                  <AutoFitBounds 
                    agentPos={[deliveryAgentLat, deliveryAgentLon]} 
                    customerPos={[userLocationLat, userLocationLon]}
                  />
                ) : (
                  <ChangeView center={center} zoom={14} />
                )}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <div className="animate-spin h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 font-semibold text-lg">Waiting for GPS location...</p>
                  <p className="text-gray-500 text-sm mt-2">Please enable location services</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          {hasAllLocations && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <img src={scooter} alt="You" className="w-6 h-6" />
                  <span className="font-medium text-gray-700">Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={home} alt="Customer" className="w-6 h-6" />
                  <span className="font-medium text-gray-700">Customer Location</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTP Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
          <div className="flex flex-col items-center">
            {!showOtpBox ? (
              // Initial "Mark as Delivered" button
              <div className="w-full max-w-md text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Ready to Complete Delivery?</h3>
                <button 
                  className="w-full bg-gradient-to-r cursor-pointer from-amber-400 to-amber-500 text-white py-4 rounded-xl font-bold hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center text-lg"
                  onClick={() => handleMarkAsDelivered(acceptedOrder.order?._id)}
                  disabled={generatingOtp}
                >
                  {generatingOtp ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Delivered
                    </>
                  )}
                </button>
              </div>
            ) : (
              // OTP Input Box
              <div className="w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-800">
                        OTP sent to customer's phone
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        📞 {acceptedOrder.order?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      placeholder="● ● ● ● ● ●"
                      className="w-full border-2 border-gray-300 p-4 rounded-xl text-center text-2xl tracking-[1em] font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      value={enteredOtp}
                      maxLength={6}
                      disabled={verifyingOtp}
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    {/* Verify Button */}
                    <button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-4 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || enteredOtp.length !== 6}
                    >
                      {verifyingOtp ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verify & Complete
                        </>
                      )}
                    </button>

                    {/* Cancel Button */}
                    <button 
                      className="px-6 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                      onClick={handleCancelOtp}
                      disabled={verifyingOtp}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center pt-2">
                    <button 
                      className="text-sm text-orange-600 hover:text-orange-800 font-semibold underline disabled:text-gray-400 disabled:no-underline transition"
                      onClick={() => handleMarkAsDelivered(acceptedOrder.order?._id)}
                      disabled={generatingOtp || verifyingOtp}
                    >
                      {generatingOtp ? "Sending new OTP..." : "🔄 Resend OTP"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      OTP expires in 5 minutes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentTracking;

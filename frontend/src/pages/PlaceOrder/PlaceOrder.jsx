// pages/PlaceOrder/PlaceOrder.jsx
import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { LocationContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function PlaceOrder() {
  const { 
    getTotalCartAmount, 
    token, 
    food_list, 
    cartItems, 
    url, 
    setCartItems, 
    location, 
    mapCenter, 
    setMapCenter 
  } = useContext(StoreContext);
  
  const { requestLocation, isLoading: locationLoading, permissionStatus } = useContext(LocationContext);
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const navigate = useNavigate();
  
  const isPlacingOrder = useRef(false);
  
  const [data, setData] = useState({
    location: location?.formatted || "",
    longitude: location?.lon || "",
    latitude: location?.lat || ""
  });

  useEffect(() => {
    const fetchInitialLocation = async () => {
      if (!locationFetched && token) {
        try {
          await requestLocation(false); 
          setLocationFetched(true);
        } catch (err) {
          console.log("Could not auto-fetch location:", err);
        }
      }
    };

    fetchInitialLocation();
  }, [token, locationFetched, requestLocation]);

  useEffect(() => {
    if (location) {
      setData(prevData => ({
        ...prevData,
        location: location.formatted || prevData.location,
        longitude: location.lon || prevData.longitude,
        latitude: location.lat || prevData.latitude
      }));
      
      if (location.lat && location.lon) {
        setMapCenter([location.lat, location.lon]);
      }
    }
  }, [location, setMapCenter]);

  useEffect(() => {
    if (isPlacingOrder.current) {
      return;
    }

    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  async function getAddressByLatLng(latitude, longitude) {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
      );
      
      if (res.data.results && res.data.results.length > 0) {
        setData(data => ({ 
          ...data,
          location: res.data.results[0].formatted, 
          longitude: res.data.results[0].lon, 
          latitude: res.data.results[0].lat 
        }));
      }
    } catch (err) {
      console.error("Error fetching location:", err);
      toast.error("Failed to fetch address");
    }
  }

  async function getLatLngByAddress(address) {
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`
      );
      
      if (res.data.results.length > 0) {
        setData(data => ({ 
          ...data,
          location: res.data.results[0].formatted, 
          longitude: res.data.results[0].lon, 
          latitude: res.data.results[0].lat 
        }));
        setMapCenter([res.data.results[0].lat, res.data.results[0].lon]);
        toast.success("Location found!");
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Error fetching location");
    }
  }

  async function getCurrentLocation() {
    try {
      await requestLocation(true);
      setLocationFetched(true);
    } catch (err) {
      console.error("Error getting current location:", err);
    }
  }

  function ChangeView({ center }) {
    const map = useMap();

    useEffect(() => {
      if (!map || !center || center[0] == null || center[1] == null) return;
      
      const timeout = setTimeout(() => {
        map.setView(center, map.getZoom(), { animate: true });
      }, 0);

      return () => clearTimeout(timeout);
    }, [center, map]);

    return null;
  }

  const onDragEnd = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setMapCenter([lat, lng]);
    getAddressByLatLng(lat, lng);
  };

  const handleSearchInputChange = (e) => {
    setData(data => ({ ...data, location: e.target.value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!data.latitude || !data.longitude) {
      toast.error("Please select a delivery location");
      return;
    }

    isPlacingOrder.current = true;

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20,
      paymentMethod,
    };

    try {
      setLoading(true);
      let response = await axios.post(url + "/api/order/place", orderData, { 
        headers: { token } 
      });
      
      if (response.data.success) {
        if (response.data.cod) {
          setCartItems({});
          toast.success("Order placed successfully (COD)");
          navigate("/myorders");
        } else {
          window.location.replace(response.data.session_url);
        }
      } else {
        toast.error("Failed to place order");
        setLoading(false);
        isPlacingOrder.current = false;
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLoading(false);
      isPlacingOrder.current = false;
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner-large"></div>
          <h3 className="loading-title">Processing Your Order</h3>
          <p className="loading-subtitle">Please wait while we confirm your order...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <div className="section-header">
          <h2 className="section-title">Delivery Information</h2>
          <p className="section-subtitle">Where should we deliver your order?</p>
        </div>
        
        {permissionStatus === 'denied' && (
          <div className="location-permission-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <p>Location access is blocked. Please enable it in your browser settings.</p>
          </div>
        )}

        <div className='search-box-wrapper'>
          <div className="search-input-group">
            <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <input 
              type="text" 
              name="location" 
              onChange={handleSearchInputChange} 
              value={data.location} 
              placeholder='Enter your delivery address'
              disabled={locationLoading}
              className="search-input"
            />
          </div>
          <button 
            className='action-btn search-btn' 
            type='button' 
            onClick={() => getLatLngByAddress(data.location)}
            disabled={locationLoading}
            title="Search location"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button 
            className='action-btn locate-btn' 
            type='button' 
            onClick={getCurrentLocation}
            disabled={locationLoading}
            title="Use current location"
          >
            {locationLoading ? (
              <div className="spinner-small"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" y1="8" x2="12" y2="8"></line>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
              </svg>
            )}
          </button>
        </div>

        <div className='map-container-wrapper'>
          <div className='map-frame'>
            {mapCenter && mapCenter[0] && mapCenter[1] ? (
              <MapContainer className='leaflet-map' center={mapCenter} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker 
                  position={mapCenter} 
                  draggable 
                  eventHandlers={{ dragend: onDragEnd }} 
                />
                <ChangeView center={mapCenter} />
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                <div className="placeholder-icon">📍</div>
                <h3>Map Loading...</h3>
                <p>Please allow location access or search for your address</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="place-order-right">
        <div className="order-summary-card">
          <h2 className="summary-card-title">Order Summary</h2>
          
          <div className="summary-section">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{getTotalCartAmount()}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Delivery Fee</span>
              <span className="summary-value">₹{getTotalCartAmount() === 0 ? 0 : 20}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</span>
            </div>
          </div>

          <div className="payment-section">
            <h3 className="payment-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Payment Method
            </h3>
            <div className='payment-options'>
              <label className={`payment-option ${paymentMethod === "COD" ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <div className="payment-icon">💵</div>
                  <div>
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-desc">Pay when you receive</span>
                  </div>
                </div>
                <div className="payment-check">
                  {paymentMethod === "COD" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "Online" ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <div className="payment-icon">💳</div>
                  <div>
                    <span className="payment-name">Card Payment</span>
                    <span className="payment-desc">Secure Stripe checkout</span>
                  </div>
                </div>
                <div className="payment-check">
                  {paymentMethod === "Online" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
              </label>
            </div>
          </div>

          <button 
            type='submit' 
            className="place-order-btn"
            disabled={!data.latitude || !data.longitude || loading}
          >
            <span>Place Order</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <div className="secure-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;

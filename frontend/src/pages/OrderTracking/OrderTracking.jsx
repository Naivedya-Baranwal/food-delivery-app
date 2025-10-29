import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { MapContainer, Marker, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OrderTracking.css';
import axios from 'axios';
import scooter from '../../assets/scooter.png';
import home from '../../assets/home.png';

// Fix Leaflet default marker icon
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

// Component to auto-fit bounds when both markers are visible
function AutoFitBounds({ agentPos, customerPos, status }) {
  const map = useMap();
  
  useEffect(() => {
    if (agentPos && customerPos) {
      const bounds = L.latLngBounds([agentPos, customerPos]);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }, [agentPos, customerPos, map, status]);
  
  return null;
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { url, token, agentLocations, orderStatusUpdates } = useContext(StoreContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tracking data
  const fetchTrackingData = async () => {
    try {
      const response = await axios.get(
        `${url}/api/order/getOrderById/${orderId}`,
        { headers: { token } }
      );
      
      console.log("📦 Order tracking data:", response.data.data);
      
      if (response.data.success) {
        setOrder(response.data.data);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("❌ Error fetching tracking:", err);
      setError("Failed to load tracking data");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (token && orderId) {
      fetchTrackingData();
    }
  }, [token, orderId]);

  // Update order status from socket - INSTANT UPDATE
  useEffect(() => {
    if (orderStatusUpdates[orderId] && order) {
      console.log("✅ Updating order status from socket:", orderStatusUpdates[orderId]);
      setOrder(prev => ({
        ...prev,
        status: orderStatusUpdates[orderId].status,
        deliveredAt: orderStatusUpdates[orderId].deliveredAt
      }));
    }
  }, [orderStatusUpdates, orderId]);

  // Auto-refresh every 5 seconds (like MyOrders)
  useEffect(() => {
    if (!token || !orderId || order?.status === 'Delivered') return;

    const interval = setInterval(() => {
      fetchTrackingData();
    }, 5000);

    return () => clearInterval(interval);
  }, [token, orderId, order?.status]);

  // Get real-time agent location from socket
  const liveAgentLocation = agentLocations[orderId];
  
  // Extract coordinates - prefer live location over stored location
  let deliveryAgentLat, deliveryAgentLon;
  
  if (liveAgentLocation) {
    deliveryAgentLat = liveAgentLocation.latitude;
    deliveryAgentLon = liveAgentLocation.longitude;
    console.log("📍 Using LIVE agent location:", { deliveryAgentLat, deliveryAgentLon });
  } else {
    deliveryAgentLat = order?.assignedDeliveryBoy?.location?.coordinates?.[1];
    deliveryAgentLon = order?.assignedDeliveryBoy?.location?.coordinates?.[0];
    console.log("📍 Using stored agent location:", { deliveryAgentLat, deliveryAgentLon });
  }
  
  const customerLat = order?.address?.latitude;
  const customerLon = order?.address?.longitude;

  const hasAgentLocation = deliveryAgentLat && deliveryAgentLon;
  const hasCustomerLocation = customerLat && customerLon;
  const hasAllLocations = hasAgentLocation && hasCustomerLocation;

  console.log("🗺️ Map coordinates:", {
    deliveryAgentLat,
    deliveryAgentLon,
    customerLat,
    customerLon,
    hasAgentLocation,
    hasCustomerLocation,
    isLiveLocation: !!liveAgentLocation
  });

  // Smart map centering based on order status
  const mapConfig = useMemo(() => {
    const status = order?.status;
    const defaultCenter = [19.0760, 72.8777];
    
    if (!hasCustomerLocation) {
      return { center: defaultCenter, zoom: 12, useAutoBounds: false };
    }

    // Agent assigned and moving
    if (hasAllLocations && (status === 'Assigned' || status === 'Picked Up' || status === 'Out for delivery')) {
      return {
        center: [deliveryAgentLat, deliveryAgentLon],
        zoom: 14,
        useAutoBounds: true
      };
    }

    // No agent yet or other statuses - center on customer
    return {
      center: [customerLat, customerLon],
      zoom: 14,
      useAutoBounds: false
    };
  }, [order?.status, hasAgentLocation, hasCustomerLocation, hasAllLocations, deliveryAgentLat, deliveryAgentLon, customerLat, customerLon]);

  // Route path
  const path = hasAllLocations 
    ? [[deliveryAgentLat, deliveryAgentLon], [customerLat, customerLon]]
    : null;

  // Check if order is delivered
  const isDelivered = order?.status === 'Delivered';

  // Get status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Out for delivery':
        return 'status-out-for-delivery';
      case 'Food Processing':
      case 'Assigned':
      case 'Picked Up':
        return 'status-assigned';
      default:
        return 'status-default';
    }
  };

  // Loading state
  if (loading) {
    return ( 
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading order tracking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-text">{error}</p>
          <button onClick={fetchTrackingData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="no-order-container">
        <div className="error-content">
          <p className="loading-text">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-wrapper">
        {/* Header */}
        <div className="tracking-header-section">
          <button onClick={() => navigate('/myorders')} className="back-btn-tracking">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <h2 className="page-title">Track Your Order</h2>
          <p className="order-id-subtitle">Order #{order._id?.slice(-6)}</p>
        </div>

        {/* Delivered Success Banner */}
        {isDelivered && (
          <div className="tracking-card delivered-success-banner">
            <div className="delivered-content-center">
              <div className="delivered-emoji">🎉</div>
              <h2 className="delivered-title">Order Delivered Successfully!</h2>
              <p className="delivered-message">Thank you for your order. We hope you enjoy your meal!</p>
              {order.deliveredAt && (
                <p className="delivered-timestamp">
                  📅 Delivered at: {new Date(order.deliveredAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Overview - Single Line */}
        <div className="tracking-card">
          <div className="card-header-flex">
            <h3 className="card-title">Order Overview</h3>
            <span className={`status-badge ${getStatusColor(order.status)}`}>
              <span className="status-dot"></span>
              {order.status}
            </span>
          </div>
          <div className="overview-single-line">
            <div className="overview-item">
              <span className="overview-label">Amount</span>
              <span className="overview-value overview-amount">₹{order.amount}</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Items</span>
              <span className="overview-value">{order.items?.length} items</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">Payment</span>
              <span className="overview-value">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Map Container - Only show if NOT delivered */}
        {!isDelivered && (
          <div className="tracking-card">
            <div className="card-header-flex">
              <h3 className="card-title">Live Tracking</h3>
              {liveAgentLocation && (
                <div className="live-indicator">
                  <div className="live-pulse-dot"></div>
                  🔴 Live Tracking Active
                </div>
              )}
            </div>
            
            <div className="map-container">
              {order.status === 'Pending' || order.status === 'Food Processing' ? (
                <div className="map-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-emoji">🍳</div>
                    <p className="placeholder-title">Your order is being prepared</p>
                    <p className="placeholder-subtitle">Live tracking will be available once it's out for delivery</p>
                  </div>
                </div>
              ) : !order.assignedDeliveryBoy ? (
                <div className="map-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-emoji">🔍</div>
                    <p className="placeholder-title">Finding a delivery agent</p>
                    <p className="placeholder-subtitle">Your order will be assigned soon</p>
                  </div>
                </div>
              ) : hasCustomerLocation ? (
                <MapContainer 
                  center={mapConfig.center} 
                  zoom={mapConfig.zoom} 
                  style={{ height: '100%', width: '100%' }}
                  key={`${deliveryAgentLat}-${deliveryAgentLon}-${order.status}`}
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  
                  <Marker position={[customerLat, customerLon]} icon={homeIcon} />

                  {hasAgentLocation && (
                    <Marker 
                      position={[deliveryAgentLat, deliveryAgentLon]} 
                      icon={deliveryBoyIcon}
                    />
                  )}

                  {path && (
                    <Polyline 
                      positions={path} 
                      color="#8b5cf6" 
                      weight={4}
                      opacity={0.7}
                      dashArray="10, 10"
                    />
                  )}

                  {mapConfig.useAutoBounds ? (
                    <AutoFitBounds 
                      agentPos={[deliveryAgentLat, deliveryAgentLon]} 
                      customerPos={[customerLat, customerLon]}
                      status={order.status}
                    />
                  ) : (
                    <ChangeView center={mapConfig.center} zoom={mapConfig.zoom} />
                  )}
                </MapContainer>
              ) : (
                <div className="map-placeholder">
                  <div className="placeholder-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Info Banner - Show only when agent is assigned */}
            {order.assignedDeliveryBoy && hasAgentLocation ? (
              <div className="tracking-info-banner">
                <div className="banner-left">
                  <div className="pulse-dot"></div>
                  <div>
                    <span className="agent-name-text">
                      {order.assignedDeliveryBoy.name} is on the way
                    </span>
                    <span className="distance-text">
                      {liveAgentLocation ? '📡 Real-time tracking' : '⏱️ Last known location'}
                    </span>
                  </div>
                </div>
                <span className="update-frequency">
                  {liveAgentLocation ? '✅ Live updates' : 'Updating...'}
                </span>
              </div>
            ) : order.assignedDeliveryBoy ? (
              <div className="agent-not-ready-banner">
                <div className="banner-icon">📍</div>
                <div className="banner-text">
                  <p className="banner-title">Agent Assigned</p>
                  <p className="banner-subtitle">Waiting for location updates...</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Two Column Grid */}
        <div className="grid-two-col">
          {/* Delivery Details - Simplified */}
          <div className="tracking-card">
            <h3 className="card-title">Delivery Details</h3>
            <div className="delivery-details-simple">
              <div className="detail-row-simple">
                <span className="detail-icon-large">👤</span>
                <div className="detail-text-block">
                  <span className="detail-label-small">Name</span>
                  <span className="detail-value-large">{order.name}</span>
                </div>
              </div>
              <div className="detail-row-simple">
                <span className="detail-icon-large">📍</span>
                <div className="detail-text-block">
                  <span className="detail-label-small">Address</span>
                  <span className="detail-value-large">{order.address?.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="tracking-card">
            <h3 className="card-title">Order Items</h3>
            <div className="order-items-list">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="total-row">
                <span className="total-label">Total Amount</span>
                <span className="total-amount">₹{order.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;

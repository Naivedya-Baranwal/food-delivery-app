// frontend/src/pages/MyOrders/MyOrders.jsx
import { useState, useContext, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Processing':
        return 'status-processing';
      case 'Out for delivery':
        return 'status-delivery';
      case 'Delivered':
        return 'status-delivered';
      default:
        return 'status-default';
    }
  };

  return (
    <div className='my-orders-container'>
      <div className='my-orders-content'>
        {/* Header */}
        <div className="my-orders-header">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div>
            <h1 className="my-orders-title">My Orders</h1>
            <p className="my-orders-subtitle">Track and manage your orders</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet</p>
              <button onClick={() => navigate('/')} className="start-shopping-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {data.map((order, index) => (
                <div key={index} className="order-row">
                  {/* Order Icon */}
                  <div className="order-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>

                  {/* Order Details */}
                  <div className="order-details-section">
                    <div className="order-header-row">
                      <h3 className="order-number">Order #{order._id.slice(-6)}</h3>
                      <span className="order-date">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="order-items-text">
                      {order.items.map((item, idx) => {
                        if (idx === order.items.length - 1) {
                          return `${item.name} x ${item.quantity}`;
                        } else {
                          return `${item.name} x ${item.quantity}, `;
                        }
                      })}
                    </div>
                  </div>

                  {/* Order Amount */}
                  <div className="order-amount-section">
                    <span className="amount-label">Total</span>
                    <span className="amount-value">₹{order.amount}</span>
                  </div>

                  {/* Items Count */}
                  <div className="order-items-count">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>{order.items.length} items</span>
                  </div>

                  {/* Status */}
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    <span className="status-dot"></span>
                    {order.status}
                  </div>

                  {/* Track Button */}
                  <button 
                    onClick={() => navigate(`/OrderTracking/${order._id}`)}
                    className="track-order-btn"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Track Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

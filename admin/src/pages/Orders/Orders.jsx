// admin/src/pages/Orders/Orders.jsx
import { useEffect, useState, useContext } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from '../../../utils/credentials.js';
import { AdminContext } from '../../context/AdminContext.jsx';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Current');
  
  const { socket, notificationStatus } = useContext(AdminContext);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Something went wrong');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post('/api/order/status', {
        orderId,
        status: event.target.value,
      });
      
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Status updated');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    if (!socket) return;
    
    const handleNewOrder = (data) => {
      setOrders(prevOrders => [data.order, ...prevOrders]);
    };

    const handleAgentUpdate = (data) => {
      console.log("👤 Agent availability updated:", data);
      toast.info(`${data.message}`, { autoClose: 3000, position: 'top-right' });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId
            ? { ...order, availableAgents: data.availableAgents }
            : order
        )
      );
    };

    const handleOrderAssigned = (data) => {
      console.log("✅ Order assigned:", data);
      toast.success('Order has been assigned to a delivery agent', { autoClose: 3000, position: 'top-right' });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId ? data.order : order
        )
      );
    };

    const handleOrderDelivered = (data) => {
      console.log("🎉 Order delivered:", data);
      toast.success(`${data.message}`, { autoClose: 5000, position: 'top-right' });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId ? data.order : order
        )
      );
    };

    socket.on('agentAvailabilityUpdate', handleAgentUpdate);
    socket.on('newOrder', handleNewOrder);
    socket.on('orderAssigned', handleOrderAssigned);
    socket.on('orderDelivered', handleOrderDelivered);
    
    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('agentAvailabilityUpdate', handleAgentUpdate);
      socket.off('orderAssigned', handleOrderAssigned);
      socket.off('orderDelivered', handleOrderDelivered);
    };
  }, [socket]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'Current') return order.status !== 'Delivered';
    if (filter === 'Out for delivery') return order.status === 'Out for delivery';
    if (filter === 'Delivered') return order.status === 'Delivered';
    return true;
  });

  return (
    <div className='orders-container'>
      <div className='orders-content'>
        {/* Header */}
        <div className="orders-header">
          <div className="header-top">
            {/* Back Button - Left */}
            <button 
              onClick={() => navigate('/')}
              className="back-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            {/* Title - Center */}
            <div className="header-title-center">
              <h1 className="orders-title">Order Management</h1>
              <p className="orders-subtitle">Track and manage all orders</p>
            </div>

            {/* Order Count - Right */}
            <div className="orders-count">
              <span className="count-badge">{filteredOrders.length}</span>
              <span className="count-label">Orders</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="header-filters">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'Current' ? 'active' : ''}`}
                onClick={() => setFilter('Current')}
              >
                Current Orders
              </button>
              <button 
                className={`filter-btn ${filter === 'Out for delivery' ? 'active' : ''}`}
                onClick={() => setFilter('Out for delivery')}
              >
                Out for Delivery
              </button>
              <button 
                className={`filter-btn ${filter === 'Delivered' ? 'active' : ''}`}
                onClick={() => setFilter('Delivered')}
              >
                Delivered
              </button>
            </div>

            {/* Notification Status */}
            {notificationStatus === 'granted' && (
              <span className="notification-badge notification-on">
                🔔 Notifications ON
              </span>
            )}
            {notificationStatus === 'denied' && (
              <span 
                className="notification-badge notification-off"
                onClick={() => {
                  toast.error(
                    "To enable notifications:\n1. Click the 🔒 lock icon in address bar\n2. Enable 'Notifications'\n3. Refresh page",
                    { autoClose: 10000 }
                  );
                }}
              >
                🔕 Notifications OFF
              </span>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className='orders-list'>
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3>No orders found</h3>
              <p>Orders will appear here when customers place them</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className='order-card'>
                <div className="order-header-row">
                  <div className="order-id">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Order #{order._id.slice(-6)}</span>
                  </div>
                  <div className="order-amount">₹{order.amount}</div>
                </div>

                <div className="order-body">
                  {/* Customer Info */}
                  <div className="order-section">
                    <h4 className="section-title">Customer Details</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{order.name}</span>
                      </div>
                      <div className="info-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{order.phone}</span>
                      </div>
                      <div className="info-item address">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{order.address.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="order-section">
                    <h4 className="section-title">Order Items ({order.items.length})</h4>
                    <p className="items-text">
                      {order.items.map((item, idx) =>
                        idx === order.items.length - 1
                          ? `${item.name} x ${item.quantity}`
                          : `${item.name} x ${item.quantity}, `
                      )}
                    </p>
                  </div>

                  {/* Status Control */}
                  <div className="order-section">
                    <h4 className="section-title">Order Status</h4>
                    <div className="status-control">
                      <select
                        onChange={event => statusHandler(event, order._id)}
                        value={order.status}
                        disabled={
                          order.status === 'Out for delivery' || 
                          order.status === 'Delivered' || 
                          order.status === 'Picked Up'
                        }
                      >
                        <option value='Pending'>Pending</option>
                        <option value='Food Processing'>Food Processing</option>
                        <option value='Out for delivery'>Out for delivery</option>
                      </select>
                      <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Assignment Status */}
                  {order.assignedDeliveryBoy ? (
                    <div className="assignment-status assigned">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Assigned to: {order.assignedDeliveryBoy.name} ({order.assignedDeliveryBoy.phone})</span>
                    </div>
                  ) : (
                    <div className="assignment-status not-assigned">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Waiting for agent assignment</span>
                    </div>
                  )}

                  {/* Delivered Time */}
                  {order.status === 'Delivered' && order.deliveredAt && (
                    <div className="delivered-time">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Delivered at: {new Date(order.deliveredAt).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Available Agents */}
                  {order.status === 'Out for delivery' && order.availableAgents?.length > 0 && (
                    <div className='available-agents-section'>
                      <h4 className="section-title">Available Delivery Agents</h4>
                      <div className="agents-list">
                        {order.availableAgents.map(agent => (
                          <div key={agent.id} className="agent-card">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                              <strong>{agent.name}</strong>
                              <span>{agent.phone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Agents Available */}
                  {order.status === 'Out for delivery' && 
                   (!order.availableAgents || order.availableAgents.length === 0) &&
                   !order.assignedDeliveryBoy && (
                    <div className='no-agents-msg'>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>No agents available currently</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

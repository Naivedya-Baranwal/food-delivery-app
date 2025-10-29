// admin/src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from '../../../utils/credentials.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch menu items
        const itemsResponse = await axios.get("/api/food/list");
        // Fetch orders
        const ordersResponse = await axios.get("/api/order/list");
        if (itemsResponse.data.success) {
          const totalItems = itemsResponse.data.data.length;
          let totalOrders = 0;
          let pendingOrders = 0;
          let completedOrders = 0;
          let totalRevenue = 0;
          if (ordersResponse.data.success) {
            const orders = ordersResponse.data.data;
            totalOrders = orders.length;
            
            orders.forEach(order => {
              if (order.status === "Delivered") {
                completedOrders++;
                totalRevenue += order.amount || 0;
              } else {
                pendingOrders++;
              }
            });
          }
          
          setStats({
            totalItems,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue,
          });
        } else {
          toast.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your restaurant today.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-blue">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Menu Items</p>
                <p className="stat-value">{stats.totalItems}</p>
              </div>
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p className="stat-description">Active menu items</p>
          </div>

          <div className="stat-card stat-card-green">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="stat-description">
              {stats.pendingOrders} pending, {stats.completedOrders} completed
            </p>
          </div>

          <div className="stat-card stat-card-purple">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">₹{stats.totalRevenue}</p>
              </div>
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="stat-description">From completed orders</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card">
          <div className="section-header section-header-orange">
            <h2>Quick Actions</h2>
          </div>
          <div className="section-content">
            <div className="actions-grid">
              <div className="action-card action-card-green" onClick={() => navigate('/add')}>
                <div className="action-icon action-icon-green">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3>Add New Item</h3>
                <p>Quickly add a new food item with name, description, price, and image.</p>
                <div className="action-link">
                  <span>Add Item</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              <div className="action-card action-card-blue" onClick={() => navigate('/list')}>
                <div className="action-icon action-icon-blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3>Manage Inventory</h3>
                <p>View, edit, or remove items from your menu inventory.</p>
                <div className="action-link">
                  <span>View List</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              <div className="action-card action-card-orange" onClick={() => navigate('/orders')}>
                <div className="action-icon action-icon-orange">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3>Manage Orders</h3>
                <p>Monitor and update order statuses, track deliveries.</p>
                <div className="action-link">
                  <span>View Orders</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="section-card">
          <div className="section-header section-header-purple">
            <h2>Getting Started</h2>
          </div>
          <div className="section-content">
            <p className="section-description">
              Your centralized hub for managing restaurant operations. Here's what you can do:
            </p>
            <div className="features-grid">
              <div className="feature-item feature-item-green">
                <div className="feature-icon feature-icon-green">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h4>Add Items</h4>
                  <p>Create new menu offerings with details and images.</p>
                </div>
              </div>

              <div className="feature-item feature-item-blue">
                <div className="feature-icon feature-icon-blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h4>List Items</h4>
                  <p>View and manage your complete menu inventory.</p>
                </div>
              </div>

              <div className="feature-item feature-item-orange">
                <div className="feature-icon feature-icon-orange">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h4>Orders</h4>
                  <p>Track and update customer order statuses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

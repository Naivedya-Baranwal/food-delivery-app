import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
          setStats((prev) => ({
            ...prev,
            totalItems: response.data.data.length,
          }));
        } else {
          toast.error("Failed to fetch items");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching dashboard data");
      }
    };

    fetchDashboardStats();
  }, [url]);

  return (
    <div className="dashboard">
      <h1>Welcome to the Admin Panel</h1>

      <section className="overview">
        <h2>Admin Dashboard Overview</h2>
        <div className="stats-card">
          <p><strong>Total Items:</strong> {stats.totalItems}</p>
        </div>
        <p>Your centralized hub for managing restaurant operations. Use the sidebar to access key tools and keep your business running smoothly.</p>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Add New Item</h3>
            <p>Quickly add a new food item with name, price, and image via the 'Add Items' page.</p>
          </div>
          <div className="feature-card">
            <h3>Edit Inventory</h3>
            <p>Access the 'List Items' page to update or remove items from your menu.</p>
          </div>
          <div className="feature-card">
            <h3>Update Orders</h3>
            <p>Go to the 'Orders' page to monitor and change order statuses.</p>
          </div>
        </div>
      </section>

      <section className="additional-actions">
        <h2>Get Started</h2>
        <p>Begin managing your store by selecting an option from the sidebar:</p>
        <ul>
          <li><strong>Add Items:</strong> Create new offerings.</li>
          <li><strong>List Items:</strong> Manage inventory.</li>
          <li><strong>Orders:</strong> Update order details.</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
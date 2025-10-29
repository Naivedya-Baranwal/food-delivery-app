# 🍽️ NaivedyamNow - Food Delivery SaaS Platform

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![WebSockets](https://img.shields.io/badge/Real--Time-WebSockets-purple?logo=websockets)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-blue?logo=mongodb)
![Status](https://img.shields.io/badge/Status-Active-success)

A full-stack Food Delivery SaaS platform designed to empower small-scale restaurants with a dedicated online ordering and delivery management system. Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), this project provides three independent applications for Customers, Restaurant Administrators, and Delivery Agents, ensuring a seamless, end-to-end experience.

## 🌐 Live Demo

> ⚠️ **Note:** The app is hosted on [Render's free tier](https://render.com/), which puts the backend servers to sleep after 15 minutes of inactivity.  
> As a result, the first request may take **30–60 seconds** to respond while the server wakes up. Subsequent requests will be fast.  
> Please wait a few moments after opening the app — it will start working shortly.

- 👨‍🍳 **User App:** [Live Link](https://food-delivery-app-frontend-rzxm.onrender.com)
- 🧑‍💼 **Admin App:** [Live Link](https://food-delivery-app-admin-58ts.onrender.com/)
- 🚚 **Delivery Agent App:** [Live Link](https://food-delivery-app-deliveryagent.onrender.com/)


## 🚀 Core Features

- **Role-Based Architecture:** Three independent React applications for each user role (Customer, Admin, Delivery Agent) with protected routes secured by **JWT authentication**.
- **Real-Time Delivery Tracking:** Implemented live delivery tracking using **WebSockets**, **Leaflet.js**, and **Geoapify APIs** for dynamic route visualization and continuous geolocation updates.
- **Instant Notifications:** Integrated **WebSocket** notifications across all three apps for instant order status changes (e.g., "Order Accepted," "Out for Delivery"), ensuring seamless coordination.
- **OTP-Based Delivery Verification:** Built a secure OTP system with **Nodemailer** to send time-sensitive email codes, successfully reducing fraudulent deliveries and confirming order completion.
- **Secure Payments & Media:** Full integration with **Stripe** for secure payment processing and **Cloudinary CDN** for optimized media delivery.

## 📦 App Modules

### 👨‍🍳 User Module
- User Registration and Login with secure JWT-based authentication.
- Browse categorized menus, add items to cart, and place orders.
- Track live order status and delivery agent location on an interactive map.
- Make secure online payments using **Stripe**.
- Receive real-time WebSocket notifications for order updates.
- Verify order completion with an OTP code.

### 🧑‍💼 Admin Module
- Manage and update menu items (Create, Read, Update, Delete).
- Track and update order statuses (e.g., Accept, Reject, Assign to Agent).
- View dashboard metrics and manage restaurant listings.
- Receive real-time notifications for new orders.

### 🚚 Delivery Agent Module
- Login and view a queue of assigned delivery tasks.
- Update order status (e.g., "Picked Up," "On the Way," "Delivered").
- Share live location via the browser's Geolocation API for customer and admin tracking.
- Verify order completion by collecting the user's OTP code.

## 🛠️ Technologies Used

| Layer | Tech Stack |
|---|---|
| Frontend | React.js, Leaflet.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Real-Time | WebSockets |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Payments | Stripe |
| Notifications | Nodemailer (for OTP) |
| Media Storage | Cloudinary (for food images) |
| Deployment | Render |

## 💡 Why This Project?

Unlike large platforms like Swiggy and Zomato that overshadow smaller restaurants, this app provides a cost-effective, **single-restaurant solution** ideal for underserved regions and independent vendors. It ensures digital visibility and order management capabilities for small-scale food businesses.

## 🧑‍💻 Developer

**Naivedya Baranwal** B.Tech CSE | NIT Mizoram

---

### 📄 License
This project is licensed under the MIT License.

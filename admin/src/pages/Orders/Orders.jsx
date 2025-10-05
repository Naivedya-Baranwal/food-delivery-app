import { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from '../../../utils/credentials.js';
import { assets } from '../../assets/assets';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Current'); // default filter

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post('/api/order/status', {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  const filteredOrders = orders.filter(order => {
    if (filter === 'Current') {
      return order.status !== 'Delivered';
    }
    if (filter === 'Out for delivery') {
      return order.status === 'Out for delivery';
    }
    if (filter === 'Delivered') {
      return order.status === 'Delivered';
    }
    return true;
  });

  return (
    <div className='order add'>
      <div className='header'>
        <h3>Orders</h3>
        <div>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value='Current'>Current Orders</option>
            <option value='Out for delivery'>Out for delivery</option>
            <option value='Delivered'>Delivered</option>
          </select>
        </div>
      </div>

      <div className='order-list'>
        {filteredOrders.length === 0 ? (
          <p className='no-orders'>No orders found</p>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt='' />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
                <p className='order-item-name'>{order.name}</p>
                <div className='order-item-address'>
                  <p>{order.address.location}</p>
                </div>
                <p className='order-item-phone'>{order.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              <div className='order-item-status'>
                <select
                  onChange={event => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value='Pending'>Pending</option>
                  <option value='Food Processing'>Food Processing</option>
                  <option value='Out for delivery'>Out for delivery</option>
                </select>
                <p>Status: {order.status}</p>
              </div>

              {order.status === 'Out for delivery' && (
                <div className='available-agents'>
                  <h4>Available Delivery Agents</h4>
                  {order.availableDeliveryAgents?.length > 0 ? (
                    <ul>
                      {order.availableDeliveryAgents.map(agent => (
                        <li key={agent.id}>
                          <strong>{agent.name}</strong> — {agent.phone}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='no-agent-msg'>All agents are busy 🚫</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

//old
// import { useEffect } from 'react'
// import './Orders.css'
// import { useState } from 'react'; 
// import {toast} from 'react-toastify';
// import axios from '../../../utils/credentials.js';
// import {assets} from '../../assets/assets';

// const Orders = () => {
//   const [orders,setOrders] = useState([]);
//   const fetchAllOrders = async () =>{
//    const response = await axios.get("/api/order/list");
//    if(response.data.success){
//     setOrders(response.data.data);
//    }
//    else {
//     toast.error("Error");
//    }
//   }

//   const statusHandler = async (event,orderId) => {
//        const response = await axios.post("/api/order/status",{
//         orderId,
//         status : event.target.value
//        })
//       if(response.data.success){
//        await fetchAllOrders();
//       }
//   }

//   useEffect(()=>{
//     fetchAllOrders();
//     const interval = setInterval(fetchAllOrders,5000);
//     return ()=> clearInterval(interval);
//   },[]);

//   return (
//     <div className='order add'>
//       <h3>Order Page</h3>
//       <div className="order-list">
//         {orders.map((order,index)=>(
//           <div key={index} className='order-item'>
//               <img src={assets.parcel_icon} alt="" />
//               <div>
//                 <p className='order-item-food'>
//                   {order.items.map((item,index)=>{
//                       if(index===order.items.length-1){
//                         return item.name + " x " + item.quantity; 
//                       }
//                       else {
//                         return item.name +  " x " + item.quantity+",";
//                       }
//                   })}
//                 </p>
//                 <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
//                 <div className="order-item-address">
//                   <p>{order.address.street+", "}</p>
//                   <p>{order.address.city+", " + order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
//                 </div>
//                 <p className='order-item-phone'>{order.address.phone}</p>
//               </div>
//               <p>Items : {order.items.length}</p>
//               <p>₹{order.amount}</p>
//               <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
//                 <option value="Food Processing">Food Processing</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Orders
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {

  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20,
      paymentMethod,
    }
    try {
      setLoading(true);
       let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
       if (response.data.success) {
        if (response.data.cod) {
          toast.success("Order placed successfully (COD)");
          setCartItems({}); 
          setTimeout(() => {
            setLoading(false);
            navigate("/myorders"); 
          }, 1000);
        } else {
          window.location.replace(response.data.session_url);
        }
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  }

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  if (loading) {
    return (
      <div className="verify">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' type="text" />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' type="text" />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} placeholder='City' type="text" />
          <input required name='state' onChange={onChangeHandler} value={data.state} placeholder='State' type="text" />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' type="text" />
          <input required name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' type="text" />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
            </div>
          </div>
          <p className='payment'>Payment Method</p>
          <div className='payment-type'>
            <div>
            <input
              type="radio"
              name="payment"
              id="COD"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="COD">Cash on Delivery</label>
          
            </div>
           <div>
           <input
              type="radio"
              name="payment"
              id="credit-card"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="credit-card">Stripe (Credit/Debit)</label>
           </div>
               </div>
          <button type='submit'>Place Order</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder

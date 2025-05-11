import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {

  const { getTotalCartAmount,token,food_list,cartItems,url } = useContext(StoreContext);

  const [data,setData]= useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value})) 
  }

  const placeOrder = async (event)=>{
        event.preventDefault(); // page doesn't reload after submitting the form
        let orderItems = [];
        food_list.map((item)=>{
          if(cartItems[item._id]>0){
            let itemInfo = item;
            itemInfo["quantity"] = cartItems[item._id];
            orderItems.push(itemInfo);
          }
        })
        let orderData = {
          address  : data,
          items : orderItems,
          amount : getTotalCartAmount()+20,
        }
        let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
        if(response.data.success){
          const {session_url} = response.data;
          window.location.replace(session_url);
        }
        else {
          alert("Error");
        }
  }

  const navigate = useNavigate();
  useEffect(()=>{
  if(!token){
   navigate('/cart'); 
  }
  else if(getTotalCartAmount()===0){
    navigate('/cart');
  }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input  required name = 'firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' type="text" />
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
              <p>₹{getTotalCartAmount()===0?0:20}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+20}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
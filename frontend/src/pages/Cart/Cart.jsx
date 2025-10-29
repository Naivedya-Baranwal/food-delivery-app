import { useContext } from 'react';
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartItemsList = food_list.filter(item => cartItems[item._id] > 0);
  const isEmpty = cartItemsList.length === 0;

  if (isEmpty) {
    return (
      <div className='cart-empty-container'>
        <div className="cart-empty-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button onClick={() => navigate('/')} className="start-shopping-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className="cart-header-section">
        <h2 className="cart-title">Your Cart</h2>
        <p className="cart-subtitle">Checkout your items before proceeding to payment</p>
      </div>
      <div className="cart-content-wrapper">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span className="header-item">Item</span>
            <span className="header-price">Price</span>
            <span className="header-quantity">Quantity</span>
            <span className="header-total">Total</span>
            <span className="header-remove"></span>
          </div>

          <div className="cart-items-list">
            {cartItemsList.map((item) => (
              <div key={item._id} className="cart-item-card">
                <div className="cart-item-image-wrapper">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price-mobile">₹{item.price}</p>
                </div>

                <div className="cart-item-price">₹{item.price}</div>

                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn minus"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span className="quantity-value">{cartItems[item._id]}</span>
                  <button 
                    className="quantity-btn plus"
                    onClick={() => addToCart(item._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>

                <div className="cart-item-total">₹{item.price * cartItems[item._id]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          {/* Promo Code */}
          <div className="promo-code-card">
            <h3 className="promo-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Have a Promo Code?
            </h3>
            <div className="promo-input-wrapper">
              <input type="text" placeholder='Enter promo code' className="promo-input" />
              <button className="promo-apply-btn">Apply</button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{getTotalCartAmount()}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Delivery Fee</span>
              <span className="summary-value">₹{getTotalCartAmount() === 0 ? 0 : 20}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span className="summary-label">Total</span>
              <span className="summary-value">₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</span>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => navigate('/order')}
            >
              <span>Proceed to Checkout</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <div className="secure-checkout-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

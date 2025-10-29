import React, { useContext } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../context/StoreContext';

function FoodItem({ id, name, price, description, image }) {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className="food-item-img" src={image} alt={name} />
                <div className="food-item-overlay"></div>
                
                {!cartItems[id] ? (
                    <button 
                        className='add-btn' 
                        onClick={() => addToCart(id)}
                        aria-label={`Add ${name} to cart`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                    </button>
                ) : (
                    <div className='food-item-counter'>
                        <button 
                            className='counter-btn minus-btn'
                            onClick={() => removeFromCart(id)}
                            aria-label="Decrease quantity"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        <span className='counter-value'>{cartItems[id]}</span>
                        <button 
                            className='counter-btn plus-btn'
                            onClick={() => addToCart(id)}
                            aria-label="Increase quantity"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <h3 className="food-item-name">{name}</h3>
                    <div className="rating-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>4.5</span>
                    </div>
                </div>
                <p className="food-item-desc">{description}</p> 
                <div className="food-item-footer">
                    <p className="food-item-price">₹{price}</p>
                    {cartItems[id]>0 && (
                        <span className="in-cart-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            In Cart
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FoodItem

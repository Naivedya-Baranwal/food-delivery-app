import { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

function FoodDisplay({ category }) {
    const { food_list, loading } = useContext(StoreContext)
    
    if (loading) {
        return (
            <div className="food-display-loading">
                <div className="loading-content-box">
                    <div className="spinner-modern"></div>
                    <h3 className="loading-title">Loading Delicious Food...</h3>
                    <p className="loading-text">Fetching the best dishes for you</p>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        )
    }

    // Filter items based on category
    const filteredItems = food_list.filter(item => 
        category === "All" || category === item.category
    );

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-header">
                <h2 className="food-display-title">Top Dishes Near You</h2>
                <p className="food-display-subtitle">
                    {category === "All" 
                        ? `${food_list.length} delicious items available` 
                        : `${filteredItems.length} items in ${category}`
                    }
                </p>
            </div>

            {filteredItems.length === 0 ? (
                <div className="no-items-found">
                    <div className="no-items-icon">🍽️</div>
                    <h3>No Items Found</h3>
                    <p>We couldn't find any items in this category</p>
                </div>
            ) : (
                <div className="food-display-list">
                    {filteredItems.map((item, index) => (
                        <FoodItem 
                            key={item._id} 
                            id={item._id} 
                            name={item.name} 
                            description={item.description} 
                            price={item.price} 
                            image={item.image} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FoodDisplay

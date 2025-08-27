import { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
function FoodDisplay({ category }) {

    const { food_list, loading } = useContext(StoreContext)
    if (loading) {
        return (
            <div className="food-display-loading">
                <div className="spinner"></div>
                <p>Loading food items...</p>
                <small>Server is starting up, this may take a moment...</small>
            </div>
        )
    }
    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                    }
                })}
            </div>
        </div>
    )
}

export default FoodDisplay
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

function ExploreMenu({category, setCategory}) {
  return (
    <div className='explore-menu' id='explore-menu'>
        <div className="explore-menu-header">
            <h1 className="explore-menu-title">Explore Our Menu</h1>
            <p className='explore-menu-text'>
                Choose from a diverse menu featuring a delectable array of dishes. 
                Our mission is to satisfy your cravings and elevate your dining experience, 
                one delicious meal at a time.
            </p>
        </div>

        <div className="explore-menu-list-wrapper">
            <div className="explore-menu-list">
                {menu_list.map((item, index) => {
                    const isActive = category === item.menu_name;
                    return (
                        <div 
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
                            key={index} 
                            className={`explore-menu-list-item ${isActive ? 'item-active' : ''}`}
                        >
                            <div className="menu-image-wrapper">
                                <img 
                                    className={isActive ? "active" : ""} 
                                    src={item.menu_image} 
                                    alt={item.menu_name} 
                                />
                                {isActive && (
                                    <div className="active-checkmark">✓</div>
                                )}
                            </div>
                            <p className="menu-item-name">{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="explore-menu-divider"></div>
    </div>
  )
}

export default ExploreMenu

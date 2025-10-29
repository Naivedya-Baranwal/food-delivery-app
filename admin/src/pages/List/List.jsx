// admin/src/pages/List/List.jsx
import { useEffect, useState } from 'react';
import './List.css';
import axios from '../../../utils/credentials.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get("/api/food/list");
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch items");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setDeleting(foodId);
    try {
      const response = await axios.post("/api/food/remove", { id: foodId });
      
      if (response.data.success) {
        await fetchList();
        toast.success(response.data.message);
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting item");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list-container'>
      <div className='list-content'>
        {/* Header - Updated Layout */}
        <div className="list-header">
          <div className="header-top">
            {/* Back Button - Left */}
            <button 
              onClick={() => navigate('/')}
              className="back-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </button>

            {/* Title - Center */}
            <div className="header-title-center">
              <h1 className="list-title">Menu Items</h1>
              <p className="list-subtitle">Manage your restaurant menu</p>
            </div>

            {/* Item Count - Right */}
            <div className="items-count">
              <span className="count-badge">{list.length}</span>
              <span className="count-label">Items</span>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        <div className="table-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading items...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3>No items found</h3>
              <p>Start by adding your first menu item</p>
              <button 
                onClick={() => navigate('/add')}
                className="add-first-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Item
              </button>
            </div>
          ) : (
            <>
              <div className="table-header">
                <div className="header-cell">Image</div>
                <div className="header-cell">Name</div>
                <div className="header-cell">Category</div>
                <div className="header-cell">Price</div>
                <div className="header-cell">Actions</div>
              </div>

              <div className="table-body">
                {list.map((item) => (
                  <div key={item._id} className="table-row">
                    <div className="table-cell image-cell">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="table-cell name-cell">
                      <p className="item-name">{item.name}</p>
                      {item.description && (
                        <p className="item-description">{item.description.slice(0, 50)}...</p>
                      )}
                    </div>
                    <div className="table-cell category-cell">
                      <span className="category-badge">{item.category}</span>
                    </div>
                    <div className="table-cell price-cell">
                      <span className="price">₹{item.price}</span>
                    </div>
                    <div className="table-cell action-cell">
                      <button 
                        onClick={() => removeFood(item._id)}
                        className="delete-btn"
                        disabled={deleting === item._id}
                      >
                        {deleting === item._id ? (
                          <div className="spinner-small"></div>
                        ) : (
                          <>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;

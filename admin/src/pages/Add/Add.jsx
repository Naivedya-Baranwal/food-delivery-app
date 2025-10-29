// admin/src/pages/Add/Add.jsx
import { useState } from 'react';
import './Add.css';
import axios from '../../../utils/credentials.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);
      
      const response = await axios.post("/api/food/add", formData);
      
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add-container'>
      <div className='add-content'>
        {/* Header with Back Button */}
        <div className="add-header">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div>
            <h1 className="add-title">Add New Item</h1>
            <p className="add-subtitle">Create a new menu item for your restaurant</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="add-card">
          <form className='add-form' onSubmit={onSubmitHandler}>
            {/* Image Upload Section */}
            <div className="form-section">
              <h3 className="section-title">Product Image</h3>
              <div className="image-upload-area">
                <label htmlFor="image" className="image-label">
                  {image ? (
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Upload preview" 
                      className="upload-preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="upload-text">Click to upload image</p>
                      <p className="upload-hint">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  {image && (
                    <div className="upload-overlay">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Change Image</p>
                    </div>
                  )}
                </label>
                <input 
                  onChange={(e) => setImage(e.target.files[0])} 
                  type="file" 
                  id="image" 
                  accept="image/*"
                  hidden 
                  required 
                />
              </div>
            </div>

            {/* Product Details Section */}
            <div className="form-section">
              <h3 className="section-title">Product Details</h3>
              
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input 
                  onChange={onChangeHandler} 
                  value={data.name} 
                  type="text" 
                  id="name"
                  name='name' 
                  placeholder='Enter product name' 
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Product Description</label>
                <textarea 
                  onChange={onChangeHandler} 
                  value={data.description} 
                  id="description"
                  name="description" 
                  rows="5" 
                  placeholder='Describe your product...' 
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select onChange={onChangeHandler} name="category" id="category" value={data.category}>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹)</label>
                  <input 
                    onChange={onChangeHandler} 
                    value={data.price} 
                    type="number" 
                    id="price"
                    name='price' 
                    placeholder='200' 
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type='button' 
                className='btn-secondary'
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type='submit' 
                className='btn-primary'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;

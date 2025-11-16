import React, { useState, useEffect } from 'react';
import './SweetForm.css';

const SweetForm = ({ sweet, onSubmit, onCancel, isAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chocolate',
    price: '',
    quantity: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name || '',
        category: sweet.category || 'Chocolate',
        price: sweet.price || '',
        quantity: sweet.quantity || '',
        description: sweet.description || ''
      });
      if (sweet.image) {
        setImagePreview(`http://localhost:5000${sweet.image}`);
      }
    }
  }, [sweet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    }, imageFile);
  };

  return (
    <div className="sweet-form-container">
      <div className="card">
        <h2>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Chocolate">Chocolate</option>
              <option value="Candy">Candy</option>
              <option value="Biscuit">Biscuit</option>
              <option value="Cake">Cake</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              maxLength={500}
            />
          </div>

          {isAdmin && (
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="btn-remove-image"
                  >
                    Remove
                  </button>
                </div>
              )}
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {sweet ? 'Update Sweet' : 'Add Sweet'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetForm;


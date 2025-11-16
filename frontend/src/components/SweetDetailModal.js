import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SweetDetailModal.css';

const SweetDetailModal = ({ sweetId, onClose }) => {
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSweetDetails();
  }, [sweetId]);

  const fetchSweetDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sweets/${sweetId}`);
      setSweet(response.data.sweet);
      setError('');
    } catch (err) {
      setError('Failed to load sweet details');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!sweetId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {loading && <div className="modal-loading">Loading...</div>}
        
        {error && <div className="modal-error">{error}</div>}
        
        {sweet && !loading && (
          <div className="sweet-detail">
            {sweet.image && (
              <div className="detail-image">
                <img 
                  src={`http://localhost:5000${sweet.image}`} 
                  alt={sweet.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="detail-header">
              <h2>{sweet.name}</h2>
              <span className="detail-category">{sweet.category}</span>
            </div>
            
            <div className="detail-body">
              <div className="detail-section">
                <h3>Price</h3>
                <p className="detail-price">${sweet.price.toFixed(2)}</p>
              </div>
              
              <div className="detail-section">
                <h3>Stock Quantity</h3>
                <p className={`detail-quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                  {sweet.quantity} {sweet.quantity === 1 ? 'item' : 'items'} available
                </p>
              </div>
              
              {sweet.description && (
                <div className="detail-section">
                  <h3>Description</h3>
                  <p className="detail-description">{sweet.description}</p>
                </div>
              )}
              
              <div className="detail-section">
                <h3>Product Information</h3>
                <div className="detail-info-grid">
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{sweet.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Price:</span>
                    <span className="info-value">${sweet.price.toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Stock:</span>
                    <span className={`info-value ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                      {sweet.quantity} units
                    </span>
                  </div>
                  {sweet.createdAt && (
                    <div className="info-item">
                      <span className="info-label">Added:</span>
                      <span className="info-value">
                        {new Date(sweet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetDetailModal;


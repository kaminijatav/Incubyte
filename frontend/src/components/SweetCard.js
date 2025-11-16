import React, { useState } from 'react';
import './SweetCard.css';

const SweetCard = ({ sweet, onPurchase, onRestock, onEdit, onDelete, onViewDetails }) => {
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const handlePurchase = () => {
    onPurchase(sweet._id, parseInt(purchaseQuantity));
  };

  const handleRestock = () => {
    if (restockQuantity > 0) {
      onRestock(sweet._id, parseInt(restockQuantity));
      setRestockQuantity(1);
    }
  };

  return (
    <div className="sweet-card">
      {sweet.image && (
        <div className="sweet-image">
          <img 
            src={`http://localhost:5000${sweet.image}`} 
            alt={sweet.name}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="sweet-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>
      
      {sweet.description && (
        <p className="sweet-description">{sweet.description}</p>
      )}
      
      <div className="sweet-details">
        <div className="sweet-price">${sweet.price.toFixed(2)}</div>
        <div className={`sweet-quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
          Stock: {sweet.quantity}
        </div>
      </div>

      <div className="sweet-actions">
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(sweet._id)} 
            className="btn btn-info"
          >
            View Details
          </button>
        )}
        
        <div className="purchase-section">
          <input
            type="number"
            min="1"
            max={sweet.quantity}
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(e.target.value)}
            className="quantity-input"
            disabled={sweet.quantity === 0}
          />
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0}
            className="btn btn-primary"
          >
            Purchase
          </button>
        </div>

        {onRestock && (
          <div className="restock-section">
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              className="quantity-input"
            />
            <button onClick={handleRestock} className="btn btn-success">
              Restock
            </button>
          </div>
        )}

        {onEdit && (
          <button onClick={() => onEdit()} className="btn btn-secondary">
            Edit
          </button>
        )}

        {onDelete && (
          <button onClick={() => onDelete(sweet._id)} className="btn btn-danger">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;


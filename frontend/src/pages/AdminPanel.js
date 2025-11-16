import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SweetForm from '../components/SweetForm';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    fetchSweets();
  }, [isAdmin, navigate]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sweets');
      setSweets(response.data.sweets || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch sweets. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSweet = async (sweetData, imageFile) => {
    try {
      const formData = new FormData();
      Object.keys(sweetData).forEach(key => {
        formData.append(key, sweetData[key]);
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('/api/sweets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSweets([response.data.sweet, ...sweets]);
      setShowAddForm(false);
      alert('Sweet added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add sweet');
    }
  };

  const handleUpdateSweet = async (sweetId, sweetData, imageFile) => {
    try {
      const formData = new FormData();
      Object.keys(sweetData).forEach(key => {
        if (sweetData[key] !== undefined && sweetData[key] !== null) {
          formData.append(key, sweetData[key]);
        }
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(`/api/sweets/${sweetId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSweets(sweets.map(sweet => 
        sweet._id === sweetId ? response.data.sweet : sweet
      ));
      setEditingSweet(null);
      alert('Sweet updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update sweet');
    }
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await axios.delete(`/api/sweets/${sweetId}`);
      setSweets(sweets.filter(sweet => sweet._id !== sweetId));
      alert('Sweet deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async (sweetId, quantity) => {
    try {
      const response = await axios.post(`/api/sweets/${sweetId}/restock`, { quantity });
      setSweets(sweets.map(sweet => 
        sweet._id === sweetId ? response.data.sweet : sweet
      ));
      alert(`Successfully restocked ${quantity} items!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🍬 Admin Panel</h1>
          <div className="admin-header-actions">
            <span className="admin-welcome">Welcome, {user?.username}</span>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              View Dashboard
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-actions-bar">
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingSweet(null);
            }}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add New Sweet'}
          </button>
          <div className="admin-stats">
            <span>Total Sweets: {sweets.length}</span>
          </div>
        </div>

        {showAddForm && (
          <SweetForm
            onSubmit={handleAddSweet}
            onCancel={() => setShowAddForm(false)}
            isAdmin={true}
          />
        )}

        {editingSweet && (
          <SweetForm
            sweet={editingSweet}
            onSubmit={(data, imageFile) => handleUpdateSweet(editingSweet._id, data, imageFile)}
            onCancel={() => setEditingSweet(null)}
            isAdmin={true}
          />
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="no-sweets">
            <p>No sweets found in the database.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Click "Add New Sweet" button above to add your first sweet!
            </p>
          </div>
        ) : (
          <div className="admin-sweets-grid">
            {sweets.map(sweet => (
              <div key={sweet._id} className="admin-sweet-card">
                {sweet.image && (
                  <div className="admin-sweet-image">
                    <img 
                      src={`http://localhost:5000${sweet.image}`} 
                      alt={sweet.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="admin-sweet-info">
                  <h3>{sweet.name}</h3>
                  <span className="sweet-category">{sweet.category}</span>
                  <div className="admin-sweet-details">
                    <div>Price: <strong>${sweet.price.toFixed(2)}</strong></div>
                    <div>Stock: <strong>{sweet.quantity}</strong></div>
                  </div>
                  {sweet.description && (
                    <p className="admin-sweet-description">{sweet.description}</p>
                  )}
                </div>
                <div className="admin-sweet-actions">
                  <button 
                    onClick={() => setEditingSweet(sweet)} 
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(sweet._id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <div className="restock-section">
                    <input
                      type="number"
                      min="1"
                      defaultValue="10"
                      className="quantity-input"
                      id={`restock-${sweet._id}`}
                    />
                    <button 
                      onClick={() => {
                        const qty = parseInt(document.getElementById(`restock-${sweet._id}`).value) || 10;
                        handleRestock(sweet._id, qty);
                      }}
                      className="btn btn-success"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


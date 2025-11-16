import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import SearchBar from '../components/SearchBar';
import SweetDetailModal from '../components/SweetDetailModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [selectedSweetId, setSelectedSweetId] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, [searchParams]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      let response;
      
      if (Object.keys(searchParams).length > 0) {
        const queryString = new URLSearchParams(searchParams).toString();
        response = await axios.get(`/api/sweets/search?${queryString}`);
      } else {
        response = await axios.get('/api/sweets');
      }
      
      // Handle both response formats: { sweets: [...] } or just [...]
      const sweetsData = response.data.sweets || response.data || [];
      setSweets(Array.isArray(sweetsData) ? sweetsData : []);
      setError('');
      
      // Debug logging
      console.log('Search params:', searchParams);
      console.log('Fetched sweets:', sweetsData.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sweets. Please try again.');
      console.error('Fetch error:', err);
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      const response = await axios.post(`/api/sweets/${sweetId}/purchase`, { quantity });
      setSweets(sweets.map(sweet => 
        sweet._id === sweetId ? response.data.sweet : sweet
      ));
      alert(`Successfully purchased ${quantity} item(s)!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
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

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Sweet Shop Dashboard</h1>
        
        {isAdmin && (
          <div className="admin-actions">
            <button 
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingSweet(null);
              }}
              className="btn btn-primary"
            >
              {showAddForm ? 'Cancel' : 'Add New Sweet'}
            </button>
          </div>
        )}

        {showAddForm && isAdmin && (
          <SweetForm
            onSubmit={handleAddSweet}
            onCancel={() => setShowAddForm(false)}
            isAdmin={true}
          />
        )}

        {editingSweet && isAdmin && (
          <SweetForm
            sweet={editingSweet}
            onSubmit={(data, imageFile) => handleUpdateSweet(editingSweet._id, data, imageFile)}
            onCancel={() => setEditingSweet(null)}
            isAdmin={true}
          />
        )}

        <SearchBar onSearch={setSearchParams} />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="no-sweets">
            {Object.keys(searchParams).length > 0 ? (
              <>
                <p>No sweets found matching your search criteria.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#666' }}>
                  Try adjusting your search filters or click "Clear" to see all sweets.
                </p>
              </>
            ) : (
              <>
                <p>No sweets found in the database.</p>
                {isAdmin && (
                  <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                    Click "Add New Sweet" button above to add your first sweet!
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="sweets-grid">
            {sweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onRestock={isAdmin ? handleRestock : null}
                onEdit={isAdmin ? () => setEditingSweet(sweet) : null}
                onDelete={isAdmin ? handleDelete : null}
                onViewDetails={(id) => setSelectedSweetId(id)}
              />
            ))}
          </div>
        )}

        {selectedSweetId && (
          <SweetDetailModal
            sweetId={selectedSweetId}
            onClose={() => setSelectedSweetId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;


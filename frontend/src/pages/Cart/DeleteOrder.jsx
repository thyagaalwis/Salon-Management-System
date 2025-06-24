import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const DeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:8076/order/${orderId}`);
      console.log(response.data); // Log the response
      setLoading(false);
      navigate('/ReadOneHome/${CusID}');
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('An error occurred while deleting the order. Please check the console.');
    }
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1f2937' }}>
      <div style={{ padding: '2rem', maxWidth: '600px', backgroundColor: '#2d3748', borderRadius: '10px', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Delete Order</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Are you sure you want to delete this order?</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleDeleteOrder}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', cursor: 'pointer', border: 'none', marginRight: '1rem' }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <Link
            to={'/orders'}
            style={{ backgroundColor: '#007bff', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrder;

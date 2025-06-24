import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from 'axios';

const DeleteEmployeeAttendance = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle the Employee Attendance deletion
  const handleDeleteAttendance = () => {
    setLoading(true);
    // Sending a DELETE request to the server to delete the attendance record by ID
    axios
      .delete(`http://localhost:8076/employeeAttendence/${id}`)
      .then(() => {
        // If the deletion is successful, update the state and navigate to the attendance list page
        setLoading(false);
        navigate('/employeeattendence/allEmployeeAttendence');
      })
      .catch((error) => {
        // If an error occurs, update the state, show an alert, and log the error to the console
        setLoading(false);
        alert(`An error happened: ${error.response ? error.response.data : error.message}`);
        console.error(error);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1f2937' }}>
      <div style={{ padding: '2rem', maxWidth: '600px', backgroundColor: '#2d3748', borderRadius: '10px', color: '#fff' }}>
        <BackButton destination='/employeeattendence/allEmployeeAttendence' />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Delete Employee Attendance</h1>
        {loading ? <Spinner /> : null}
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Are you sure you want to delete this Attendance Record?</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleDeleteAttendance}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', cursor: 'pointer', border: 'none', marginRight: '1rem' }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <a
            href='/employeeattendence/allEmployeeAttendence'
            style={{ backgroundColor: '#007bff', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeAttendance;

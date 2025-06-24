import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from 'axios';

const DeleteEmployeeSalary = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle the Employee Salary deletion
  const handleDeleteEmployeeSalary = () => {
    setLoading(true);
    // Sending a DELETE request to the server to delete the Employee Salary by ID
    axios
      .delete(`http://localhost:8076/employeeSalary/${id}`)
      .then(() => {
        // If the deletion is successful, update the state and navigate to the all salaries page
        setLoading(false);
        navigate('/employeesalary/allEmployeeSalary');
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
        <BackButton destination='/employeesalary/allEmployeeSalary' />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Delete Employee Salary</h1>
        {loading ? <Spinner /> : null}
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Are you sure you want to delete this Employee Salary?</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleDeleteEmployeeSalary}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', cursor: 'pointer', border: 'none', marginRight: '1rem' }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <a
            href='/employeesalary/allEmployeeSalary'
            style={{ backgroundColor: '#007bff', color: 'white', padding: '0.8rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeSalary;

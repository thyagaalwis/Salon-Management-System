import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Spinner from '../../components/Spinner';
import axios from 'axios';

const DeletePkg = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeletePkg = () => {
    setLoading(true);
    
    axios
      .delete(`http://localhost:8076/pkg/${id}`)
      .then(() => {
        setLoading(false);
        // SweetAlert for success notification
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Package has been deleted successfully!',
          showConfirmButton: false,
          timer: 2000,
        });

        // Redirect after showing the success alert
        setTimeout(() => {
          navigate('/pkg/allPkg');
        }, 2000); // 2-second delay to allow the alert to display
      })
      .catch((error) => {
        setLoading(false);
        // SweetAlert for error notification
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `An error occurred: ${error.response ? error.response.data : error.message}`,
        });
        console.error(error);
      });
  };

  return (
    <div className='p-4 min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 via-blue-300 to-indigo-200'>
      <div className='bg-white shadow-lg rounded-lg w-[600px] p-8 border-t-8 border-red-600'>
        <h1 className='text-3xl font-bold text-gray-800 text-center mb-6'>Delete Package</h1>
        {loading ? <Spinner /> : null}

        <p className='text-xl text-gray-600 text-center mb-8'>
          Are you sure you want to delete this package? This action cannot be undone.
        </p>

        <button
          className='w-full py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300'
          onClick={handleDeletePkg}
        >
          Delete
        </button>
        <button
          className='w-full mt-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 text-lg font-semibold rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200'
          onClick={() => navigate('/pkg/allPkg')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePkg;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import backgroundImage from "../../images/logobg.jpg";
import tableImage from '../../images/tablebg.jpg';
import Spinner from '../../components/Spinner'; // Assuming you have a Spinner component

const ReadOneService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:8076/services/${id}`);
        setService(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load service details. Please try again later.');
      }
    };

    fetchService();
  }, [id]);

  const handleBack = () => {
    navigate('/services/allService');
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    padding: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        {error && <p className="text-red-600">{error}</p>}
        {service ? (
          <div className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${tableImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '1.5rem'
            }}
          >
            <h1 className="text-4xl font-bold text-center my-6 text-gray-800">
              Service Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center mb-4">
                <img
                  src={`http://localhost:8076/${service.image}`}
                  alt="Service"
                  style={{ width: '300px', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div className="text-gray-800">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Service ID</h2>
                  <p className="text-lg">{service.service_ID}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Category</h2>
                  <p className="text-lg">{service.category}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Service Type</h2>
                  <p className="text-lg">{service.subCategory}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Description</h2>
                  <p className="text-lg">{service.description}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Duration</h2>
                  <p className="text-lg">{service.duration}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Price (Rs)</h2>
                  <p className="text-lg">Rs. {service.price}</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mb-2">Available</h2>
                  <p className="text-lg">{service.available ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-black-100 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200"
                onClick={handleBack}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                  Back to Services
                </span>
              </button>
              <Link
                to={`/services/edit/${service._id}`}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-black-100 rounded-lg group bg-gradient-to-br from-green-900 to-green-500 group-hover:to-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-200"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                  Edit Service
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <Spinner /> // Use a spinner component for loading
        )}
      </div>
    </div>
  );
};

export default ReadOneService;

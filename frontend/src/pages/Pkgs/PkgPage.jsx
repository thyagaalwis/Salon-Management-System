import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import servicePc from '../../images/service.jpg';

const PkgPage = () => {
  const [pkg, setPkg] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8076/pkg');
        setPkg(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchPkg();
  }, []);

  // Function to calculate remaining days until package expiration
  const calculateRemainingDays = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

    return daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired";
  };


  return (
    <div className="p-6 min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-64" style={{ backgroundImage: `url(${servicePc})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white text-center">Experience the Best in Beauty</h1>
        </div>
      </div>

      <div className="flex items-center justify-center my-6">
        <h2 className="text-3xl font-semibold text-pink-500">Our Packages</h2>
      </div>

      {error && <p className="text-error text-center mb-6">{error}</p>}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pkg.map(pkgs => (
          <div
            key={pkgs._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <img 
              src={`http://localhost:8076/${pkgs.image}`} 
              alt={pkgs.ID}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-yellow-400 text-text mb-2">{pkgs.p_name}</h3>
              <p className="text-text  text-yellow-600">{pkgs.description}</p>
              <p className="text-text mb-2 font-bold">{pkgs.category}</p>
              <p className="text-text mb-2 ">Conditions :</p> <p className="text-text mb-1 ">{pkgs.conditions}</p>
              <p className="text-text mb-2">Package Type: {pkgs.package_type}</p>
              <p className="text-text mb-2">Base Price: $ {pkgs.base_price}</p>
              <p className="text-text mb-2">Discount:  {pkgs.discount_rate} %</p>
              <p className="text-text mb-2">Final Price: $ {pkgs.final_price}</p>
              <p className="text-text mb-2 ">
              Time Diuration : {pkgs.start_date.slice(0, 10)} to {pkgs.end_date.slice(0, 10)}
            </p>
            <p className="font-bold mb-2 text-red-600">
                ** {calculateRemainingDays(pkgs.end_date)}
              </p>             
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-sm mx-4 mb-6" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <p className="text-text">"Amazing service! The staff was very professional and my experience was top-notch."</p>
            <p className="mt-4 font-semibold">- Jane Doe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PkgPage;

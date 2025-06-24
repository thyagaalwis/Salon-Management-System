import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import backgroundImage from "../../images/logobg.jpg";
import tableImage from '../../images/tablebg.jpg';
import Spinner from '../../components/Spinner'; // Assuming you have a Spinner component

const ReadOnePkg = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const response = await axios.get(`http://localhost:8076/pkg/${id}`);
        setPkg(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load package details. Please try again later.');
      }
    };

    fetchPkg();
  }, [id]);

  const handleBack = () => {
    navigate('/pkg/allPkg');
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

  if (!pkg) {
    return <Spinner />;
  }

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${tableImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '1.5rem'
          }}
        >
          <h1 className="text-4xl font-bold text-center my-6 text-gray-800">
            Package Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Package ID</h2>
              <p className="text-lg">{pkg.ID}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Service Category</h2>
              <p className="text-lg">{pkg.category}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Package Name</h2>
              <p className="text-lg">{pkg.p_name}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Package Type</h2>
              <p className="text-lg">{pkg.package_type ? 'Standard' : 'Promotional'}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-lg">{pkg.description}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Base Price ($)</h2>
              <p className="text-lg">Rs. {pkg.base_price}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Discount Rate (%)</h2>
              <p className="text-lg">{pkg.discount_rate}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Final Price ($)</h2>
              <p className="text-lg">Rs. {pkg.final_price}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Start Date</h2>
              <p className="text-lg">{pkg.start_date}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">End Date</h2>
              <p className="text-lg">{pkg.end_date}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Conditions</h2>
              <p className="text-lg">{pkg.conditions}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Image</h2>
              <img src={`http://localhost:8076/${pkg.image}`} alt="Package Image" style={{ width: '200px', height: '200px' }} />
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-black-100 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200"
              onClick={handleBack}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Back to Packages
              </span>
            </button>
            <Link
              to={`/pkg/edit/${pkg._id}`}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-black-100 rounded-lg group bg-gradient-to-br from-green-900 to-green-500 group-hover:to-green-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-200"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Edit Package
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnePkg;

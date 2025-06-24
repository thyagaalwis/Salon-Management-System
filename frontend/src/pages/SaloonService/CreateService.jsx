import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner'; // Make sure to import Spinner
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const subCategories = {
  Hair: ['Men Cut','Women Cut', 'Color', 'Style', 'Blow Dry', 'Perm', 'Extensions', 'Highlights', 'Straightening','Treatment'],
  'Skin Care': ['Facial','Full Body Massage', 'Body Scrub','Exfoliation', 'Moisturizing', 'Acne Treatment', 'Anti-Aging', 'Skin Brightening', 'Microdermabrasion'],
  Nail: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Nails', 'Acrylic Nails', 'Nail Repair', 'Nail Polish', 'Cuticle Care'],
  Weddings: ['Bridal Hair','Bridal Makeup','Bridesmaids Hair','Bridesmaids Makeup','Package Deals'],
};

const CreateService = () => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState('');
  const [error, setError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPriceError('');
    setDurationError('');
    setLoading(true);

    if (!price || isNaN(price)) {
      setPriceError('Please enter a valid number for price.');
      setLoading(false);
      return;
    }

    if ((!hours && !minutes) || isNaN(hours) || isNaN(minutes)) {
      setDurationError('Please enter valid numbers for hours and/or minutes.');
      setLoading(false);
      return;
    }

    const duration = `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}min` : ''}`.trim();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('price', price);
    formData.append('available', available);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:8076/services', formData);
      setLoading(false);
      navigate('/services/allService');
    } catch (error) {
      console.error(error);
      setError('Failed to create the service. Please try again.');
      setLoading(false);
    }
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setHours(value);
      setDurationError('');
    } else {
      setDurationError('Please enter a valid number for hours.');
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value <= 60) {
      setMinutes(value);
      setDurationError('');
    } else {
      setDurationError('Please enter a valid number for minutes (0-60).');
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create New Service</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-5 text-gray-700">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select Category</option>
                <option value="Hair">Hair</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Nail">Nail</option>
                <option value="Weddings">Weddings</option>
              </select>
            </div>

            {category && (
              <div>
                <label htmlFor="subCategory" className="block text-sm font-medium leading-5 text-gray-700">Sub Category</label>
                <select
                  id="subCategory"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                >
                  <option value="">Select Sub Category</option>
                  {subCategories[category].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium leading-5 text-gray-700">Duration</label>
              <div className="flex space-x-4">
                <input
                  id="hours"
                  type="text"
                  value={hours}
                  onChange={handleHoursChange}
                  placeholder="Hours"
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                />
                <input
                  id="minutes"
                  type="text"
                  value={minutes}
                  onChange={handleMinutesChange}
                  placeholder="Minutes"
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                />
              </div>
              {durationError && <p className="text-red-600 mt-2">{durationError}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium leading-5 text-gray-700">Price ($)</label>
              <input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
              {priceError && <p className="text-red-600 mt-2">{priceError}</p>}
            </div>

            <div>
              <label htmlFor="available" className="block text-sm font-medium leading-5 text-gray-700">Available</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    id="availableYes"
                    name="available"
                    checked={available === 'Yes'}
                    onChange={() => setAvailable('Yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    id="availableNo"
                    name="available"
                    checked={available === 'No'}
                    onChange={() => setAvailable('No')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Select Image</label>
              <input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <span className="block w-40 rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : "Create Service"}
                </button>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;

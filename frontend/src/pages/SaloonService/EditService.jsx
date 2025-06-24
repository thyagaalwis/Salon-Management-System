import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const subCategories = {
  Hair: ['Men Cut','Women Cut', 'Color', 'Style', 'Blow Dry', 'Perm', 'Extensions', 'Highlights', 'Straightening','Treatment'],
  'Skin Care': ['Facial','Full Body Massage', 'Body Scrub','Exfoliation', 'Moisturizing', 'Acne Treatment', 'Anti-Aging', 'Skin Brightening', 'Microdermabrasion'],
  Nail: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Nails', 'Acrylic Nails', 'Nail Repair', 'Nail Polish', 'Cuticle Care'],
  Weddings: ['Bridal Hair','Bridal Makeup','Bridesmaids Hair','Bridesmaids Makeup','Package Deals'],
};

const EditService = () => {
  const { id } = useParams(); // Get serviceId from the URL
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // For uploading a new image
  const [existingImage, setExistingImage] = useState(''); // For displaying the existing image
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState('Yes');
  const [error, setError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the service details using the serviceId
    axios.get(`http://localhost:8076/services/${id}`)
      .then((response) => {
        const service = response.data;
        setCategory(service.category);
        setSubCategory(service.subCategory);
        setDescription(service.description);

        // Split duration into hours and minutes
        const [serviceHours, serviceMinutes] = service.duration
          .split(' ')
          .map((part) => part.replace(/\D/g, '')); // Remove non-numeric characters

        setHours(serviceHours || '');
        setMinutes(serviceMinutes || '');

        setPrice(service.price);
        setAvailable(service.available);
        setExistingImage(service.image); // Set the existing image URL
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load the service. Please try again.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setPriceError('');
    setDurationError('');

    // Validate price and duration
    if (!price || isNaN(price)) {
      setPriceError('Please enter a valid number for price.');
      return;
    }

    // Validate duration input (hours and minutes)
    if ((!hours && !minutes) || isNaN(hours) || isNaN(minutes)) {
      setDurationError('Please enter valid numbers for hours and/or minutes.');
      return;
    }

    // Combine hours and minutes into a single duration string
    const duration = `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}min` : ''}`.trim();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('price', price);
    formData.append('available', available);

    // Append the new image if a new one is selected
    if (image) {
      formData.append('image', image);
    }

    axios.put(`http://localhost:8076/services/${id}`, formData)
      .then(() => {
        navigate('/services/allService'); // Redirect to the list after successful update
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to update the service. Please try again.');
      });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setPriceError('');
    } else {
      setPriceError('Please enter a valid number.');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  if (loading) {
    return <p>Loading service details...</p>;
  }

   // Handle numeric input for hours
   const handleHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setHours(value);
      setDurationError(''); // Clear error message if valid
    } else {
      setDurationError('Please enter a valid number for hours.');
    }
  };

  // Handle numeric input for minutes
  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value <= 60) { // Ensuring minutes are less than or equal to 59
      setMinutes(value);
      setDurationError(''); // Clear error message if valid
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Edit Service</h2>
      </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form 
        onSubmit={handleSubmit} 
        className='space-y-4 '
      >
         <div>
          <label htmlFor="category" className="block text-sm font-medium leading-5 text-gray-700">Category:</label>
          <select
          id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(''); // Reset subcategory when category changes
            }}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
          >
            <option value="">Select Category</option>
            <option value="Hair">Hair</option>
            <option value="Skin Care">Skin Care</option>
            <option value="Nail">Nail</option>
          </select>
        </div>

        {category && (
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium leading-5 text-gray-700">Sub Category:</label>
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
          <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                rows="3"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium leading-5 text-gray-700">Duration:</label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={hours}
              onChange={handleHoursChange}
              placeholder="Hours"
               className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
            />
            <input
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
          <label htmlFor="price" className="block text-sm font-medium leading-5 text-gray-700">Price: (Rs)</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
          />
          {priceError && <p className="text-red-600 mt-2">{priceError}</p>} {/* Display price error */}
        </div>

        <div>
          <label htmlFor="available" className="block text-sm font-medium leading-5 text-gray-700">Available:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Yes"
                checked={available === 'Yes'}
                onChange={() => setAvailable('Yes')}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="No"
                checked={available === 'No'}
                onChange={() => setAvailable('No')}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">Current Image:</label>
          {existingImage ? (
            <img 
              src={`http://localhost:8076/${existingImage}`} 
              alt="Service Image" 
              className="w-32 h-32 object-cover mb-4"
            />
          ) : (
            <p>No image available.</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Select New Image (optional)</label>
          <input 
            type="file" 
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
          />
          {image && <p>New image selected: {image.name}</p>}
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
        <span className="block w-40 rounded-md shadow-sm">
        <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : "Update Service"}
                </button>
              </span>
            </div>

      </form>
    </div>
    </div>
    </div>
  );
};

export default EditService;

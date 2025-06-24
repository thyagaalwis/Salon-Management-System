import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';
import Swal from 'sweetalert2';

const EditPkg = () => {
    const { id } = useParams();
    const [description, setDescription] = useState('');
    const [base_price, setBasePrice] = useState('');
    const [discount_rate, setDiscount] = useState('');
    const [final_price, setFinalPrice] = useState('');
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [conditions, setCondition] = useState('');
    const [package_type, setType] = useState('');
    const [p_name, setPName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`http://localhost:8076/pkg/${id}`);
                const pkg = response.data;
                setDescription(pkg.description);
                setBasePrice(pkg.base_price);
                setDiscount(pkg.discount_rate);
                setFinalPrice(pkg.final_price);
                setStartDate(new Date(pkg.start_date));
                setEndDate(new Date(pkg.end_date));
                setCondition(pkg.conditions);
                setType(pkg.package_type);
                setPName(pkg.p_name);
                setCategory(pkg.category);
                setExistingImage(pkg.image);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching package:", error);
                setError('Unable to fetch package details.');
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    useEffect(() => {
        if (base_price && discount_rate) {
            const discount = parseFloat(discount_rate) / 100;
            const final = parseFloat(base_price) * (1 - discount);
            setFinalPrice(final.toFixed(2));
        }
    }, [base_price, discount_rate]);

    const handleUpdatePackage = async (e) => {
        e.preventDefault();
        setError('');

        // Validation: Check if end date is valid
        if (end_date && start_date && end_date <= start_date) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'End date must be after start date.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('description', description);
        formData.append('base_price', base_price);
        formData.append('discount_rate', discount_rate);
        formData.append('final_price', final_price);
        formData.append('start_date', start_date ? start_date.toISOString().split('T')[0] : null);
        formData.append('end_date', end_date ? end_date.toISOString().split('T')[0] : null);
        formData.append('conditions', conditions);
        formData.append('package_type', package_type);
        formData.append('p_name', p_name);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(`http://localhost:8076/pkg/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/pkg/allPkg');
        } catch (error) {
            console.error(error);
            setError('Failed to update the package. Please try again.');
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    if (loading) {
        return <p>Loading package details...</p>;
    }

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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Edit Package</h2>
      </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    <form onSubmit={handleUpdatePackage} className='space-y-4'>

                          {/* Category */}
<div>
    <label htmlFor="category" className="block text-sm font-medium leading-5 text-gray-700">Service Categories</label>
    <div className="flex items-center space-x-4">
        <label className="flex items-center">
            <input
                type="radio"
                value="Hair"
                checked={category === 'Hair'}
                onChange={() => setCategory('Hair')}
                className="mr-2"
                required
            />
            Hair
        </label>
        <label className="flex items-center">
            <input
                type="radio"
                value="Weddings"
                checked={category === 'Weddings'}
                onChange={() => setCategory('Weddings')}
                className="mr-2"
                required
            />
            Weddings
        </label>
        <label className="flex items-center">
            <input
                type="radio"
                value="Skin Care"
                checked={category === 'Skin Care'}
                onChange={() => setCategory('Skin Care')}
                className="mr-2"
                required
            />
            Skin Care
        </label>
        <label className="flex items-center">
            <input
                type="radio"
                value="Nail"
                checked={category === 'Nail'}
                onChange={() => setCategory('Nail')}
                className="mr-2"
                required
            />
            Nail
        </label>
    </div>
</div>


                        <div>
                            <label htmlFor="p_name" className="block text-sm font-medium leading-5 text-gray-700">Package Name:</label>
                            <input
                                type="text"
                                id="p_name"
                                value={p_name}
                                onChange={(e) => setPName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="package_type" className="block text-sm font-medium leading-5 text-gray-700">Package Type:</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="Standard"
                                        checked={package_type === 'Standard'}
                                        onChange={() => setType('Standard')}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Standard</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="Promotional"
                                        checked={package_type === 'Promotional'}
                                        onChange={() => setType('Promotional')}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Promotional</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700">Description:</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="base_price" className="block text-sm font-medium leading-5 text-gray-700">Base Price ($):</label>
                            <input
                                type="number"
                                id="base_price"
                                value={base_price}
                                onChange={(e) => setBasePrice(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="discount_rate" className="block text-sm font-medium leading-5 text-gray-700">Discount Rate (%):</label>
                            <input
                                type="number"
                                id="discount_rate"
                                value={discount_rate}
                                onChange={(e) => setDiscount(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="final_price" className="block text-sm font-medium leading-5 text-gray-700">Final Price ($):</label>
                            <input
                                type="number"
                                id="final_price"
                                value={final_price}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium leading-5 text-gray-700">Start Date:</label>
                            <DatePicker
                                selected={start_date}
                                onChange={date => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium leading-5 text-gray-700">End Date:</label>
                            <DatePicker
                                selected={end_date}
                                onChange={date => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="conditions" className="block text-sm font-medium leading-5 text-gray-700">Conditions:</label>
                            <textarea
                                id="conditions"
                                value={conditions}
                                onChange={(e) => setCondition(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-5 text-gray-700">Current Image:</label>
                            {existingImage ? (
                                <div className="mb-4">
                                    <img
                                        src={`http://localhost:8076/${existingImage}`} 
                                        alt="Current package" 
                                        className="w-32 h-32 object-cover mb-4"
                                        />
                                </div>
                            ) : (
                                <p>No image uploaded.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Update Image:</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
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
                  {loading ? <Spinner /> : "Update Package"}
                </button>
              </span>
            </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPkg;

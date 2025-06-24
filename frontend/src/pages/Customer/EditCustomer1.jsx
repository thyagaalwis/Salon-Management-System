import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditCustomer = () => {
  const [customer, setCustomer] = useState({
    CusID: '',  // Ensuring CusID is part of the state
    FirstName: '',
    LastName: '',
    Age: '',
    Gender: '',
    ContactNo: '',
    Email: '',
    Password: '',
    reEnteredPassword: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const storage = getStorage(app);
  const navigate = useNavigate();
  const { CusID } = useParams();  // Extracting CusID from URL params

  // Use CusID to fetch the customer
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8076/customers/${CusID}`)  // Fetch based on CusID
      .then((response) => {
        setCustomer(response.data);
        setLoading(false);
        console.log("Fetched customer data:", response.data);
        if (response.data.image) {
          setImagePreview(response.data.image);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again later.',
        });
        console.log(error);
      });
  }, [CusID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Validation logic
    if (name === 'ContactNo' && !/^(0\d{9})$/.test(value)) {
      error = "Phone number must start with '0' and be exactly 10 digits long.";
    }

    if (name === 'FirstName' && !/^[A-Z][a-z]*$/.test(value)) {
      error = "First name must start with a capital letter and contain only letters.";
    }

    if (name === 'LastName' && !/^[A-Z][a-z]*$/.test(value)) {
      error = "Last name must start with a capital letter and contain only letters.";
    }

    if (name === 'Age') {
      const ageValue = Number(value);
      if (isNaN(ageValue) || ageValue < 0 || ageValue > 120) {
        error = "Age must be a number between 0 and 120.";
      }
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      setCustomer(prevState => ({
        ...prevState,
        image: imageFile,
      }));
      setImagePreview(URL.createObjectURL(imageFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    // Check for errors before proceeding
    if (Object.values(errors).some(err => err !== "")) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please correct the errors in the form.',
      });
      return;
    }
  
    try {
      let imageUrl = '';

      if (customer.image && customer.image instanceof File) {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `customer_images/${CusID}`);  // Use CusID for image storage
        const uploadTask = await uploadBytesResumable(storageRef, customer.image);
        
        // Get the download URL after the image is uploaded
        imageUrl = await getDownloadURL(uploadTask.ref);
      } else if (customer.image) {
        // If there is an existing image, get its URL
        imageUrl = customer.image; // Keep the existing URL if no new image is uploaded
      }
  
      // Update customer with the new image URL (or existing one)
      const updatedCustomer = { ...customer, image: imageUrl };
      await axios.patch(`http://localhost:8076/customers/${CusID}`, updatedCustomer);  // Update by CusID
  
      setLoading(false);
      navigate(`/customers/get/${CusID}`);  // Redirect using CusID
    } catch (error) {
      setLoading(false);
      console.error('Error updating customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating the customer. Please try again later.',
      });
    }
};

  

  
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Customer Information
          </h2>
          <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
            <a href="/cLogin" className="font-medium text-pink-600 hover:text-pink-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Login to your account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div>
                <label htmlFor="FirstName" className="block text-sm font-medium leading-5 text-gray-700">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="FirstName"
                    name="FirstName"
                    placeholder="John"
                    type="text"
                    value={customer.FirstName}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.FirstName && <p className="text-red-500 text-xs">{errors.FirstName}</p>}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="LastName" className="block text-sm font-medium leading-5 text-gray-700">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="LastName"
                    name="LastName"
                    placeholder="Doe"
                    type="text"
                    value={customer.LastName}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.LastName && <p className="text-red-500 text-xs">{errors.LastName}</p>}
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="Age" className="block text-sm font-medium leading-5 text-gray-700">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Age"
                    name="Age"
                    type="number"
                    value={customer.Age}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.Age && <p className="text-red-500 text-xs">{errors.Age}</p>}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="Gender" className="block text-sm font-medium leading-5 text-gray-700">Gender</label>
                <select
                  id="Gender"
                  name="Gender"
                  value={customer.Gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Contact No */}
              <div>
                <label htmlFor="ContactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact No</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ContactNo"
                    name="ContactNo"
                    placeholder="0712345678"
                    type="text"
                    value={customer.ContactNo}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.ContactNo && <p className="text-red-500 text-xs">{errors.ContactNo}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="Email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Email"
                    name="Email"
                    type="email"
                    value={customer.Email}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="Password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Password"
                    name="Password"
                    type="password"
                    value={customer.Password}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Re-enter Password */}
              <div>
                <label htmlFor="reEnteredPassword" className="block text-sm font-medium leading-5 text-gray-700">Re-enter Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="reEnteredPassword"
                    name="reEnteredPassword"
                    type="password"
                    value={customer.reEnteredPassword}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Image Upload */}
             {/* Image Upload */}
<div className="col-span-2">
  <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Profile Image</label>
  <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
  {customer.image ? (
    <div className="mt-2">
      <p className="text-sm">Preview:</p>
      <img
        src={imagePreview}
        alt="Preview"
        className="h-32 w-32 object-cover rounded-full"
      />
    </div>
  ) : (
    <p className="text-gray-500">No file chosen</p>
  )}
</div>


              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:ring focus:ring-pink-200 active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;

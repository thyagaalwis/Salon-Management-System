import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const CreateEmployees = () => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Age, setAge] = useState('');
  const [Gender, setGender] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveEmployee = (e) => {
    e.preventDefault();

    // Validation checks
    if (!FirstName || !LastName || !Age || !Gender || !ContactNo || !Email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    if (isNaN(Age) || Age <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Age',
        text: 'Please enter a valid age.',
      });
      return;
    }

    if (!/^\d{10}$/.test(ContactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Contact Number',
        text: 'Please enter a valid 10-digit contact number.',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(Email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);

    const data = {
      FirstName,
      LastName,
      Age,
      Gender,
      ContactNo,
      Email,
    };

    axios
      .post('http://localhost:8076/employees', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Employee created successfully!',
        });
        navigate('/employees/allEmployee');
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while creating the employee. Please check console.',
        });
        console.log(error);
      });
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <BackButton destination='/employees/allEmployee' />
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Create Employee
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSaveEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium leading-5 text-gray-700">First Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium leading-5 text-gray-700">Last Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium leading-5 text-gray-700">Age</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={Age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium leading-5 text-gray-700">Gender</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="gender"
                  name="gender"
                  value={Gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact Number</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="contactNo"
                  name="contactNo"
                  type="tel"
                  value={ContactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="col-span-2">
              <span className="block w-40 rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : "Save Employee"}
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployees;

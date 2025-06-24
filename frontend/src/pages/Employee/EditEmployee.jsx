import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    EmpID: '',
    FirstName: '',
    LastName: '',
    Age: '',
    Gender: '',
    ContactNo: '',
    Email: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8076/employees/${id}`)
      .then((response) => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while fetching employee data. Please check console.',
        });
        console.log(error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Validation logic
    if (name === 'ContactNo' && !/^\d{10}$/.test(value)) {
      error = "Contact number must be exactly 10 digits long.";
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

    setEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
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
      const updatedEmployee = { ...employee };
      axios.put(`http://localhost:8076/employees/${id}`, updatedEmployee)
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            navigate('/employees/allEmployee');
          } else {
            console.error('Unexpected response status:', response.status);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Unexpected response status. Please try again later.',
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error updating employee:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating the employee. Please try again later.',
          });
        });
    } catch (error) {
      setLoading(false);
      console.error('Error updating employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating the employee. Please try again later.',
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
        <BackButton destination='/employees/allEmployee' />
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Employee Information
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Employee ID */}
              <div>
                <label htmlFor="EmpID" className="block text-sm font-medium leading-5 text-gray-700">Employee ID</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="EmpID"
                    name="EmpID"
                    type="text"
                    value={employee.EmpID}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="FirstName" className="block text-sm font-medium leading-5 text-gray-700">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="FirstName"
                    name="FirstName"
                    type="text"
                    value={employee.FirstName}
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
                    type="text"
                    value={employee.LastName}
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
                    value={employee.Age}
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
                  value={employee.Gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="ContactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ContactNo"
                    name="ContactNo"
                    type="text"
                    value={employee.ContactNo}
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
                    value={employee.Email}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;

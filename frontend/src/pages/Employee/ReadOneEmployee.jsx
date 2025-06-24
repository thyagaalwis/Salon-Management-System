import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import tableImage from '../../images/tablebg.jpg';
import backgroundImage from "../../images/logobg.jpg";

const ShowEmployees = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8076/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',  // Full viewport width
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        <BackButton destination='/employees/allEmployee' />
        <div className="text-center my-8">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
            Employee <span className="text-pink-600 dark:text-pink-500">Profile</span>
          </h1>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden" style={{
            backgroundImage: `url(${tableImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div className="flex flex-col md:flex-row items-center p-6">
              <div className="md:w-2/3 w-full text-center md:text-left mt-4 md:mt-0">
                <h2 className="text-2xl font-bold text-gray-800">{employee.FirstName} {employee.LastName}</h2>
                <p className="text-gray-800 mt-2">{employee.Email}</p>
                <div className="text-gray-800 mt-4">
                  <p><strong>EmpID:</strong> {employee.EmpID}</p>
                  <p><strong>Age:</strong> {employee.Age}</p>
                  <p><strong>Gender:</strong> {employee.Gender}</p>
                  <p><strong>Contact No:</strong> {employee.ContactNo}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-6 border-t">
              <button
                className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                onClick={() => { window.location.href = `/employees/edit/${employee._id}` }}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                  Edit Profile
                </span>
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowEmployees;

import { useState, useEffect } from "react";
import React from 'react';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const buttonStyle = 'py-2 px-4 text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out';

const CreateEmployeeAttendance = () => {
  const [EmpID, setEmpID] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [date, setDate] = useState('');
  const [InTime, setInTime] = useState('');
  const [OutTime, setOutTime] = useState('');
  const [WorkingHours, setWorkingHours] = useState('');
  const [OThours, setOThours] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8076/employees');
        const responseData = response.data;
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          const employees = responseData.data;
          const options = employees.map(emp => ({
            value: emp.EmpID,
            label: `${emp.FirstName} ${emp.LastName}`
          }));
          setEmployeeOptions(options);
        } else {
          console.error("Unexpected response format:", responseData);
          Swal.fire({
            title: 'Error',
            text: 'Unexpected response format from the server.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        Swal.fire({
          title: 'Error',
          text: 'Unable to fetch employee data. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchEmployees();
  }, []);

  const handleEmpIDChange = (e) => {
    const selectedEmpID = e.target.value;
    setEmpID(selectedEmpID);
    const selectedEmployee = employeeOptions.find(emp => emp.value === selectedEmpID);
    if (selectedEmployee) {
      setEmployeeName(selectedEmployee.label);
    } else {
      setEmployeeName('');
    }
  };

  const calculateHours = (inTime, outTime) => {
    if (inTime && outTime) {
      const inDate = new Date(`1970-01-01T${inTime}:00`);
      const outDate = new Date(`1970-01-01T${outTime}:00`);
      const totalHours = (outDate - inDate) / (1000 * 60 * 60); // Convert milliseconds to hours

      const workingHours = Math.min(totalHours, 8);
      const otHours = totalHours > 8 ? totalHours - 8 : 0;

      setWorkingHours(workingHours.toFixed(2)); // Set to 2 decimal places
      setOThours(otHours.toFixed(2));
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleInTimeChange = (e) => {
    setInTime(e.target.value);
    calculateHours(e.target.value, OutTime);
  };

  const handleOutTimeChange = (e) => {
    setOutTime(e.target.value);
    calculateHours(InTime, e.target.value);
  };

  const handleSetCurrentInTime = () => {
    const currentTime = getCurrentTime();
    setInTime(currentTime);
    calculateHours(currentTime, OutTime);
  };

  const handleSetCurrentOutTime = () => {
    const currentTime = getCurrentTime();
    setOutTime(currentTime);
    calculateHours(InTime, currentTime);
  };

  const validateForm = () => {
    if (!EmpID || !date || !InTime || !OutTime) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill out all required fields.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return false;
    }
    if (InTime >= OutTime) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Out Time must be later than In Time.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return false;
    }
    return true;
  };

  const handleSaveAttendance = () => {
    if (!validateForm()) return;

    const data = {
      EmpID,
      employeeName,
      date,
      InTime,
      OutTime,
      WorkingHours,
      OThours,
    };

    setLoading(true);

    axios
      .post('http://localhost:8076/employeeAttendence', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          title: 'Success',
          text: 'Attendance saved successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => navigate('/employeeattendence/allEmployeeAttendence'));
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred. Please check the console.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
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
      <BackButton destination='/employeeattendence/allEmployeeAttendence' />
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Create Employee Attendance
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="empID" className="block text-sm font-medium leading-5 text-gray-700">Employee ID</label>
              <select
                id="empID"
                value={EmpID}
                onChange={handleEmpIDChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                <option value="" disabled>Select Employee ID</option>
                {employeeOptions.map((emp) => (
                  <option key={emp.value} value={emp.value}>{emp.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="employeeName" className="block text-sm font-medium leading-5 text-gray-700">Employee Name</label>
              <input
                id="employeeName"
                type="text"
                value={employeeName}
                readOnly
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium leading-5 text-gray-700">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>
            <div>
              <label htmlFor="inTime" className="block text-sm font-medium leading-5 text-gray-700">In Time</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="inTime"
                  type="time"
                  value={InTime}
                  onChange={handleInTimeChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
                <button
                  type="button"
                  onClick={handleSetCurrentInTime}
                  className="absolute inset-y-0 right-0 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-gray-500"
                >
                  Now
                </button>
              </div>

            <div>
              <label htmlFor="outTime" className="block text-sm font-medium leading-5 text-gray-700">Out Time</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="outTime"
                  type="time"
                  value={OutTime}
                  onChange={handleOutTimeChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
                <button
                  type="button"
                  onClick={handleSetCurrentOutTime}
                  className="absolute inset-y-0 right-0 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-gray-500"
                >
                  Now
                </button>
              </div>
            </div>

              <label htmlFor="workingHours" className="block text-sm font-medium leading-5 text-gray-700">Working Hours</label>
              <input
                id="workingHours"
                type="text"
                value={WorkingHours}
                readOnly
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>
            <div>
              <label htmlFor="oThours" className="block text-sm font-medium leading-5 text-gray-700">Overtime Hours</label>
              <input
                id="oThours"
                type="text"
                value={OThours}
                readOnly
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveAttendance}
                className={buttonStyle}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeAttendance;

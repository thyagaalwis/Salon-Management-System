import { useState, useEffect } from "react";
import React from 'react';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const CreateEmployeeSalary = () => {
  const [EmpID, setEmpID] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalOThours, setTotalOThours] = useState('');
  const [totalOTpay, setTotalOTpay] = useState('');
  const [totalWorkedhours, setTotalWorkedhours] = useState('');
  const [totalWorkedpay, setTotalWorkedpay] = useState('');
  const [TotalSalary, setTotalSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [includeEPF, setIncludeEPF] = useState(false); // State for EPF
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
            label: `${emp.FirstName} ${emp.LastName}`,
            BasicSalary: emp.BasicSalary
          }));
          setEmployeeOptions(options);
        } else {
          Swal.fire("Error", "Unexpected response format from the server.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Unable to fetch employee data. Please try again.", "error");
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (EmpID && fromDate && toDate) {
      fetchAttendanceData();
    }
  }, [EmpID, fromDate, toDate, includeEPF]);

  useEffect(() => {
    if (employeeData) {
      calculateSalary();
    }
  }, [totalOThours, totalWorkedhours, includeEPF]);

  const handleEmpIDChange = async (e) => {
    const selectedEmpID = e.target.value;
    setEmpID(selectedEmpID);
    const selectedEmployee = employeeOptions.find(emp => emp.value === selectedEmpID);
    if (selectedEmployee) {
      setEmployeeName(selectedEmployee.label);
      setEmployeeData(selectedEmployee);
      fetchAttendanceData();
    } else {
      resetFields();
    }
  };
  
  const fetchAttendanceData = async () => {
    if (!EmpID) return; // Only fetch if EmpID is provided
  
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8076/employeeAttendence');
      const attendanceData = response.data.data;
  
      const filteredAttendance = attendanceData.filter(
        (attendance) =>
          attendance.EmpID === EmpID &&
          (!fromDate || new Date(attendance.date) >= new Date(fromDate)) &&
          (!toDate || new Date(attendance.date) <= new Date(toDate))
      );
  
      const totalOvertimeHours = filteredAttendance.reduce(
        (total, attendance) => total + (attendance.OThours || 0),
        0
      );
  
      const totalWorkedHours = filteredAttendance.reduce(
        (total, attendance) => total + (attendance.WorkingHours || 0),
        0
      );
  
      const otPay = totalOvertimeHours * 585; 
      const workedPay = totalWorkedHours * 160; 
  
      setTotalOThours(totalOvertimeHours.toFixed(2)); // Set to 2 decimal places
      setTotalWorkedhours(totalWorkedHours.toFixed(2)); // Set to 2 decimal places
      setTotalOTpay(otPay.toFixed(2)); // Set to 2 decimal places
      setTotalWorkedpay(workedPay.toFixed(2)); // Set to 2 decimal places
      
      calculateSalary(); // Calculate salary whenever attendance data changes
  
    } catch (error) {
      Swal.fire("Error", "Unable to fetch attendance data. Please try again.", "error");
    }
    setLoading(false);
  };
  
  const calculateSalary = () => {
    if (employeeData) {
      const basicSalary = employeeData.BasicSalary || 0;
      const total = (parseFloat(totalOTpay) || 0) + (parseFloat(totalWorkedpay) || 0) + basicSalary;
      const finalSalary = includeEPF ? total * 0.9 : total; // Deduct EPF if included
      setTotalSalary(finalSalary.toFixed(2)); // Set to 2 decimal places
    }
  };

  const handleSaveEmployeeSalary = () => {
    
    if (isNaN(totalOThours) || totalOThours < 0 || isNaN(totalWorkedhours) || totalWorkedhours < 0) {
      Swal.fire("Invalid Input", "Please enter valid numbers for worked and overtime hours.", "error");
      return;
    }

    setLoading(true);

    const data = {
      EmpID,
      employeeName,
      fromDate: fromDate || null,
      toDate: toDate || null,
      totalOThours: parseFloat(totalOThours) || 0,
      totalOTpay: parseFloat(totalOTpay) || 0,
      totalWorkedhours: parseFloat(totalWorkedhours) || 0,
      totalWorkedpay: parseFloat(totalWorkedpay) || 0,
      TotalSalary: parseFloat(TotalSalary) || 0,
      includeEPF, // Include EPF status in the data sent to the server
    };

    axios
      .post('http://localhost:8076/employeeSalary', data)
      .then(() => {
        setLoading(false);
        Swal.fire("Success", "Employee salary created successfully!", "success")
          .then(() => navigate('/employeesalary/allEmployeeSalary'));
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire("Error", "An error occurred while creating the salary.", "error");
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
      <BackButton destination='/employeeSalary/allEmployeeSalary' />
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Create Employee Salary
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading && <Spinner />}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="empID" className="block text-sm font-medium leading-5 text-gray-700">Employee ID</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="empID"
                  value={EmpID}
                  onChange={handleEmpIDChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>Select Employee ID</option>
                  {employeeOptions.map(emp => (
                    <option key={emp.value} value={emp.value}>{emp.value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="employeeName" className="block text-sm font-medium leading-5 text-gray-700">Employee Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="employeeName"
                  type="text"
                  value={employeeName}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium leading-5 text-gray-700">From Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="toDate" className="block text-sm font-medium leading-5 text-gray-700">To Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="totalOThours" className="block text-sm font-medium leading-5 text-gray-700">Total Overtime Hours</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="totalOThours"
                  type="number"
                  value={totalOThours}
                  onChange={(e) => setTotalOThours(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="totalOTpay" className="block text-sm font-medium leading-5 text-gray-700">Total Overtime Pay</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="totalOTpay"
                  type="text"
                  value={totalOTpay}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="totalWorkedhours" className="block text-sm font-medium leading-5 text-gray-700">Total Worked Hours</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="totalWorkedhours"
                  type="number"
                  value={totalWorkedhours}
                  onChange={(e) => setTotalWorkedhours(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="totalWorkedpay" className="block text-sm font-medium leading-5 text-gray-700">Total Worked Pay</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="totalWorkedpay"
                  type="text"
                  value={totalWorkedpay}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="totalSalary" className="block text-sm font-medium leading-5 text-gray-700">Total Salary</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="totalSalary"
                  type="text"
                  value={TotalSalary}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="includeEPF" className="block text-sm font-medium leading-5 text-gray-700">Include EPF</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="includeEPF"
                  type="checkbox"
                  checked={includeEPF}
                  onChange={() => setIncludeEPF(!includeEPF)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveEmployeeSalary}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeSalary;

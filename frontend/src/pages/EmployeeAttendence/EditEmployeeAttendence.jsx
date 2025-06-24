import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditEmployeeAttendance = () => {
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
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8076/employeeAttendence/${id}`);
        const attendanceData = response.data;

        setEmpID(attendanceData.EmpID);
        setEmployeeName(attendanceData.employeeName);
        setDate(attendanceData.date);
        setInTime(attendanceData.InTime);
        setOutTime(attendanceData.OutTime);
        setWorkingHours(attendanceData.WorkingHours);
        setOThours(attendanceData.OThours);

        const empResponse = await axios.get('http://localhost:8076/employees');
        const employees = empResponse.data.data;
        const options = employees.map(emp => ({
          value: emp.EmpID,
          label: `${emp.FirstName} ${emp.LastName}`
        }));
        setEmployeeOptions(options);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred. Please check the console.',
        });
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

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
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
      });
      return false;
    }
    if (new Date(`1970-01-01T${InTime}:00`) >= new Date(`1970-01-01T${OutTime}:00`)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Time',
        text: 'Out Time must be later than In Time.',
      });
      return false;
    }
    return true;
  };

  const handleEditAttendance = () => {
    if (!validateForm()) return;

    const data = {
      EmpID,
      employeeName,
      date,
      InTime,
      OutTime,
      WorkingHours,
      OThours
    };
    setLoading(true);

    axios
      .put(`http://localhost:8076/employeeAttendence/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Attendance record updated successfully.',
        }).then(() => {
          navigate('/employeeattendence/allEmployeeAttendence');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the record.',
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
    <div style={containerStyle}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <BackButton destination='/employeeattendence/allEmployeeAttendence' />
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Employee Attendance
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {loading && <Spinner />}
            <form onSubmit={(e) => { e.preventDefault(); handleEditAttendance(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="EmpID" className="block text-sm font-medium leading-5 text-gray-700">Employee ID</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="EmpID"
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
                <label htmlFor="date" className="block text-sm font-medium leading-5 text-gray-700">Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="InTime" className="block text-sm font-medium leading-5 text-gray-700">In Time</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="InTime"
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
              </div>

              <div>
                <label htmlFor="OutTime" className="block text-sm font-medium leading-5 text-gray-700">Out Time</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="OutTime"
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

              <div>
                <label htmlFor="WorkingHours" className="block text-sm font-medium leading-5 text-gray-700">Working Hours</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="WorkingHours"
                    type="text"
                    value={WorkingHours}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="OThours" className="block text-sm font-medium leading-5 text-gray-700">Overtime Hours</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="OThours"
                    type="text"
                    value={OThours}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-pink-600 shadow-sm hover:bg-pink-700 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition duration-150 ease-in-out"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeAttendance;

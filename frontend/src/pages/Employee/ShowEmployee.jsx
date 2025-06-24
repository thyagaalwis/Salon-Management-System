import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdOutlineMoreVert } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import EmployeeReport from './EmployeeReport';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('All');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8076/employees')
            .then((response) => {
                setEmployees(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = (
            employee.EmpID.toLowerCase().includes(searchQuery) ||
            employee.FirstName.toLowerCase().includes(searchQuery) ||
            (employee.LastName && employee.LastName.toLowerCase().includes(searchQuery)) ||
            (employee.Age && employee.Age.toString().includes(searchQuery)) ||
            (employee.Gender && employee.Gender.toLowerCase().includes(searchQuery)) ||
            (employee.ContactNo && employee.ContactNo.toLowerCase().includes(searchQuery)) ||
            (employee.Email && employee.Email.toLowerCase().includes(searchQuery))
        );

        const matchesGender = selectedGender === 'All' || employee.Gender === selectedGender;

        return matchesSearch && matchesGender;
    });

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
                            Employees <span className="text-pink-600 dark:text-pink-500">List</span>
                        </h1>
                        <div className="relative inline-block text-left">
                            <button
                                className="p-2 text-gray-600 hover:text-gray-900"
                                onClick={toggleDropdown}
                            >
                                <MdOutlineMoreVert className="text-2xl" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                    <Link
                                        to="/employeeattendence/allEmployeeAttendence"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Employee Attendance
                                    </Link>
                                    <Link
                                        to="/employeeSalary/allEmployeeSalary"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Employee Salary
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Employees"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <select
                            value={selectedGender}
                            onChange={handleGenderChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value='All'>All Genders</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                        <Link
                            to="/employees/create"
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                                Add
                            </span>
                        </Link>
                    </div>
                </div>

                <EmployeeReport filteredEmployees={filteredEmployees} />

                {loading ? (
                    <Spinner />
                ) : (
                    <div className="overflow-x-auto">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="min-w-full border-collapse divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">Employee No</th>
                                            <th className="px-4 py-2 text-left font-semibold">First Name</th>
                                            <th className="px-4 py-2 text-left font-semibold">Last Name</th>
                                            <th className="px-4 py-2 text-left font-semibold">Age</th>
                                            <th className="px-4 py-2 text-left font-semibold">Gender</th>
                                            <th className="px-4 py-2 text-left font-semibold">Contact No</th>
                                            <th className="px-4 py-2 text-left font-semibold">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEmployees.length > 0 ? (
                                            filteredEmployees.map((employee, index) => (
                                                <tr key={employee._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{employee.EmpID}</td>
                                                    <td className="px-4 py-2">{employee.FirstName}</td>
                                                    <td className="px-4 py-2">{employee.LastName}</td>
                                                    <td className="px-4 py-2">{employee.Age}</td>
                                                    <td className="px-4 py-2">{employee.Gender}</td>
                                                    <td className="px-4 py-2">{employee.ContactNo}</td>
                                                    <td className="px-4 py-2">{employee.Email}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex justify-center gap-x-4">
                                                            <Link to={`/employees/details/${employee._id}`} title="View Details">
                                                                <BsInfoCircle className="text-xl text-green-600 hover:text-green-800 transition-colors" />
                                                            </Link>
                                                            <Link to={`/employees/edit/${employee._id}`} title="Edit">
                                                                <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                            </Link>
                                                            <Link to={`/employees/delete/${employee._id}`} title="Delete">
                                                                <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-2 text-center text-gray-500">No employees found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowEmployees;

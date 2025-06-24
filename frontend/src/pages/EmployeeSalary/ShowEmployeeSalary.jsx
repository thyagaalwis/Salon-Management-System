import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { MdOutlineAddBox, MdOutlineDelete, MdOutlineMoreVert } from 'react-icons/md';
import EmployeeSalaryReport from './EmployeeSalaryReport';  // Import the EmployeeSalaryReport component
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowEmployeeSalary = () => {
    const [employeeSalaries, setEmployeeSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8076/employeeSalary')
            .then((response) => {
                setEmployeeSalaries(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const filterByDate = (data, date) => {
            if (!date) return data;
            const [year, month] = date.split('-');
            return data.filter(record => {
                const fromDate = new Date(record.fromDate);
                const toDate = new Date(record.toDate);
                const searchDate = new Date(`${year}-${month}-01`);
                return (
                    fromDate <= searchDate &&
                    toDate >= searchDate
                );
            });
        };

        const filteredByDate = filterByDate(employeeSalaries, searchDate);
        
        if (searchQuery === '') {
            setFilteredSalaries(filteredByDate);
        } else {
            setFilteredSalaries(
                filteredByDate.filter(record =>
                    Object.values(record).some(value =>
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                )
            );
        }
    }, [searchQuery, searchDate, employeeSalaries]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleDateChange = (event) => {
        setSearchDate(event.target.value);
    };

    const toggleDropdown = (event) => {
        event.preventDefault(); // Prevent default behavior
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className='flex justify-between items-center mb-6'>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
                            Employee Salary <span className="text-pink-600 dark:text-pink-500">List</span>
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
                                        to="/employees/allEmployee"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Employees
                                    </Link>
                                    <Link
                                        to="/employeeattendence/allEmployeeAttendence"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Employee Attendence
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <Link to='/employeesalary/create'>
                        <button className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                                Add
                            </span>
                        </button>
                    </Link>
                </div>
                <div className='flex gap-4 mb-4'>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500'
                    />
                    <input
                        type='month'
                        placeholder='Filter by Date'
                        value={searchDate}
                        onChange={handleDateChange}
                        className='border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500'
                    />
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <EmployeeSalaryReport filteredSalaries={filteredSalaries} />
                        <div className="overflow-x-auto">
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="min-w-full border-collapse divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-semibold">EmpID</th>
                                                <th className="px-4 py-2 text-left font-semibold">Employee Name</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">From Date</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">To Date</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Total OT Hours</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Total OT Pay</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Total Worked Hours</th>
                                                <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Total Worked Pay</th>
                                                <th className="px-4 py-2 text-left font-semibold">Total Salary</th>
                                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredSalaries.length > 0 ? (
                                                filteredSalaries.map((salary, index) => (
                                                    <tr key={salary._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="px-4 py-2">{salary.EmpID}</td>
                                                        <td className="px-4 py-2">{salary.employeeName}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.fromDate}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.toDate}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.totalOThours}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.totalOTpay}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.totalWorkedhours}</td>
                                                        <td className="px-4 py-2 hidden md:table-cell">{salary.totalWorkedpay}</td>
                                                        <td className="px-4 py-2">{salary.TotalSalary}</td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex justify-center gap-x-4">
                                                                <Link to={`/employeeSalary/delete/${salary._id}`} title="Delete">
                                                                    <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" className="px-4 py-2 text-center text-gray-500">No salaries found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShowEmployeeSalary;

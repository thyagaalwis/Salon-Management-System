import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import CustomerReport from './CustomerReport';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../Customer/SideBar3';

const ShowAllCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8076/customers')
            .then((response) => {
                console.log('API Response:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    setCustomers(data);
                } else {
                    console.warn('Data is not an array:', data);
                    setCustomers([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
                setCustomers([]);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Filter customers based on search query and selected category
    const filteredCustomers = customers.filter((customer) => {
        const searchMatch = customer.CusID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.Age.toString().includes(searchQuery); // Age search

        // Match gender category (Male/Female)
        const categoryMatch = selectedCategory === '' || customer.Gender === selectedCategory;

        return searchMatch && categoryMatch;
    });

    return (
        <div className='flex flex-col min-h-screen '>
            <Nav />
            <SideBar />

            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Customer <span class="text-pink-600 dark:text-pink-500">List</span> </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Customers"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />

                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 "
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        {/* <button class="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500  group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-100 rounded-md group-hover:bg-opacity-0"  onClick={() => (window.location.href = "/customers/create")}>
                        Add
                    </span>
                    </button> */}
                    </div>
                </div>

                <CustomerReport filteredCustomers={filteredCustomers} />

                {loading ? (
                    <Spinner />
                ) : (
                    <div className="overflow-x-auto">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="min-w-full border-collapse divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">Customer ID</th>
                                            <th className="px-4 py-2 text-left font-semibold">Details</th>
                                            <th className="px-4 py-2 text-left font-semibold">Age</th>
                                            <th className="px-4 py-2 text-left font-semibold">Gender</th>
                                            <th className="px-4 py-2 text-left font-semibold">Contact No</th>
                                            <th className="px-4 py-2 text-left font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((customer, index) => (
                                                <tr key={customer._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{customer.CusID}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center space-x-4">
                                                            <img src={customer.image} alt="Profile Pic" className="w-16 h-16 object-cover rounded-full" />
                                                            <div>
                                                                <div className="text-base font-semibold">{customer.FirstName} {customer.LastName}</div>
                                                                <div className="text-gray-500">{customer.Email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">{customer.Age}</td>
                                                    <td className="px-4 py-2">{customer.Gender}</td>
                                                    <td className="px-4 py-2">{customer.ContactNo}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex justify-center gap-x-4">
                                                            {/* <Link to={`/customers/get/${customer._id}`} title="View Details">
                                                                <BsInfoCircle className="text-xl text-green-600 hover:text-green-800 transition-colors" />
                                                            </Link> */}
                                                            {/* <Link to={`/customers/edit/${customer._id}`} title="Edit">
                                                                <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                            </Link> */}
                                                            <Link to={`/customers/delete/${customer._id}`} title="Delete">
                                                                <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No customers found</td>
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

export default ShowAllCustomers;

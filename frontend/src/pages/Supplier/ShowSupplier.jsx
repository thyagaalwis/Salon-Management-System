import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdEmail } from 'react-icons/md';
import SupplierReport from './SupplierReport';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowSupplier = () => {
    const [suppliers, setSupplier] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSuppliers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8076/suppliers');
                setSupplier(response.data.data);
                setFilteredSuppliers(response.data.data);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredSuppliers(
            suppliers.filter(supplier =>
                Object.values(supplier).some(value => 
                    value && value.toString().toLowerCase().includes(query)
                )
            )
        );
    }, [searchQuery, suppliers]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleEmailClick = (email) => {
        if (!email) {
            alert('Email address not available');
            return;
        }

        const emailSubject = encodeURIComponent('Urgent: Low Item Quantity Alert');
        const emailBody = encodeURIComponent(`Dear Supplier Manager,\n\nWe have identified that the quantity of one or more items is running low. We kindly request that you arrange for new supplies at your earliest convenience.\n\nBest regards,\nYour Company`);
        const mailtoLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
        
        window.location.href = mailtoLink;
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black'>
                        Suppliers <span className='text-pink-600 dark:text-pink-500'>List</span>
                    </h1>
                    <div className='flex items-center gap-4'>
                        <input
                            type='text'
                            placeholder='Search Suppliers'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500'
                        />
                        <button 
                            className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800'
                            onClick={() => (window.location.href = "/suppliers/create")}
                        >
                            <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0'>
                                Add
                            </span>
                        </button>
                    </div>
                </div>

                <SupplierReport filteredSuppliers={filteredSuppliers} />

                {loading ? (
                    <Spinner />
                ) : (
                    <div className='overflow-x-auto'>
                        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                            <div className='max-h-[400px] overflow-y-auto'>
                                <table className='min-w-full border-collapse divide-y divide-gray-200'>
                                    <thead className='bg-gray-100'>
                                        <tr>
                                            <th className='px-4 py-2 text-left font-semibold'>SupplierID</th>
                                            <th className='px-4 py-2 text-left font-semibold'>SupplierName</th>
                                            <th className='px-4 py-2 text-left font-semibold'>ContactNo</th>
                                            <th className='px-4 py-2 text-left font-semibold'>Email</th>
                                            <th className='px-4 py-2 text-left font-semibold'>Items</th>
                                            <th className='px-4 py-2 text-left font-semibold'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {filteredSuppliers.map(supplier => (
                                            <tr key={supplier.SupplierID}>
                                                <td className='px-4 py-2'>{supplier.SupplierID}</td>
                                                <td className='px-4 py-2'>{supplier.SupplierName}</td>
                                                <td className='px-4 py-2'>{supplier.ContactNo}</td>
                                                <td className='px-4 py-2'>{supplier.Email}</td>
                                                <td className='px-4 py-2'>
                                                    {supplier.Items && supplier.Items.length > 0 ? (
                                                        <ul className='list-disc pl-5'>
                                                            {supplier.Items.map(item => (
                                                                <li key={item.ItemNo}>{item.ItemNo} - {item.ItemName}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span>No items selected</span>
                                                    )}
                                                </td>
                                                <td className='px-4 py-2 flex space-x-2'>
                                                    <Link to={`/suppliers/details/${supplier._id}`} title="View Details">
                                                        <BsInfoCircle className='text-xl text-green-600 hover:text-green-800 transition-colors' />
                                                    </Link>
                                                    <Link to={`/suppliers/edit/${supplier._id}`} title="Edit">
                                                        <AiOutlineEdit className='text-xl text-yellow-600 hover:text-yellow-800 transition-colors' />
                                                    </Link>
                                                    <Link to={`/suppliers/delete/${supplier._id}`} title="Delete">
                                                        <MdOutlineDelete className='text-xl text-red-600 hover:text-red-800 transition-colors' />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleEmailClick(supplier.Email)}
                                                        className='text-blue-600'
                                                    >
                                                        <MdEmail className='text-xl' />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
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

export default ShowSupplier;

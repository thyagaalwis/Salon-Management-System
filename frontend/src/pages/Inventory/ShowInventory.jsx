import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from "../../components/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import InventoryReport from './InventoryReport'; // Import the new component
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowInventory = () => {
    const [inventories, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8076/inventories')
            .then((response) => {
                const data = response.data.data;
                setInventory(data);
                setLoading(false);

                data.forEach(item => {
                    if (item.Quantity < 5) {
                        Swal.fire({
                            title: 'Low Inventory!',
                            text: `Item "${item.ItemName}" has a low quantity: ${item.Quantity}`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Email Supplier',
                        }).then((result) => {
                            if (result.isDismissed) {
                                const emailSubject = encodeURIComponent('Low Inventory Alert');
                                const emailBody = encodeURIComponent(`Dear Supplier,\n\nThe inventory item "${item.ItemName}" is running low with only ${item.Quantity} units remaining.\n\nBest regards,\nYour Company`);
                                const emailRecipient = encodeURIComponent(item.SupplierEmail);
                                const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
                                
                                window.location.href = mailtoLink;
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredInventories = inventories.filter((inventory) =>
        (inventory.ItemNo.toLowerCase().includes(searchQuery) ||
        inventory.ItemName.toLowerCase().includes(searchQuery) ||
        inventory.Category.toLowerCase().includes(searchQuery) ||
        inventory.SupplierName.toLowerCase().includes(searchQuery) ||
        inventory.SupplierEmail.toLowerCase().includes(searchQuery)) &&
        (selectedCategory === '' || inventory.Category === selectedCategory)
    );

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Inventory <span className="text-pink-600 dark:text-pink-500">List</span></h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Inventories"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">All Products</option>
                            <option value="Hair">Hair Products</option>
                            <option value="Nails">Nails Products</option>
                            <option value="Makeup">Makeup Products</option>
                        </select>
                        <button className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0" onClick={() => (window.location.href = "/inventories/create")}>
                                Add
                            </span>
                        </button>
                    </div>
                </div>

                {/* Use InventoryReport component */}
                <InventoryReport filteredInventories={filteredInventories} />

                {loading ? (
                    <Spinner />
                ) : (
                    <div className="overflow-x-auto">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="min-w-full border-collapse divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">ItemNo</th>
                                            <th className="px-4 py-2 text-left font-semibold">ItemName</th>
                                            <th className="px-4 py-2 text-left font-semibold max-md:hidden">Category</th>
                                            <th className="px-4 py-2 text-left font-semibold max-md:hidden">Quantity</th>
                                            <th className="px-4 py-2 text-left font-semibold max-md:hidden">Price</th>
                                            <th className="px-4 py-2 text-left font-semibold max-md:hidden">Supplier Name</th>
                                            <th className="px-4 py-2 text-left font-semibold max-md:hidden">Supplier Email</th>
                                            <th className="px-4 py-2 text-left font-semibold">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInventories.length > 0 ? (
                                            filteredInventories.map((inventory, index) => (
                                                <tr key={inventory._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="px-4 py-2">{inventory.ItemNo}</td>
                                                    <td className="px-4 py-2">{inventory.ItemName}</td>
                                                    <td className="px-4 py-2 max-md:hidden">{inventory.Category}</td>
                                                    <td className="px-4 py-2 max-md:hidden">{inventory.Quantity}</td>
                                                    <td className="px-4 py-2 max-md:hidden">{inventory.Price}</td>
                                                    <td className="px-4 py-2 max-md:hidden">{inventory.SupplierName}</td>
                                                    <td className="px-4 py-2 max-md:hidden">{inventory.SupplierEmail}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex justify-center gap-x-4">
                                                            <Link to={`/inventories/details/${inventory._id}`} title="View Details">
                                                                <BsInfoCircle className="text-xl text-green-600 hover:text-green-800 transition-colors" />
                                                            </Link>
                                                            <Link to={`/inventories/edit/${inventory._id}`} title="Edit">
                                                                <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                            </Link>
                                                            <Link to={`/inventories/delete/${inventory._id}`} title="Delete">
                                                                <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-2 text-center text-gray-500">No inventories found</td>
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

export default ShowInventory;

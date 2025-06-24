import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2'; 
import Spinner from "../../components/Spinner";
import StoreReport from './StoreReport';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from './SideBar1';

const ShowStore = () => {
    const [store, setStore] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch store items and orders
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch store items
                const storeResponse = await axios.get('http://localhost:8076/store');
                const storeData = storeResponse.data;

                // Fetch orders
                const ordersResponse = await axios.get('http://localhost:8076/order');
                const ordersData = ordersResponse.data;

                setStore(storeData);
                setOrders(ordersData);

                // Check for low inventory items after setting state
                checkLowInventory(storeData, ordersData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setStore([]);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Check for low inventory items
    const checkLowInventory = (storeData, ordersData) => {
        storeData.forEach(item => {
            const remainingQuantity = calculateRemainingQuantity(item, ordersData);
            if (remainingQuantity < 5) {
                Swal.fire({
                    title: 'Low Inventory!',
                    text: `Item "${item.ItemName}" has a low quantity of ${remainingQuantity}`,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    // Calculate remaining item quantity
    const calculateRemainingQuantity = (storeItem, ordersData) => {
        let soldQuantity = 0;
        ordersData.forEach((order) => {
            order.items.forEach((orderItem) => {
                if (orderItem.ItemNo === storeItem.ItemNo) {
                    soldQuantity += orderItem.quantity;
                }
            });
        });
        return storeItem.Quantity - soldQuantity;
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredStores = Array.isArray(store) ? store.filter((storeItem) => {
        const searchMatch = storeItem.ItemNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            storeItem.ItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            storeItem.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            storeItem.Quantity.toString().includes(searchQuery) ||  
            storeItem.cost.toString().includes(searchQuery) ||  
            storeItem.SPrice.toString().includes(searchQuery);
        return searchMatch;
    }) : [];

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900">
                        Item <span className="text-pink-600">List</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Item"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
                <div className='mb-4'>
                    <StoreReport filteredStores={filteredStores} />
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">Picture</th>
                                <th className="border px-4 py-2 text-left">Item No</th>
                                <th className="border px-4 py-2 text-left">Item Name</th>
                                <th className="border px-4 py-2 text-left">Description</th>
                                <th className="border px-4 py-2 text-left">Remaining Quantity</th>
                                <th className="border px-4 py-2 text-left">Cost</th>
                                <th className="border px-4 py-2 text-left">Selling Price</th>
                                <th className="border px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.length > 0 ? (
                                filteredStores.map((storeItem, index) => (
                                    <tr key={storeItem._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border px-4 py-2">
                                            <img src={storeItem.image} alt="Item" width={'100'} />
                                        </td>
                                        <td className="border px-4 py-2">{storeItem.ItemNo}</td>
                                        <td className="border px-4 py-2">{storeItem.ItemName}</td>
                                        <td className="border px-4 py-2">{storeItem.Description}</td>
                                        <td className="border px-4 py-2">{calculateRemainingQuantity(storeItem, orders)}</td>
                                        <td className="border px-4 py-2">{storeItem.cost}</td>
                                        <td className="border px-4 py-2">{storeItem.SPrice}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex justify-center gap-x-4">
                                                <Link to={`/store/edit/${storeItem._id}`}>
                                                    <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                </Link>
                                                <Link to={`/store/delete/${storeItem._id}`}>
                                                    <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500">No items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ShowStore;

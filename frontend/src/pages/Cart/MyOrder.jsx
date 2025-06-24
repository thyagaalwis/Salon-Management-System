import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

const MyOrder = () => {
    const { CusID } = useParams(); // Get CusID from URL params

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!CusID) {
                    Swal.fire("Error", "No customer ID provided", "error");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8076/order/${CusID}`);
                console.log(response.data); // Log the response data to inspect
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                Swal.fire("Error", "Failed to fetch orders", "error");
                setLoading(false);
            }
        };

        fetchOrders();
    }, [CusID]);

    const handleToggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8076/order/${orderId}`);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            Swal.fire("Success", "Order deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting order:", error);
            Swal.fire("Error", "Failed to delete order", "error");
        }
    };

    const handleDownloadBill = (order) => {
        Swal.fire("Download", "Bill download feature is not implemented yet.", "info");
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen p-8 w-full lg:w-3/4 mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div
                        key={order._id}
                        className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            Order ID: {order._id}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Order Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="text-center flex flex-col items-center"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                    />
                                    <p className="text-gray-700 font-medium mt-2">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-800 font-semibold mt-4">
                            Total Cost: $
                            {order.items
                                .reduce(
                                    (total, item) => total + item.SPrice * item.quantity,
                                    0
                                )
                                .toFixed(2)}
                        </p>

                        {expandedOrders[order._id] && (
                            <div className="mt-4">
                                <div className="flex flex-row items-start justify-between gap-8 border-t pt-4">
                                    <div className="flex-1 pr-4 border-r border-gray-300">
                                        <h3 className="text-lg font-semibold mb-2">Items:</h3>
                                        <ul className="list-disc pl-5 mb-2">
                                            {order.items.map((item) => (
                                                <li key={item.itemId} className="text-gray-700">
                                                    {item.ItemName} - Qty: {item.quantity} - Price: $
                                                    {(item.SPrice * item.quantity).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex-1 px-4 border-r border-gray-300">
                                        <h3 className="text-lg font-semibold mb-2">
                                            Customer Information:
                                        </h3>
                                        <p>Name: {order.customerInfo.FirstName || 'N/A'}</p>
                                        <p>Email: {order.customerInfo.Email || 'N/A'}</p>
                                        <p>Mobile: {order.customerInfo?.ContactNo || 'N/A'}</p>
                                    </div>

                                    <div className="flex-1 pl-4">
                                        {order.deliveryInfo?.address ? (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Delivery Information:
                                                </h3>
                                                <p>Address: {order.deliveryInfo.address}</p>
                                                <p>City: {order.deliveryInfo.city}</p>
                                                <p>Postal Code: {order.deliveryInfo.postalCode}</p>
                                                <p>Delivery Method: Delivery</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Delivery Information:
                                                </h3>
                                                <p>N/A</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-2">
                                    Payment Method: {order.paymentMethod}
                                </p>
                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleDownloadBill(order)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Download Bill
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => handleToggleExpand(order._id)}
                            className="absolute top-4 right-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                            {expandedOrders[order._id] ? "Show Less" : "Show More"}
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center">No orders found</p>
            )}
        </div>
    );
};

export default MyOrder;

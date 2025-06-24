import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:8076/order")
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setOrders([]);
                setLoading(false);
            });
    }, []);

    const handleToggleExpand = (orderId) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    // const handleUpdateOrder = (order) => {
    //     Swal.fire("Update Order", `Order ID: ${order._id} updated.`, "success");
    // };

    const handleDeleteOrder = (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8076/order/${orderId}`)
                    .then(() => {
                        Swal.fire("Deleted!", "The order has been deleted.", "success");
    
                        // Reload the orders from the server after deletion
                        axios
                            .get("http://localhost:8076/order")
                            .then((response) => {
                                const data = response.data;
                                if (Array.isArray(data)) {
                                    setOrders(data); // Update the orders list
                                } else {
                                    setOrders([]); // Reset if no data
                                }
                            })
                            .catch((error) => {
                                console.error("Error fetching data after deletion:", error);
                            });
                    })
                    .catch((error) => {
                        Swal.fire("Error", "There was an error deleting the order.", "error");
                        console.error("Error deleting order:", error);
                    });
            }
        });
    };
    
    const handleDownloadBill = (order) => {
        Swal.fire("Download Bill", `Bill for Order ID: ${order._id} downloaded.`, "success");
    };

    return (
        <div className="min-h-screen p-8 w-full lg:w-3/4 mx-auto">
                    <BackButton destination={`/store`} />

            {/* <BackButton navigate='/store/' /> */}
            <h1 className="text-3xl font-bold mb-6">All Orders</h1>
            {loading ? (
                <Spinner />
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <div
                        key={order.orderId}
                        className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative"
                    >
                        <h2 className="text-xl font-semibold mb-2">Order ID: {order.orderId}</h2>
                        <p className="text-gray-600 mt-2">
                            Order Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {order.items.map((item) => (
                                <div key={item.ItemNo} className="text-center flex flex-col items-center">
                                    <img
                                        src={item.image}
                                        alt={item.ItemName}
                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                    />
                                    <p className="text-gray-700 font-medium mt-2">{item.ItemName}</p>
                                </div>
                            ))}
                        </div>
                        

                        {expandedOrders[order._id] && (
                            <div className="mt-4">
                                <div className="flex flex-row items-start justify-between gap-8 border-t pt-4">
                                    <div className="flex-1 pr-4 border-r border-gray-300">
                                        <h3 className="text-lg font-semibold mb-2">Items:</h3>
                                        <ul className="list-disc pl-5 mb-2">
                                            {order.items.map((item) => (
                                                <li key={item.ItemNo} className="text-gray-700">
                                                   Price: Rs.{(item.SPrice).toFixed(2)}
                                                  
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex-1 px-4 border-r border-gray-300">
                                        <h3 className="text-lg font-semibold mb-2">
                                            Customer Information:
                                        </h3>
                                        <p>Name: {order.customerInfo.FirstName}</p>
                                        <p>Email: {order.customerInfo.Email}</p>
                                        <p>Mobile: {order.customerInfo.ContactNo}</p>
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
                                                    Dine-in Information:
                                                </h3>
                                                <p>Dine-in Method: Dine-In</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-2">
                                    Payment Method: {order.paymentMethod}
                                </p>
                                <div className="flex space-x-2 mt-4">
                                    {/* <button
                                        onClick={() => handleUpdateOrder(order)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                    >
                                        Update
                                    </button> */}
                                    <button
                                        onClick={() => handleDeleteOrder(order.orderId)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                    {/* <button
                                        onClick={() => handleDownloadBill(order)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Download Bill
                                    </button> */}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => handleToggleExpand(order._id)}
                            className="absolute top-4 right-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                            {expandedOrders[order.orderId] ? "Show Less" : "Show More"}
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center">No orders found</p>
            )}
        </div>
    );
};

export default AllOrders;

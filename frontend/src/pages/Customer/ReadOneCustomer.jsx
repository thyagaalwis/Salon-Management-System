import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import tableImage from '../../images/tablebg.jpg';
import backgroundImage from "../../images/logobg.jpg";
import Swal from "sweetalert2";
import { BsInfoCircle } from 'react-icons/bs';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReadOneCustomer = () => {
  const [customers, setCustomer] = useState({});
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { id: CusID } = useParams();

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const customerResponse = await axios.get(`http://localhost:8076/customers/${CusID}`);
        setCustomer(customerResponse.data);

        const ordersResponse = await axios.get(`http://localhost:8076/order/${CusID}`);
        setOrders(ordersResponse.data);

        const appointmentsResponse = await axios.get(`http://localhost:8076/appointments/${CusID}`);
        setAppointments(appointmentsResponse.data);

        const feedbackResponse = await axios.get(`http://localhost:8076/feedback/${CusID}`);
        setFeedbacks(feedbackResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [CusID]);

  const handleToggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:8076/order/${orderId}`);
      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        Swal.fire("Success", "Order deleted successfully", "success");
      } else {
        Swal.fire("Error", "Failed to delete order", "error");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(`http://localhost:8076/appointments/${appointmentId}`);
      if (response.status === 200) {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment._id !== appointmentId)
        );
        Swal.fire("Success", "Appointment deleted successfully", "success");
      } else {
        Swal.fire("Error", "Failed to delete appointment", "error");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Swal.fire("Error", "Failed to delete appointment", "error");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await axios.delete(`http://localhost:8076/feedback/${feedbackId}`);
      if (response.status === 200) {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((feedback) => feedback._id !== feedbackId)
        );
        Swal.fire("Success", "Feedback deleted successfully", "success");
      } else {
        Swal.fire("Error", "Failed to delete feedback", "error");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      Swal.fire("Error", "Failed to delete feedback", "error");
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        <BackButton destination={`/ReadOneHome/${CusID}`} />

        <div className="text-center my-8">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
            Customer <span className="text-pink-600 dark:text-pink-500">Profile</span>
          </h1>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div
            className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${tableImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Customer Details */}
            <div className="flex flex-col md:flex-row items-center p-6">
              <div className="md:w-1/3 w-full flex justify-center md:justify-start">
                <img
                  src={customers.image || 'https://via.placeholder.com/150'}
                  alt="Customer"
                  className="w-48 h-48 object-cover rounded-full border-4 border-black"
                />
              </div>
              <div className="md:w-2/3 w-full text-center md:text-left mt-4 md:mt-0">
                <h2 className="text-2xl font-bold text-gray-800">
                  {customers.FirstName} {customers.LastName}
                </h2>
                <p className="text-gray-800 mt-2">{customers.Email}</p>
                <div className="text-gray-800 mt-4">
                  <p><strong>Username:</strong> {customers.CusID}</p>
                  <p><strong>Age:</strong> {customers.Age}</p>
                  <p><strong>Gender:</strong> {customers.Gender}</p>
                  <p><strong>Contact No:</strong> {customers.ContactNo}</p>
                </div>
              </div>
            </div>

            {/* Appointments Section */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Appointments</h2>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.appoi_ID} className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-2">Appointment ID: {appointment.appoi_ID}</h3>
                    <p className="text-gray-600 font-semibold">Date: {appointment.appoi_date.slice(0, 10)}</p>
                    <p className="text-gray-600 font-semibold">Time: {appointment.appoi_time}</p>
                    <p className="text-gray-600 font-semibold">Stylist: {appointment.stylist}</p>
                    <p className="text-gray-600 font-semibold">Service: {appointment.services}</p>
                    <p className="text-gray-600 font-semibold">Packages: {appointment.packages}</p>

                    <div className="px-4 py-2 text-sm text-gray-700 flex items-center space-x-4 border border-gray-300 rounded-md shadow-md">
                      <Link
                        className="text-green-600 hover:text-green-800 transition duration-150 ease-in-out"
                        to={`/appointments/details/${appointment._id}`}
                        title="View Details"
                      >
                        <BsInfoCircle size={24} />
                      </Link>
                      <Link to={`/cusappointments/edit/${appointment._id}`}>
                        <FaEdit className="text-yellow-500 cursor-pointer hover:text-yellow-700" size={24} title="Edit" />
                      </Link>
                      <Link to="#" onClick={() => handleDeleteAppointment(appointment._id)}>
                        <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" size={24} title="Delete" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No appointments found</p>
              )}
            </div>

            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Orders</h2>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative"
                  >
                    <h3 className="text-lg font-semibold mb-2">Order ID: {order.orderId}</h3>
                    <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="flex space-x-4 mt-4">
                      {order.items.map((item) => (
                        <div key={item.itemId} className="text-center flex flex-col items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                          <p className="text-gray-700 font-medium mt-2">{item.title}</p>
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
                                <li key={item.itemId} className="text-gray-700">
                                  <p>{item.ItemName} </p>
                                  <p>Qty: {item.quantity}</p>
                                  <p>Price: Rs. {(item.SPrice * item.quantity).toFixed(2)}</p>

                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex-1 px-4 border-r border-gray-300">
                            <h3 className="text-lg font-semibold mb-2">Customer Information:</h3>
                            <p>Name: {order.customerInfo.FirstName || 'N/A'}</p>
                            <p>Email: {order.customerInfo.Email || 'N/A'}</p>
                            <p>Mobile: {order.customerInfo?.ContactNo || 'N/A'}</p>
                          </div>

                          <div className="flex-1 pl-4">
                            {order.deliveryInfo?.address ? (
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Delivery Information:</h3>
                                <p>Address: {order.deliveryInfo.address}</p>
                                <p>City: {order.deliveryInfo.city}</p>
                                <p>Postal Code: {order.deliveryInfo.postalCode}</p>
                                <p>Delivery Method: Delivery</p>
                              </div>
                            ) : (
                              <p>No delivery information provided.</p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mt-2">Payment Method: {order.paymentMethod}</p>

                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleDeleteOrder(order.orderId)} // Ensure this matches your order structure
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
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
                <p className="text-center text-gray-600">No orders found</p>
              )}
            </div>


            {/* Feedback Section */}
            <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Feedback</h2>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div key={feedback._id} className="border border-gray-300 p-4 mb-4 rounded-lg shadow-md relative">
                <h3 className="text-lg font-semibold mb-2">Feedback ID: {feedback._id}</h3>
                <p className="text-gray-600">{feedback.message}</p>

                {/* Render Star Ratings */}
                <div className="flex mb-2">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className={`h-5 w-5 ${
                        index < feedback.star_rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute top-4 right-4 space-x-2 flex">
                  <Link to={`/feedback/edit/${feedback._id}`} className="text-yellow-500 hover:text-yellow-700" title="Edit">
                    <FaEdit size={24} />
                  </Link>
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash size={24} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No feedback found</p>
          )}
        </div>
            <button
              className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white"
              onClick={() => { window.location.href = `/editCustomer1/${CusID}` }}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-opacity-0">
                Edit Profile
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadOneCustomer;

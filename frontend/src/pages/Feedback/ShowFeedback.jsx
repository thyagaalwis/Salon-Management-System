import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';  // Import SweetAlert2

const ShowFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        setLoading(true);
        axios
            .get('http://localhost:8076/feedback')  // Replace with your actual API endpoint
            .then((response) => {
                console.log('API Response:', response.data);
                const { data } = response.data;  // Extract data field from the response

                if (Array.isArray(data)) {
                    setFeedbacks(data);
                } else {
                    console.error('API did not return an array, check the response structure');
                    setFeedbacks([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching feedback data:', error);
                setLoading(false);
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredFeedbacks = Array.isArray(feedbacks) ? feedbacks.filter((feedback) =>
        feedback.cusID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.phone_number?.includes(searchQuery) ||
        feedback.employee?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    // PDF Generation function
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Customer Feedback Report', 20, 10);

        const tableColumn = ["Customer ID", "Name", "Phone Number", "Email", "Employee", "Date of Service", "Message", "Rating"];
        const tableRows = [];

        filteredFeedbacks.forEach(feedback => {
            const feedbackData = [
                feedback.cusID || 'N/A',
                feedback.name,
                feedback.phone_number,
                feedback.email,
                feedback.employee,
                new Date(feedback.date_of_service).toLocaleDateString(),
                feedback.message,
                feedback.star_rating
            ];
            tableRows.push(feedbackData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("feedback_report.pdf");
    };

    // Delete feedback
    const handleDelete = (feedbackId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8076/feedback/${feedbackId}`)  // Replace with your actual API endpoint for deletion
                    .then((response) => {
                        console.log('Delete Response:', response.data);
                        Swal.fire(
                            'Deleted!',
                            'The feedback has been deleted.',
                            'success'
                        );
                        fetchFeedbacks();  // Refresh feedback list
                    })
                    .catch((error) => {
                        console.error('Error deleting feedback:', error);
                        Swal.fire(
                            'Error!',
                            'There was an issue deleting the feedback.',
                            'error'
                        );
                    });
            }
        });
    };

    return (
        <div className='flex flex-col min-h-screen '>
            <Nav />
            <SideBar />

            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
                        Feedback <span className="text-pink-600 dark:text-pink-500">List</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Feedback"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />

                        <button
                            onClick={generatePDF}
                            className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                                Generate PDF
                            </span>
                        </button>
                    </div>
                </div>

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
                                            <th className="px-4 py-2 text-left font-semibold">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold">Phone Number</th>
                                            <th className="px-4 py-2 text-left font-semibold">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold">Employee</th>
                                            <th className="px-4 py-2 text-left font-semibold">Date of Service</th>
                                            <th className="px-4 py-2 text-left font-semibold">Message</th>
                                            <th className="px-4 py-2 text-left font-semibold">Rating</th>
                                            <th className="px-4 py-2 text-left font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredFeedbacks.length > 0 ? (
                                            filteredFeedbacks.map((feedback) => (
                                                <tr key={feedback._id}>
                                                    <td className="px-4 py-2">{feedback.cusID || 'N/A'}</td>
                                                    <td className="px-4 py-2">{feedback.name}</td>
                                                    <td className="px-4 py-2">{feedback.phone_number}</td>
                                                    <td className="px-4 py-2">{feedback.email}</td>
                                                    <td className="px-4 py-2">{feedback.employee}</td>
                                                    <td className="px-4 py-2">{new Date(feedback.date_of_service).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2">{feedback.message}</td>
                                                    <td className="px-4 py-2 flex items-center">
                                                        {Array.from({ length: 5 }, (_, index) => (
                                                            index < feedback.star_rating ? (
                                                                <AiFillStar key={index} className="text-yellow-500" />
                                                            ) : (
                                                                <AiOutlineStar key={index} className="text-yellow-500" />
                                                            )
                                                        ))}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex justify-center gap-x-4">
                                                            <Link to={`/feedback/view/${feedback._id}`} title="View Details">
                                                                <BsInfoCircle className="text-xl text-green-600 hover:text-green-800 transition-colors" />
                                                            </Link>
                                                            <Link to={`/feedback/edit/${feedback._id}`} title="Edit">
                                                                <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(feedback._id)}  // Call delete function
                                                                title="Delete"
                                                            >
                                                                <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-4 py-2 text-center text-gray-500">
                                                    No feedback available
                                                </td>
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

export default ShowFeedback;

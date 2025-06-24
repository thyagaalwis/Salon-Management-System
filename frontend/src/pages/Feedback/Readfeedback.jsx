import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from "../../components/Spinner";
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'; // Importing star icons

const Readfeedback = () => {
    const { id } = useParams();  // Get feedback ID from URL params
    const [feedback, setFeedback] = useState(null); // State to store feedback details
    const [loading, setLoading] = useState(false); // State for loading spinner

    useEffect(() => {
        setLoading(true);
        // Fetch feedback data by ID
        axios
            .get(`http://localhost:8076/feedback/${id}`)  // Replace with your actual API endpoint
            .then((response) => {
                console.log('Feedback Data:', response.data);
                setFeedback(response.data);  // Set feedback data
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching feedback:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!feedback) {
        return (
            <div className="flex flex-col min-h-screen">
                <Nav />
                <SideBar />
                <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                    <h1 className="text-center text-2xl font-bold text-gray-500">
                        Feedback not found
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen '>
            <Nav />
            <SideBar />
            
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <h1 className="mb-4 text-3xl font-extrabold text-gray-900">Feedback Details</h1>
                    <div className="space-y-4">
                        <div>
                            <strong>Customer ID: </strong>
                            <span>{feedback.cusID || 'N/A'}</span>
                        </div>
                        <div>
                            <strong>Name: </strong>
                            <span>{feedback.name}</span>
                        </div>
                        <div>
                            <strong>Phone Number: </strong>
                            <span>{feedback.phone_number}</span>
                        </div>
                        <div>
                            <strong>Email: </strong>
                            <span>{feedback.email}</span>
                        </div>
                        <div>
                            <strong>Employee: </strong>
                            <span>{feedback.employee}</span>
                        </div>
                        <div>
                            <strong>Date of Service: </strong>
                            <span>{new Date(feedback.date_of_service).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <strong>Message: </strong>
                            <span>{feedback.message}</span>
                        </div>
                        <div>
                            <strong>Rating: </strong>
                            <span className="flex items-center">
                                {Array.from({ length: 5 }, (_, index) => (
                                    index < feedback.star_rating ? (
                                        <AiFillStar key={index} className="text-yellow-500" />
                                    ) : (
                                        <AiOutlineStar key={index} className="text-yellow-500" />
                                    )
                                ))}
                                {/* <span className="ml-2">{feedback.star_rating} / 5</span> */}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Readfeedback;

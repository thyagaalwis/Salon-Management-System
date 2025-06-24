import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:8076/feedback'); // Replace with your API endpoint
                setFeedbacks(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load feedback. Please try again later.');
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const handleDelete = async (id) => {
        setDeleteError('');
        setSuccess('');

        try {
            await axios.delete(`http://localhost:8076/feedback/${id}`); // Replace with your API endpoint
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id)); // Update UI after deletion
            setSuccess('Feedback deleted successfully!');
        } catch (err) {
            console.error(err);
            setDeleteError('Failed to delete feedback. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading feedback...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">Manage Feedback</h1>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {deleteError && <p className="text-red-600">{deleteError}</p>}
                    {success && <p className="text-green-600">{success}</p>}
                    
                    {feedbacks.length === 0 ? (
                        <p className="text-center text-gray-600">No feedback available yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {feedbacks.map((feedback, index) => (
                                <li
                                    key={index}
                                    className="p-4 border border-gray-300 rounded-lg shadow-sm"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800">{feedback.name}</h2>
                                    <p className="text-sm text-gray-500">{feedback.email}</p>
                                    <p className="mt-2 text-gray-700">{feedback.message}</p>
                                    <p className="mt-2 text-yellow-500">Rating: {feedback.rating}/5</p>
                                    <button
                                        onClick={() => handleDelete(feedback.id)}
                                        className="mt-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500 transition duration-150 ease-in-out"
                                    >
                                        Delete Feedback
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteFeedback;

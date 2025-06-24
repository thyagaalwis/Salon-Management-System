import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../../config/firebase";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png'

const EditStore = () => {
    const [store, setStore] = useState({
        ItemNo: '',
        ItemName: '',
        Quantity: '',
        cost: '',
        SPrice: '',
        Description: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const storage = getStorage(app);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:8076/store/${id}`)
            .then((response) => {
                const data = response.data;
                setStore(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred. Please try again later.',
                });
                console.log(error);
            });
    }, [id]);

    const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Check for errors before proceeding
    let errorMsg = "";

    if (store.SPrice <= 0 || isNaN(store.SPrice)) {
        errorMsg += "Selling Price must be a positive number.\n";
    }

    if (Object.values(errorMsg).some(err => err !== "")) {
        setLoading(false);
        Swal.fire({
            icon: 'error',
            text: 'Selling Price must be a positive number.',
        });
        return;
    }

    try {
        let imageUrl = store.image; // Default to the current image URL
        if (store.image && store.image instanceof File) {
            const storageRef = ref(storage, `store_images/${id}`);
            const uploadTask = uploadBytesResumable(storageRef, store.image);

            await uploadTask;

            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        }

        // Update store data with image URL
        const updatedStore = { ...store, image: imageUrl };
        axios.put(`http://localhost:8076/store/${id}`, updatedStore)
            .then((response) => {
                setLoading(false);
                if (response.status === 200) {
                    navigate(`/store/`);
                } else {
                    console.error('Unexpected response status:', response.status);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Unexpected response status. Please try again later.',
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error updating store:', error);
                console.log('Response data:', error.response?.data);
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred while updating the store. Please try again later.',
                });
            });
    } catch (error) {
        setLoading(false);
        console.error('Error updating store:', error);
        Swal.fire({
            icon: 'error',
            text: 'An error occurred while updating the store. Please try again later.',
        });
    }
};

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setStore(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value,
        }));
    };
    const containerStyle = {
   
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
      };
      return (
        <div style={containerStyle}>
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                    <h1 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                        Edit Items
                    </h1>
                    {loading ? <Spinner /> : ""}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="itemNo" className="block text-sm font-medium leading-5 text-gray-700">Item No</label>
                                <input
                                    id="itemNo"
                                    type="text"
                                    name="ItemNo"
                                    value={store.ItemNo}
                                    onChange={handleChange}
                                    maxLength={10}
                                    required
                                    readOnly
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="itemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
                                <input
                                    id="itemName"
                                    type="text"
                                    name="ItemName"
                                    value={store.ItemName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    name="Description"
                                    value={store.Description}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium leading-5 text-gray-700">Quantity</label>
                                <input
                                    id="quantity"
                                    type="text"
                                    name="Quantity"
                                    value={store.Quantity}
                                    onChange={handleChange}
                                    maxLength={3}
                                    required
                                     readOnly
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="cost" className="block text-sm font-medium leading-5 text-gray-700">Cost</label>
                                <input
                                    id="cost"
                                    type="number"
                                    name="cost"
                                    value={store.cost}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <label htmlFor="sPrice" className="block text-sm font-medium leading-5 text-gray-700">Selling Price</label>
                                <input
                                    id="sPrice"
                                    type="number"
                                    name="SPrice"
                                    value={store.SPrice}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                                >
                                    {loading ? "Loading..." : "Item Updated"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditStore;

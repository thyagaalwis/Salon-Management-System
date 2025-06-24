import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const CreateStore = () => {
  const [ItemNo, setItemNo] = useState('');
  const [ItemName, setItemName] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [SPrice, setSPrice] = useState('');
  const [image, setImage] = useState(null);
  const [Description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storage = getStorage(app);

  const validateFields = () => {
    let valid = true;
    let errorMsg = "";
  
    if (!ItemNo || ItemNo.length > 10) {
      errorMsg += "ItemNo must be a non-empty string with a maximum length of 10.\n";
      valid = false;
    }
    if (!ItemName) {
      errorMsg += "Item Name is required.\n";
      valid = false;
    }
    if (!Description) {
      errorMsg += "Description is required.\n";
      valid = false;
    }
    if (!Quantity || !/^[1-9]\d{0,2}$/.test(Quantity)) {
      errorMsg += "Quantity must be a positive integer greater than zero and with a maximum length of 3.\n";
      valid = false;
    }
    if (!cost || isNaN(cost) || cost <= 0) {
      errorMsg += "Cost must be a positive number.\n";
      valid = false;
    }
    if (!SPrice || isNaN(SPrice) || SPrice <= 0) {
      errorMsg += "Selling Price must be a positive number.\n";
      valid = false;
    }
  
    if (!valid) {
      setError(errorMsg);
    }
  
    return valid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateFields()) return;
  
    const storageRef = ref(storage, `store_images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const data = {
            ItemNo,
            ItemName,
            Quantity: parseInt(Quantity), // Convert to integer
            cost: parseFloat(cost), // Convert to float
            SPrice: parseFloat(SPrice), // Convert to float
            Description,
            image: downloadURL,
          };
  
          axios.post("http://localhost:8076/store", data)
            .then((response) => {
              if (response.status === 201) {
                Swal.fire({
                  title: "Item added successfully!",
                  icon: "success",
                  confirmButtonText: "Go to Stores",
                }).then(() => {
                  navigate("/store");
                });
              }
            })
            .catch((error) => {
              // Check if the error is due to a duplicate key
              if (error.response && error.response.status === 400) {
                // Customize this message based on the backend error response
                Swal.fire({
                  title: "Error!",
                  text: "Duplicate Item No detected. Please use a unique Item No.",
                  icon: "error",
                  confirmButtonText: "Okay",
                });
              } else {
                setError(error.message);
              }
              setLoading(false);
            });
        });
      }
    );
  };
  
  const containerStyle = {
   
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    
  };
  return (
    <div style={containerStyle}>
      <BackButton destination={`/store`} />
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img
            className="mx-auto h-10 w-auto ml-[45%]"
            src={Logo}
            alt="logo"
            style={{ width: '50px', height: '50px', marginRight: '50px' }}
          />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Add Items
          </h2>
          {loading ? <Spinner /> : ""}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
  
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Image</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="itemNo" className="block text-sm font-medium leading-5 text-gray-700">Item No</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="itemNo"
                    type="text"
                    value={ItemNo}
                    onChange={(e) => setItemNo(e.target.value)}
                    maxLength={10}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="itemName"
                    type="text"
                    value={ItemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              <div>
  <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700">Description</label>
  <div className="mt-1 relative rounded-md shadow-sm">
    <textarea
      id="description"
      value={Description}
      onChange={(e) => setDescription(e.target.value)}
      required
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
      rows="4"
    />
  </div>
</div>

  
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium leading-5 text-gray-700">Quantity</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="quantity"
                    type="text"
                    value={Quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    maxLength={3}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="cost" className="block text-sm font-medium leading-5 text-gray-700">Cost</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="cost"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="sPrice" className="block text-sm font-medium leading-5 text-gray-700">Selling Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="sPrice"
                    type="number"
                    value={SPrice}
                    onChange={(e) => setSPrice(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="col-span-2">
                <span className="block w-40 rounded-md shadow-sm">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                  >
                    {loading ? "Loading..." : "Add Item"}
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStore;

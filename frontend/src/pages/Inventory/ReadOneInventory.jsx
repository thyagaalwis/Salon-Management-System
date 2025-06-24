import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import tableImage from '../../images/tablebg.jpg';
import backgroundImage from "../../images/logobg.jpg";

const ShowInventory = () => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newQuantity, setNewQuantity] = useState('');
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8076/inventories/${id}`)
      .then((response) => {
        setInventory(response.data);
        setNewQuantity(response.data.Quantity); // Initialize newQuantity with current quantity
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityUpdate = () => {
    console.log('Updating inventory with ID:', id);
    console.log('New Quantity:', newQuantity);

    // Ensure newQuantity is a valid number
    const quantityToUpdate = parseFloat(newQuantity);
    if (isNaN(quantityToUpdate) || quantityToUpdate < 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    axios
      .patch(`http://localhost:8076/inventories/updateQuantity/${id}`, { quantity: quantityToUpdate })
      .then((response) => {
        console.log('Update successful:', response.data);
        setInventory(response.data); // Update inventory with new quantity
        setShowModal(false); // Close the modal
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
        alert('An error occurred while updating quantity. Please check the console.');
      });
  };

  const incrementQuantity = () => {
    setNewQuantity(prevQuantity => Math.max(parseFloat(prevQuantity) + 1, 0));
  };

  const decrementQuantity = () => {
    setNewQuantity(prevQuantity => Math.max(parseFloat(prevQuantity) - 1, 0));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    try {
      // Ensure the input value is a valid number
      const result = parseFloat(value);
      if (!isNaN(result) && result >= 0) {
        setNewQuantity(result);
      }
    } catch (error) {
      console.error('Invalid input:', error);
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',  // Full viewport width
    height: '100vh',
  };

  const detailsStyle = {
    backgroundImage: `url(${tableImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        <BackButton destination='/inventories/allInventory' />
        <div className="text-center my-8">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
            Inventory <span className="text-pink-600 dark:text-pink-500">Details</span>
          </h1>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden" style={detailsStyle}>
            <div className="p-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{inventory.ItemName}</h2>
                <div className="text-gray-800 mt-4">
                  <p><strong>ItemNo:</strong> {inventory.ItemNo}</p>
                  <p><strong>Category:</strong> {inventory.Category}</p>
                  <p><strong>Quantity:</strong> {inventory.Quantity}</p>
                  <p><strong>Price:</strong> {inventory.Price}</p>
                  <p><strong>SupplierName:</strong> {inventory.SupplierName}</p>
                  <p><strong>SupplierEmail:</strong> {inventory.SupplierEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-6 border-t">
              <button
                onClick={() => setShowModal(true)}
                className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                  Update Quantity
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for updating quantity */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="modal-container bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Update Quantity</h2>
            <div className="flex items-center mb-4">
              <button 
                onClick={decrementQuantity}
                className="border-2 border-gray-500 px-2 py-1 mr-2 bg-gray-200 rounded"
              >
                -
              </button>
              <input
                type="text"
                value={newQuantity}
                onChange={handleInputChange}
                className='border-2 border-gray-500 px-4 py-2 w-full text-center'
                placeholder="Enter new quantity"
              />
              <button 
                onClick={incrementQuantity}
                className="border-2 border-gray-500 px-2 py-1 ml-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleQuantityUpdate} 
              className="px-4 py-2 bg-green-500 text-white rounded mr-2"
            >
              Update
            </button>
            <button 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowInventory;

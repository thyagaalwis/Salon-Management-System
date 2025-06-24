import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

// Functional component for creating inventories
const CreateInventories = () => {
  // State variables for managing form data and loading state
  const [ItemName, setItemName] = useState('');
  const [Category, setCategory] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [Price, setPrice] = useState('');
  const [SupplierName, setSupplierName] = useState('');
  const [SupplierEmail, setSupplierEmail] = useState('');
  const [suppliers, setSuppliers] = useState([]); // State for supplier list
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetching suppliers data from the server
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8076/suppliers')
      .then((response) => {
        const suppliersData = response.data.data; 
        if (Array.isArray(suppliersData)) {
          setSuppliers(suppliersData); // Update state with the suppliers data
        } else {
          console.error('Unexpected response format:', response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching suppliers:', error);
        setLoading(false);
      });
  }, []);

  // Event handler for saving the Inventory
  const handleSaveInventory = () => {
    if (!ItemName || !Category || !Quantity || !Price || !SupplierName || !SupplierEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    const data = {
      ItemName,
      Category,
      Quantity,
      Price,
      SupplierName,
      SupplierEmail,
    };

    setLoading(true);
    axios
      .post('http://localhost:8076/inventories', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Inventory saved successfully.',
        }).then(() => {
          navigate('/inventories/allInventory');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred. Please check the console for details.',
        });
        console.error('Error saving inventory:', error);
      });
  };

  // Event handler for selecting supplier and setting email automatically
  const handleSupplierChange = (e) => {
    const selectedSupplierName = e.target.value;
    setSupplierName(selectedSupplierName);

    const selectedSupplier = suppliers.find(supplier => supplier.SupplierName === selectedSupplierName);
    setSupplierEmail(selectedSupplier ? selectedSupplier.Email : '');
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <BackButton destination='/inventories/allInventory'/>
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Create Inventory
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveInventory(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  value={ItemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-5 text-gray-700">Category</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="category"
                  name="category"
                  value={Category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Hair">Hair</option>
                  <option value="Nails">Nails</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium leading-5 text-gray-700">Quantity</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={Quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium leading-5 text-gray-700">Price</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium leading-5 text-gray-700">Supplier Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="supplierName"
                  name="supplierName"
                  value={SupplierName}
                  onChange={handleSupplierChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.SupplierID} value={supplier.SupplierName}>
                      {supplier.SupplierName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="supplierEmail" className="block text-sm font-medium leading-5 text-gray-700">Supplier Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="supplierEmail"
                  name="supplierEmail"
                  type="text"
                  value={SupplierEmail}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="col-span-2">
              <span className="block w-40 rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:border-pink-700 focus:shadow-outline-blue active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  Save Inventory
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

      {loading && <Spinner />}
    </div>
  );
};

export default CreateInventories;

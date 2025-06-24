import { useState, useEffect } from "react";
import React from 'react';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditSupplier = () => {
  const [SupplierName, setSupplierName] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Address, setAddress] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8076/suppliers/${id}`)
      .then((response) => {
        const data = response.data;
        setSupplierName(data.SupplierName);
        setContactNo(data.ContactNo);
        setEmail(data.Email);
        setAddress(data.Address);
        setSelectedItems(data.Items || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching supplier:", error);
      });

    axios.get("http://localhost:8076/inventories")
      .then((response) => {
        const itemsData = response.data.data;
        setItems(itemsData);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching items:", error);
      });
  }, [id]);

  const handleItemNoChange = (e) => {
    const selectedItemNo = e.target.value;
    const selectedItem = items.find(item => item.ItemNo === selectedItemNo);

    if (selectedItem && !selectedItems.some(item => item.ItemNo === selectedItemNo)) {
      setSelectedItems([...selectedItems, selectedItem]);
    }
  };

  const handleRemoveItem = (itemNo) => {
    setSelectedItems(selectedItems.filter(item => item.ItemNo !== itemNo));
  };

  const handleEditSupplier = () => {
    if (!SupplierName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Supplier Name is required!',
      });
      return;
    }
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'At least one item must be selected!',
      });
      return;
    }
    if (!ContactNo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contact No is required!',
      });
      return;
    }
    if (!/^[0-9]{10}$/.test(ContactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contact No must be a valid 10-digit number!',
      });
      return;
    }
    if (!Email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email is required!',
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(Email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email must be a valid email address!',
      });
      return;
    }
    if (!Address.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Address is required!',
      });
      return;
    }

    const data = {
      SupplierName,
      ContactNo,
      Email,
      Address,
      Items: selectedItems,
    };

    setLoading(true);
    axios.put(`http://localhost:8076/suppliers/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Supplier updated',
          text: 'Supplier details have been successfully updated.',
        }).then(() => {
          navigate('/suppliers/allSupplier');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error updating the supplier. Please try again.',
        });
        console.error('Error editing supplier:', error);
      });
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <BackButton destination='/suppliers/allSupplier' />
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Edit Supplier
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium leading-5 text-gray-700">Supplier Name</label>
              <input
                id="supplierName"
                name="supplierName"
                type="text"
                value={SupplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>

            <div>
              <label htmlFor="itemNo" className="block text-sm font-medium leading-5 text-gray-700">Select Item</label>
              <select
                id="itemNo"
                name="itemNo"
                value=""
                onChange={handleItemNoChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                <option value="" disabled>Select Item</option>
                {items.map((item) => (
                  <option key={item.ItemNo} value={item.ItemNo}>
                    {item.ItemNo} - {item.ItemName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">Selected Items</label>
              <ul className="list-disc pl-5">
                {selectedItems.map((item) => (
                  <li key={item.ItemNo} className="flex justify-between items-center">
                    {item.ItemNo} - {item.ItemName}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.ItemNo)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact No</label>
              <input
                id="contactNo"
                name="contactNo"
                type="text"
                value={ContactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium leading-5 text-gray-700">Address</label>
              <textarea
                id="address"
                name="address"
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>
          </div>

          <div className="mt-6">
            <span className="block w-full rounded-md shadow-sm">
              <button
                type="button"
                onClick={handleEditSupplier}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:border-pink-700 focus:shadow-outline-blue active:bg-pink-700 transition duration-150 ease-in-out"
              >
                {loading ? <Spinner /> : 'Update Supplier'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;

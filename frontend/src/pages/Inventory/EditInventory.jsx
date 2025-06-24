import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditInventory = () => {
  const [ItemNo, setItemNo] = useState('');
  const [ItemName, setItemName] = useState('');
  const [Category, setCategory] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [Price, setPrice] = useState('');
  const [SupplierName, setSupplierName] = useState('');
  const [SupplierEmail, setSupplierEmail] = useState('');
  const [suppliers, setSuppliers] = useState([]); // State for supplier list
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    // Fetch suppliers
    axios.get('http://localhost:8076/suppliers')
      .then((response) => {
        const suppliersData = response.data.data;
        if (Array.isArray(suppliersData)) {
          setSuppliers(suppliersData);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching suppliers:', error);
      });

    // Fetch inventory details
    axios.get(`http://localhost:8076/inventories/${id}`)
      .then((response) => {
        setItemNo(response.data.ItemNo);
        setItemName(response.data.ItemName);
        setCategory(response.data.Category);
        setQuantity(response.data.Quantity);
        setPrice(response.data.Price);
        setSupplierName(response.data.SupplierName);
        setSupplierEmail(response.data.SupplierEmail);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while fetching inventory details.',
        });
        console.error('Error fetching inventory details:', error);
      });
  }, [id]);

  const handleEditInventory = () => {
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
      .put(`http://localhost:8076/inventories/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Inventory updated successfully.',
        }).then(() => {
          navigate('/inventories/allInventory');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while updating the inventory.',
        });
        console.error('Error updating inventory:', error);
      });
  };

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
    <div style={containerStyle}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <BackButton destination='/inventories/allInventory'/>
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Inventory
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {loading && <Spinner />}
            <form onSubmit={(e) => { e.preventDefault(); handleEditInventory(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Item No */}
              <div>
                <label htmlFor="ItemNo" className="block text-sm font-medium leading-5 text-gray-700">Item No</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ItemNo"
                    name="ItemNo"
                    type="text"
                    value={ItemNo}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label htmlFor="ItemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ItemName"
                    name="ItemName"
                    type="text"
                    value={ItemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="Category" className="block text-sm font-medium leading-5 text-gray-700">Category</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Category"
                    name="Category"
                    type="text"
                    value={Category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="Quantity" className="block text-sm font-medium leading-5 text-gray-700">Quantity</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Quantity"
                    name="Quantity"
                    type="number"
                    value={Quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="Price" className="block text-sm font-medium leading-5 text-gray-700">Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Price"
                    name="Price"
                    type="number"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Supplier Name */}
              <div>
                <label htmlFor="SupplierName" className="block text-sm font-medium leading-5 text-gray-700">Supplier Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="SupplierName"
                    name="SupplierName"
                    value={SupplierName}
                    onChange={handleSupplierChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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

              {/* Supplier Email */}
              <div>
                <label htmlFor="SupplierEmail" className="block text-sm font-medium leading-5 text-gray-700">Supplier Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="SupplierEmail"
                    name="SupplierEmail"
                    type="email"
                    value={SupplierEmail}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:border-pink-700 focus:shadow-outline-blue active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  Update Inventory
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInventory;

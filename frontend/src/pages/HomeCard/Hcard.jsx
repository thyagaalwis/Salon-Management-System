import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCartArrowDown } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const HCard = ({ CusID }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8076/store');
        const fetchedData = response.data;

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setData(fetchedData);
        } else {
          console.warn('Data is not an array or is empty:', fetchedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = () => {
    if (remainingQuantity <= 0) {
      Swal.fire({
        title: 'Item Unavailable',
        text: 'This item is currently out of stock.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else {
      console.log(`Item ${item.ItemName} added to cart`);
      // Logic for adding to cart can go here
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  if (data.length === 0) return <p>No data available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item) => (
        <div key={item.ItemNo} className="w-72 shadow-lg rounded-lg bg-neutral-50 p-4 transform transition-transform duration-300 hover:-translate-y-2">
          <Link to={`/itemdis/${item.ItemNo}/${CusID}`} className="flex flex-col items-center">
            <img
              src={item.image}
              alt={item.ItemName}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h2 className="font-semibold text-lg font-title text-pink-500">{item.ItemName}</h2>  
              <p className="mt-2 text-sm text-neutral-700">
                {item.Description.length > 100
                  ? item.Description.slice(0, 100) + '...'
                  : item.Description}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-pink-500">{`RS.${item.SPrice}`}</span>
              
              <button onClick={() => handleItemClick(item)} className="bg-primary rounded-md text-pink-500 py-2 px-4">
                <FaCartArrowDown size={24} />
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HCard;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
//import ItemCard from "./ItemCard";
import Spinner from "../../components/Spinner";
import Hcard from "../HomeCard/Hcard";
import BackButton from "../../components/BackButton";

const Cart = () => {
  const { CusID } = useParams(); // Extract CusID from route parameters
  const [cartItems, setCartItems] = useState([]);
  const [store, setStore] = useState([]);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8076/store')
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setStore(data);
        } else {
          console.warn('Data is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching store data:', error);
      })
      .finally(() => setLoading(false));

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cartData);
    calculateTotal(cartData);
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => acc + item.SPrice * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleIncreaseQuantity = (ItemNo) => {
    const updatedCart = cartItems.map((item) =>
      item.ItemNo === ItemNo ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleDecreaseQuantity = (ItemNo) => {
    const updatedCart = cartItems.map((item) =>
      item.ItemNo === ItemNo && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleApplyPromo = () => {
    if (promoCode === "SAVE10") {
      setDiscount(total * 0.1);
    } else {
      setDiscount(0);
      Swal.fire({
        title: 'Invalid promo code!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCheckout = () => {
    const checkoutData = {
        userId: CusID,
        items: cartItems,
        total: total - discount, // Ensure total is calculated correctly
    };
    navigate(`/checkout/${CusID}`, { state: checkoutData });
};


  const handleRemoveItem = (ItemNo) => {
    const updatedCart = cartItems.filter(item => item.ItemNo !== ItemNo);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const recommendedItems = store.filter(
    (item) => !cartItems.some((cartItem) => cartItem.ItemNo === item.ItemNo)
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <BackButton destination={`/itemdis/${CusID}`} />
    <div className="min-h-screen p-8 flex flex-col items-center">
      
      <div className="w-full lg:w-3/4 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10">
        <div className="w-full lg:w-2/3 space-y-6">
          <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.ItemNo} className="flex items-center justify-between p-4 border-b">
                <img src={item.image} alt={item.ItemName} className="w-16 rounded" />
                <div className="flex-1 px-4">
                  <h3 className="text-xl font-semibold">{item.ItemName}</h3>
                  <p className="text-gray-600">Price:Rs.{item.SPrice}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDecreaseQuantity(item.ItemNo)}
                      className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.ItemNo)}
                      className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    Total: Rs.{(item.SPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.ItemNo)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="w-full lg:w-1/3 p-6 bg-gray-100 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <div className="flex justify-between">
            {/* <span>Subtotal:</span>
            <span>Rs.{total.toFixed(2)}</span> */}
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>Rs.{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Total:</span>
            <span>Rs.{(total).toFixed(2)}</span>
          </div>
          <input
            type="text"
            placeholder="Promo Code"
            className="w-full p-2 border rounded"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            onClick={handleApplyPromo}
            className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300"
          >
            Apply Promo Code
          </button>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      
      <div className="w-full lg:w-2/3 mt-16">
                <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
                <div className="overflow-x-hidden whitespace-nowrap mb-5">
                    <div className="flex space-x-4 animate-marquee">
                        {recommendedItems.length > 0 ? (
                            <div className="flex flex-wrap gap-8 justify-center">
                               {recommendedItems.map((item) => (
    <Hcard
        key={item.ItemNo}
        ItemNo={item.ItemNo}
        image={item.image}
        ItemName={item.ItemName}
        SPrice={item.SPrice}
        CusID={CusID}  // Pass CusID to the Hcard component
    />
))}

                            </div>
                        ) : (
                            <div>No recommended items found</div>
                        )}
                    </div>
                </div>
            </div>
    </div>
    </div>
  );
};

export default Cart;

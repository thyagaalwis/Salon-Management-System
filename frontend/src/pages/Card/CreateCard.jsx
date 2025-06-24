import React, { useState, useEffect } from "react";
import visa from '../../images/visa.png';
import chip from '../../images/chip.webp'; 
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateCard = () => {
  const [Cardno, setCardno] = useState("");
  const [expMonth, setExpMonth] = useState("mm");
  const [expYear, setExpYear] = useState("yy");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState(""); 
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { CusID } = useParams(); 

  // Fetch customer data based on CusID
  useEffect(() => {
    if (CusID) {
      fetchData();
    }
  }, [CusID]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8076/customers/${CusID}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fix the amount to 1000
  const Amount = 1000;

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for submission
    const data = {
      Amount,
      Cardno,
      expMonth,
      expYear,
      cvv,
      cardHolderName,
    };

    setLoading(true);

      // Make the API call to create payment
      axios.post('http://localhost:8076/card', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: "Success!",
          text: 'Payment is Successful',
        }).then(() => {

      // Redirect to appointment page
      navigate(`/customers/get/${CusID}`);
    });
  })
      .catch((error) => {
        setLoading(false);
        console.error("Error creating payment:", error);
        Swal.fire({
          icon: 'error',
          text: `Something went wrong! Error: ${error.response?.data || error.message}`,
        });
      });
  };

  // Allow only numbers for card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Replace non-numeric characters
    setCardno(value);
  };

  // Allow only letters for card holder name input
  const handleCardHolderNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Replace non-letter characters
    setCardHolderName(value);
  };

  // Allow only numbers for CVV input
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Replace non-numeric characters
    setCvv(value);
  };

  const handleCvvFocus = () => {
    setIsCardFlipped(true);
  };

  const handleCvvBlur = () => {
    setIsCardFlipped(false);
  };

  return (
    <div className="container">
      <style>{`
        * {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          outline: none;
          border: none;
          text-decoration: none;
          text-transform: uppercase;
        }

        .container {
          min-height: 100vh;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: column;
          padding-bottom: 60px;
        }

        .container form {
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 600px;
          padding-top: 160px;
        }

        .container form .inputBox {
          margin-top: 20px;
        }

        .container form .inputBox span {
          display: block;
          color: #999;
          padding-bottom: 5px;
        }

        .container form .inputBox input,
        .container form .inputBox select {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          color: #444;
        }

        .container form .flexbox {
          display: flex;
          gap: 15px;
        }

        .container form .flexbox .inputBox {
          flex: 1 1 150px;
        }

       .container form .submit-btn {
  width: 100%;
  background: linear-gradient(45deg, #ff66b2, #ffb6c1); /* Dark pink to light pink gradient */
  margin-top: 20px;
  padding: 10px;
  font-size: 20px;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s linear;
}

.container form .submit-btn:hover {
  letter-spacing: 2px;
  opacity: 0.8;
}


        .container .card-container {
          margin-bottom: -150px;
          position: relative;
          height: 250px;
          width: 400px;
          perspective: 1000px; /* Add perspective */
        }

        .container .card-container .front,
        .container .card-container .back {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          border-radius: 5px;
          backface-visibility: hidden;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.4s ease-out;
        }

       .container .card-container .front {
  background: linear-gradient(45deg, #ff66b2, #ffb6c1); /* Dark pink to light pink gradient */
  padding: 20px;
  transform: ${isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
}

.container .card-container .back {
  background: linear-gradient(45deg, #ff66b2, #ffb6c1); /* Dark pink to light pink gradient */
  padding: 20px;
  text-align: right;
  transform: ${isCardFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'};
}


        .container .card-container .front .image,
        .container .card-container .back .box {
          padding: 20px;
        }

        .container .card-container .front .image {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
        }

        .container .card-container .front .image img {
          height: 50px;
        }

        .container .card-container .front .card-number-box {
          padding: 30px 0;
          font-size: 22px;
          color: #fff;
        }

        .container .card-container .front .flexbox {
          display: flex;
          justify-content: space-between;
        }

        .container .card-container .front .flexbox .box {
          font-size: 15px;
          color: #fff;
        }

        .container .card-container .back .stripe {
          background: #000;
          width: 100%;
          margin: 10px 0;
          height: 50px;
        }

        .container .card-container .back .box span {
          color: #fff;
          font-size: 15px;
        }

        .container .card-container .back .box .cvv-box {
          height: 50px;
          padding: 10px;
          margin-top: 5px;
          color: #333;
          background: #fff;
          border-radius: 5px;
          width: 100%;
        }

        .container .card-container .back .box img {
          margin-top: 30px;
          height: 30px;
        }
      `}</style>

<div className="card-container">
        <div className="front">
          <div className="image">
            <img src={chip} alt="chip" className="chip" style={{ width: '50px', marginLeft: '5px' }} />
            <img src={visa} alt="visa" className="visa" style={{ width: '50px', marginLeft: '5px' }} />
          </div>
          <div className="card-number-box">
            {Cardno || "################"}
          </div>
          <div className="flexbox">
            <div className="box">
              <span>{cardHolderName || "Card Holder"}</span>
            </div>
            <div className="box">
              <span>expires</span>
              <div className="expiration">
                <span className="exp-month">{expMonth}</span>/
                <span className="exp-year">{expYear}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="back">
          <div className="stripe"></div>
          <div className="box">
            <span>cvv</span>
            <div className="cvv-box">{cvv}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
      <label className="block text-sm font-bold leading-5 text-red-500">This payment include your appointment service charge : $10</label>

        <div className="inputBox">
          <span>card number</span>
          <input
            type="text"
            maxLength="16"
            value={Cardno}
            onChange={handleCardNumberChange}
            className="card-number-input"
            placeholder="Card Number"
          />
        </div>
        <div className="inputBox">
          <span>card holder name</span>
          <input
            type="text"
            value={cardHolderName}
            onChange={handleCardHolderNameChange}
            className="card-holder-input"
            placeholder="Card Holder Name"
          />
        </div>
        <div className="flexbox">
          <div className="inputBox">
            <span>expiration mm</span>
            <select
              className="month-input"
              value={expMonth}
              onChange={(e) => setExpMonth(e.target.value)}
            >
              <option value="mm" disabled>
                month
              </option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="inputBox">
            <span>expiration yy</span>
            <select
              className="year-input"
              value={expYear}
              onChange={(e) => setExpYear(e.target.value)}
            >
              <option value="yy" disabled>
                year
              </option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={String(2024 + i).slice(2)}>
                  {String(2025 + i).slice(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="inputBox">
            <span>cvv</span>
            <input
              type="text"
              maxLength="4"
              value={cvv}
              onChange={handleCvvChange}
              onFocus={handleCvvFocus}
              onBlur={handleCvvBlur}
              className="cvv-input"
              placeholder="CVV"
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateCard;
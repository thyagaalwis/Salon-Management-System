import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import  backgroundImage from '../images/logobg.jpg'
import { Link } from 'react-router-dom'; 

function CLogin() {
  const [CusID, setCusID] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    const credentials = {
      CusID,
      Password,
    };

    const rolePaths = {
      Appointment: "/appointments/allAppointment",
      Customer: "/customers",
      Employee: "/employees/allEmployee",
      Inventory: "/inventories/allInventory",
      Package: "/pkg/allPkg",
      Service: "/services/allService",
      Supplier: "/suppliers/allSupplier",
      Feedback: "/Feedback/allFeedback",
      Store: "/store",
    };

    if (rolePaths[CusID] && Password === `${CusID}123`) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate(rolePaths[CusID]);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8076/customers/cLogin",
        credentials
      );
      const userData = response.data;

      if (userData) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Welcome back, ${userData.FirstName}!`,
          showConfirmButton: false,
          timer: 2000,
        });
        navigate(`/ReadOneHome/${CusID}`);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid credentials",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login failed",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
      });
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    
  };

  const screenStyle = {
    background: 'linear-gradient(90deg, #ff91af, #efbbcc)',
    position: 'relative',
    height: '550px',
    width: '340px',
    boxShadow: '0px 0px 24px #5C5696',
  };

  const screenContentStyle = {
    zIndex: 1,
    position: 'relative',
    height: '100%',
  };

  const screenBackgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    clipPath: 'inset(0 0 0 0)',
  };

  const shapeStyle = {
    transform: 'rotate(45deg)',
    position: 'absolute',
  };

  const shape1Style = {
    height: '520px',
    width: '520px',
    background: '#FFF',
    top: '-50px',
    right: '120px',
    borderRadius: '0 72px 0 0',
  };

  const shape2Style = {
    height: '220px',
    width: '220px',
    background: '#db7093',
    top: '-172px',
    right: 0,
    borderRadius: '32px',
  };

  const shape3Style = {
    height: '540px',
    width: '190px',
    background: 'linear-gradient(270deg, #ff69b4, #ff1493 )',
    top: '-24px',
    right: 0,
    borderRadius: '32px',
  };

  const shape4Style = {
    height: '400px',
    width: '200px',
    background: '#cc3366',
    top: '420px',
    right: '50px',
    borderRadius: '60px',
  };

  const loginStyle = {
    width: '320px',
    padding: '30px',
    paddingTop: '156px',
  };



  const Style = {
    margin:'10px',
    
    
  };

  const loginSubmitStyle = {
    background: '#fff',
    fontSize: '14px',
    marginTop: '30px',
    padding: '16px 20px',
    borderRadius: '26px',
    border: '2px solid #cc3366',
    textTransform: 'uppercase',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: '#000',
    boxShadow: '0px 2px 2px #cc3366',
    cursor: 'pointer',
    transition: '.2s',
  };

  const buttonIconStyle = {
    fontSize: '24px',
    marginLeft: 'auto',
    color: '#cc3366',
  };


  return (
    
    <div style={containerStyle } >
        
      <div style={screenStyle}>
        
        <div style={screenContentStyle}>
          <form onSubmit={onLogin} style={loginStyle} >
          <div style={Style}>
          <h2 className="mb-5 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Login
        </h2>
            <input type="text" autocomplete="off" name="text" placeholder="Username" 
            value={CusID} 
            onChange={(e) => setCusID(e.target.value)}
            className="border-none outline-none rounded-2xl p-4 bg-gray-100 shadow-inner transition-transform duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff] h-12 " />
           </div>
           <div style={Style}>
            <input type="password" autocomplete="off" name="text" placeholder="Password" 
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-none outline-none rounded-2xl p-4 bg-gray-100 shadow-inner transition-transform duration-300 ease-in-out focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff] h-12" />
          </div>
            <button type="submit" style={loginSubmitStyle}>
              <span>Log In Now </span>
              <i className="button__icon fas fa-chevron-right" style={buttonIconStyle}><FaArrowAltCircleRight /></i>
            </button>
            <Link to="/customers/create" style={{ textDecoration: 'none' }}>
      <button type="submit" style={loginSubmitStyle}>
        <span>Sign Up</span>
        <i className="button__icon fas fa-chevron-right" style={buttonIconStyle}>
          <FaArrowAltCircleRight />
        </i>
      </button>
    </Link>
          </form>
         
        </div>
        <div style={screenBackgroundStyle}>
          <span style={{ ...shapeStyle, ...shape1Style }}></span>
          <span style={{ ...shapeStyle, ...shape2Style }}></span>
          <span style={{ ...shapeStyle, ...shape3Style }}></span>
          <span style={{ ...shapeStyle, ...shape4Style }}></span>
        </div>
      </div>
    </div>
  );
}

export default CLogin;

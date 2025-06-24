import { useState, useEffect } from "react";
import React from "react";
import Swal from 'sweetalert2';
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditAppointment = () => {
  const { id } = useParams();
  const [client_name, setName] = useState("");
  const [client_email, setEmail] = useState("");
  const [client_phone, setPhone] = useState("");
  const [stylist, setStylist] = useState("");
  const [services, setServices] = useState("");
  const [packages, setPackages] = useState("");
  const [customize_package, setPackage] = useState("");
  const [appoi_date, setDate] = useState(null);
  const [appoi_time, setTime] = useState(null);
  const [CusID, setCusID] = useState("");
  const [serviceOp, setServiceOp] = useState([]);
  const [packageOp, setPackageOp] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const stylists = ["Stylist 1", "Stylist 2", "Stylist 3"];  
  const timeIntervals = [
    "08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM",
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
    "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
    "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
    "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
    "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
    "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM",
    "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM",
    "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8076/appointments/${id}`)
      .then((res) => {
        const appointment = res.data;
        setName(appointment.client_name);
        setEmail(appointment.client_email);
        setPhone(appointment.client_phone);
        setStylist(appointment.stylist);
        setServices(appointment.services);
        setPackages(appointment.packages);
        setDate(new Date(appointment.appoi_date));
        setTime(appointment.appoi_time);
        setPackage(appointment.customize_package);
        setCusID(appointment.CusID);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error fetching the appointment data.");
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    const fetchServicesAndPackages = async () => {
      try {
        const servicesResponse = await axios.get("http://localhost:8076/services");
        const packagesResponse = await axios.get("http://localhost:8076/pkg");

        setServiceOp(servicesResponse.data);
        setPackageOp(packagesResponse.data);
      } catch (error) {
        console.error("Error fetching services and packages:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };

    fetchServicesAndPackages();
  }, []);

  const handleEditAppointment = () => {
    const data = {
      client_name,
      client_email,
      client_phone,
      stylist,
      services,
      packages,
      customize_package,
      appoi_date: appoi_date ? appoi_date.toISOString().split("T")[0] : "",
      appoi_time,
      CusID,
    };
    setLoading(true);

    axios
      .put(`http://localhost:8076/appointments/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Appointment has been edited successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
        navigate(`/customers/get/${CusID}`);
      },2000);
    })
      .catch((error) => {
        setLoading(false);
        alert("An error occurred. Please check console");
        console.log(error);
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
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Edit Service</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? <Spinner /> : null}
          <form className="space-y-4">
          <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">Customer ID:</label>
              <input
                type="text"
                id="client_name"
                value={CusID}
                readOnly
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">Name with Initials:</label>
              <input
                type="text"
                id="client_name"
                value={client_name}
                readOnly
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="client_email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="client_email"
                value={client_email}
                readOnly
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input
                type="tel"
                id="client_phone"
                value={client_phone}
                readOnly
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="stylist" className="block text-sm font-medium text-gray-700">Preferred Stylist:</label>
              <select
                id="stylist"
                value={stylist}
                onChange={(e) => setStylist(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select Stylist</option>
                {stylists.map((stylist) => (
                  <option key={stylist} value={stylist}>{stylist}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="services" className="block text-sm font-medium text-gray-700">Choose Service(s):</label>
              <select
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select Service</option>
                {serviceOp.map((ser) => (
                  <option key={ser._id} value={ser.service_ID}>
                  {ser.category} - {ser.subCategory}
                </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="packages" className="block text-sm font-medium text-gray-700">Customize Package (Optional):</label>
              <select
                type="text"
                id="packages"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select Package</option>
                {packageOp.map((pkg) => (
                  <option key={pkg._id} value={pkg.ID}>
                    {pkg.p_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="appoi_date" className="block text-sm font-medium text-gray-700">Appointment Date:</label>
              <DatePicker
                selected={appoi_date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="appoi_time" className="block text-sm font-medium text-gray-700">Appointment Time:</label>
              <select
                id="appoi_time"
                value={appoi_time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select Time</option>
                {timeIntervals.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
             <span className="block w-40 rounded-md shadow-sm"> 
              <button
                type="button"
                onClick={handleEditAppointment}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
              >
                Update Appointment
              </button>
            </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;

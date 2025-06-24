import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import backgroundImage from "../../images/logobg.jpg";
import tableImage from '../../images/tablebg.jpg';
import Spinner from '../../components/Spinner'; // Assuming you have a Spinner component

const DetailsAppointment = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8076/appointments/${id}`)
      .then((response) => {
        setAppointment(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError('Failed to fetch appointment details');
        setLoading(false);
      });
  }, [id]);


  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    padding: '1rem'
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${tableImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '1.5rem'
          }}
        >
          <h1 className="text-4xl font-bold text-center my-6 text-gray-800">
            Appointment Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Appointment ID</h2>
              <p className="text-lg">{appointment.appoi_ID}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Customer ID</h2>
              <p className="text-lg">{appointment.CusID}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Name with initials</h2>
              <p className="text-lg">{appointment.client_name}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">E-mail</h2>
              <p className="text-lg">{appointment.client_email}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Contact Number</h2>
              <p className="text-lg">{appointment.client_phone}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Preferred Stylist</h2>
              <p className="text-lg">{appointment.stylist}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Service Category</h2>
              <p className="text-lg">{appointment.services}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Package Type</h2>
              <p className="text-lg">{appointment.packages}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Customized Package Details</h2>
              <p className="text-lg">{appointment.customize_package}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Appointment Date</h2>
              <p className="text-lg">{appointment.appoi_date}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Appointment Time</h2>
              <p className="text-lg">{appointment.appoi_time}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
           
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsAppointment;

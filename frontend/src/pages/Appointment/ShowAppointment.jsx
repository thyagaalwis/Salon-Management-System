import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaEnvelope } from "react-icons/fa"; 
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import "jspdf-autotable";
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [noDataMessage, setNoDataMessage] = useState('');

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8076/searchappointment?search=${searchQuery}`);
      console.log("Search response:", response);
      if (response.data.length === 0) {
        console.log("No matching appointments found.");
        setNoDataMessage('No matching appointments found.');
      } else {
        console.log("Matching appointments found:", response.data);
        setNoDataMessage('');
        setAppointments(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setLoading(false);
    }
  };

    // Apply search filter
    const applySearchFilter = (appointments) => {
  
      const appoi_ID = appointments.appoi_ID ? appointments.appoi_ID.toLowerCase() : '';
      const client_name = appointments.client_name ? appointments.client_name.toLowerCase() : '';
      const client_email = appointments.client_email ? appointments.client_email.toLowerCase() : '';
      const client_phone = appointments.client_phone ? appointments.client_phone.toString() : '';
      const stylist = appointments.stylist ? appointments.stylist.toLowerCase() : ''; 
      const services = appointments.services ? appointments.services.toLowerCase() : '';
      const appoi_date = appointments.appoi_date ? appointments.appoi_date.toLowerCase() : '';
      const appoi_time = appointments.appoi_time ? appointments.appoi_time.toLowerCase() : '';
      const packages = appointments.packages ? appointments.packages.toLowerCase() : '';
      const CusID = appointments.CusID ? appointments.CusID.toLowerCase() : '';

      return (
        appoi_ID.includes(searchQuery.toLowerCase()) ||
        client_name.includes(searchQuery.toLowerCase()) ||
        client_email.includes(searchQuery.toLowerCase()) ||
        client_phone.includes(searchQuery.toLowerCase()) ||
        stylist.includes(searchQuery.toLowerCase()) ||
        appoi_date.includes(searchQuery.toLowerCase()) ||
        appoi_time.includes(searchQuery.toLowerCase()) ||
        services.includes(searchQuery.toLowerCase()) ||
        packages.includes(searchQuery.toLowerCase()) ||
        CusID.includes(searchQuery.toLowerCase())
      );
    };

     
    const filteredAppoointments = appointments.filter(applySearchFilter);  


  // Fetch appointments from the backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8076/appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })  
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

// Function to generate PDF
const generatePDF = () => {
  const doc = new jsPDF();

  const tableColumn = [
    "CusID",
    "Appointment ID",
    "Name",
    "Email",
    "Phone",
    "Stylist",
    "Service",
    "Package",
  ];
  const tableRows = [];

  filteredAppoointments.forEach((appointment) => {
    const appointmentData = [
      appointment.CusID,
      appointment.appoi_ID,
      appointment.client_name,
      appointment.client_email,
      appointment.client_phone,
      appointment.stylist,
      appointment.services,
      appointment.customize_package || "N/A",
    ];
    tableRows.push(appointmentData);

    // Show Date and Time as points above the table (per appointment)
    doc.setFontSize(10).setTextColor("#333");
  });

  const date = new Date().toLocaleDateString();

  // PDF Header
  doc.setFontSize(24).setFont("helvetica", "bold").setTextColor("#4B9CD3");
  doc.text("Saloon Management", 105, 15, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(18).setTextColor("#333");
  doc.text("Appointment Details Report", 105, 25, { align: "center" });

  doc.setFont("helvetica", "italic").setFontSize(12).setTextColor("#666");
  doc.text(`Report Generated Date: ${date}`, 105, 35, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor("#999");
  doc.text("Saloon, Pannipitiya", 105, 45, { align: "center" });

  doc.setDrawColor(0, 0, 0).setLineWidth(0.5);
  doc.line(10, 49, 200, 49);

  // PDF Table without Date and Time columns
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 70, // Adjust startY to make space for Date and Time text above
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center", // Center-align header text
    },
    bodyStyles: {
      halign: "center", // Center-align body text
    },
    alternateRowStyles: {
      fillColor: [230, 230, 230],
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Appointment ID
      1: { cellWidth: 30 }, // Name
      2: { cellWidth: 35 }, // Email
      3: { cellWidth: 25 }, // Phone
      4: { cellWidth: 20 }, // Stylist
      5: { cellWidth: 20 }, // Service
      6: { cellWidth: 20 },
      7: { cellWidth: 20 },
    },
  });

  // Save the generated PDF
  doc.save(`Appointment-Details-Report_${date}.pdf`);
};




  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col min-h-screen '>
            <Nav />
            <SideBar />

    <div className="flex-grow p-6 ml-[18%] mt-[4%]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Appointments <span className="text-pink-600 dark:text-pink-500">List</span></h1>
          <div className="flex items-center gap-4">

          <input
              type="text"
              placeholder="Search here.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          <button
              onClick={handleSearch}
              className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500  group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
              Search
              </span>
            </button>
            <button 
              onClick={generatePDF} 
              className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500  group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
              Generate PDF
              </span>
            </button>
            </div>
        </div>

  {noDataMessage && (
        <p className="text-red-500 text-center">{noDataMessage}</p>
      )} 
  <div className="overflow-x-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full border-collapse divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
          <th className="px-4 py-2 text-left font-semibold">Customer ID</th>
            <th className="px-4 py-2 text-left font-semibold">Appointment ID</th>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Email</th>
            <th className="px-4 py-2 text-left font-semibold">Phone</th>
            <th className="px-4 py-2 text-left font-semibold">Stylist</th>
            <th className="px-4 py-2 text-left font-semibold">Service</th>
            <th className="px-4 py-2 text-left font-semibold">Package</th>
            <th className="px-4 py-2 text-left font-semibold">Date</th>
            <th className="px-4 py-2 text-left font-semibold">Time</th>
            <th className="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAppoointments.map((appointment) => (
            <tr key={appointment.appoi_ID} className="hover:bg-gray-100 transition duration-150 ease-in-out">
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.CusID}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.appoi_ID}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.client_name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.client_email}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.client_phone}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.stylist}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.services}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.packages}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.appoi_date.slice(0, 10)}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{appointment.appoi_time}</td>
              <td className="px-4 py-2 text-sm text-gray-700 flex items-center space-x-4">
                <Link
                  to={`/appointments/details/${appointment._id}`}
                  className="text-green-600 hover:text-green-800 transition duration-150 ease-in-out"
                  title="View Appointment"
                >
                  <BsInfoCircle size={20} /> 
                </Link>
                
                <Link
                  to={`/appointments/delete/${appointment._id}`}
                  className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                  title="Delete Appointment" 
                >
                  <FaTrash size={20} />
                </Link>
                <Link to={`/appointments/edit/${appointment._id}`} title="Edit">
                  <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                  </Link>

                {/* "Send Email" Button */}
                <a
                          href={`mailto:${appointment.client_email}?subject=Your%20Appointment%20Details&body=Dear%20${appointment.client_name},%0D%0A%0D%0AYour%20appointment%20with%20us%20is%20scheduled%20on%20${appointment.appoi_date.slice(0, 10)}%20at%20${appointment.appoi_time}.%0D%0AStylist:%20${appointment.stylist}%0D%0AService:%20${appointment.services}%0D%0AThank%20you!`}
                          className="text-yellow-600 hover:text-yellow-800 transition duration-150 ease-in-out"
                          title="Send Email"
                        >
                          <FaEnvelope size={20} />
                        </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
    </div>
  </div>
  );
};

export default ShowAppointment;

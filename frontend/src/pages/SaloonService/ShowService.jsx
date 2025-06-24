import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BsInfoCircle } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from '../../components/Dashborad/Sidebar';

const ShowService = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [noDataMessage, setNoDataMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8076/searchservice?search=${searchQuery}`);
      console.log("Search response:", response);
      if (response.data.length === 0) {
        console.log("No matching services found.");
        setNoDataMessage('No matching services found.');
      } else {
        console.log("Matching services found:", response.data);
        setNoDataMessage('');
        setServices(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setLoading(false);
    }
  };

  // Apply search filter
  const applySearchFilter = (service) => {
    const service_ID = service.service_ID ? service.service_ID.toLowerCase() : '';
    const category = service.category ? service.category.toLowerCase() : '';
    const duration = service.duration ? service.duration.toLowerCase() : ''; 
    const price = service.price ? service.price.toString() : ''; 
    const available = service.available ? service.available.toLowerCase() : '';
    const subCategory = service.subCategory ? service.subCategory.toLowerCase() : '';

    return (
      service_ID.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase()) ||
      duration.includes(searchQuery.toLowerCase()) ||
      price.includes(searchQuery.toLowerCase()) ||
      available.includes(searchQuery.toLowerCase()) || 
      subCategory.includes(searchQuery.toLowerCase())
    );
  };

  // Filter services based on search query
  const filteredServices = services.filter(applySearchFilter);

  // Function to handle the icon click for adding new service
  const handleAddClick = () => {
    navigate('/services/create');
  };

  // Fetch services data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8076/services');
        setServices(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load services. Please try again later.');
      }
    };

    fetchServices();
  }, []);

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Service ID", "Category", "Service Type", "Description", "Duration (min)", "Price (Rs)", "Available"];
    const tableRows = [];

    services.forEach(service => {
      const serviceData = [
        service.service_ID,
        service.category,
        service.subCategory,
        service.description,
        service.duration,
        service.price,
        service.available ? 'Yes' : 'No'
      ];
      tableRows.push(serviceData);
    });

    const date = new Date().toLocaleDateString();

    // PDF Header
    doc.setFontSize(24).setFont("helvetica", "bold").setTextColor("#4B9CD3");
    doc.text("Saloon Management", 105, 15, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(18).setTextColor("#333");
    doc.text("Service Details Report", 105, 25, { align: "center" });

    doc.setFont("helvetica", "italic").setFontSize(12).setTextColor("#666");
    doc.text(`Report Generated Date: ${date}`, 105, 35, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor("#999");
    doc.text("Saloon, Gampaha", 105, 45, { align: "center" });

    doc.setDrawColor(0, 0, 0).setLineWidth(0.5);
    doc.line(10, 49, 200, 49);

    // PDF Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: 'center', // Center-align header text
      },
      bodyStyles: {
        halign: 'center', // Center-align body text
      },
      columnStyles: {
        0: { cellWidth: 20 }, 
        1: { cellWidth: 30 }, 
        2: { cellWidth: 30 }, 
        3: { cellWidth: 30 }, 
        4: { cellWidth: 30 },
        5: { cellWidth: 30 }, 
        6: { cellWidth: 30 }, 
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230]
      },
      margin: { top: 60 }
    });

    // Save PDF
    doc.save(`Service-Details-Report_${date}.pdf`);
  };

  return (
    <div className='flex flex-col min-h-screen '>
            <Nav />
            <SideBar />

      <div className="flex-grow p-6 ml-[18%] mt-[4%]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Service <span className="text-pink-600 dark:text-pink-500">List</span></h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search Services"
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
            <button 
              onClick={handleAddClick} 
              className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-900 to-pink-500  group-hover:to-pink-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0">
                Add
              </span>
            </button>
          </div>
        </div>

        {noDataMessage && (
          <p className="text-red-500 text-center">{noDataMessage}</p>
        )}

        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full border-collapse divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Service ID</th>
                <th className="px-4 py-2 text-left font-semibold">Category</th>
                <th className="px-4 py-2 text-left font-semibold">Service Type</th>
                <th className="px-4 py-2 text-left font-semibold">Description</th>
                <th className="px-4 py-2 text-left font-semibold">Duration</th>
                <th className="px-4 py-2 text-left font-semibold">Price (Rs)</th>
                <th className="px-4 py-2 text-left font-semibold">Available</th>
                <th className="px-4 py-2 text-left font-semibold">Image</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-2 text-gray-700">{service.service_ID}</td>
                  <td className="px-4 py-2 text-gray-700">{service.category}</td>
                  <td className="px-4 py-2 text-gray-700">{service.subCategory}</td>
                  <td className="px-4 py-2 text-gray-700">{service.description}</td>
                  <td className="px-4 py-2 text-gray-700">{service.duration}</td>
                  <td className="px-4 py-2 text-gray-700">{service.price}</td>
                  <td className="px-4 py-2 text-gray-700">{service.available ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-gray-700">
                    <img src={`http://localhost:8076/${service.image}`} alt="Service" className='w-24 h-24 object-cover rounded-full' />
                  </td>
                  <td className="px-4 py-2 text-gray-700 flex items-center space-x-3">
                    <Link
                      to={`/services/details/${service._id}`}
                      className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
                      title="View Service"
                    >
                      <BsInfoCircle size={20} />
                    </Link>
                    <Link
                      to={`/services/edit/${service._id}`}
                      className="text-yellow-600 hover:text-yellow-800 transition duration-150 ease-in-out"
                      title="Edit Service"
                    >
                      <FaEdit size={20} />
                    </Link>
                    <Link
                      to={`/services/delete/${service._id}`}
                      className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                      title="Delete Service"
                    >
                      <FaTrash size={20} />
                    </Link>
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

export default ShowService;

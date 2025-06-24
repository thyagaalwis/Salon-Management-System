import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';
import BackButton from "../../components/BackButton";

const CreateCustomer = () => {
  const [FirstName, setFirstName] = useState("");
  const [image, setImage] = useState(null);
  const [CusID, setCusID] = useState("");
  const [LastName, setLastName] = useState("");
  const [Age, setAge] = useState("");
  const [Gender, setGender] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storage = getStorage(app);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (!/^[A-Z][a-z]{0,19}$/.test(FirstName)) {
      Swal.fire({
        icon: "error",
        text: "First name should start with a capital letter, contain only letters, and have a maximum length of 20 characters.",
      });
      return;
    }
    if (!/^[A-Z][a-z]{0,19}$/.test(LastName)) {
      Swal.fire({
        icon: 'error',
        text: 'Last name should start with a capital letter, contain only letters, and have a maximum length of 20 characters.',
      });
      return;
    }
    if (!/[a-z]/.test(Password) || !/[A-Z]/.test(Password)) {
      Swal.fire({
        icon: 'error',
        text: 'Password must contain both lowercase and uppercase letters',
      });
      return;
    }
    if (!/[^a-zA-Z0-9]/.test(Password)) {
      Swal.fire({
        icon: 'error',
        text: 'Password must contain at least one special character',
      });
      return;
    }
    if (ContactNo.length !== 10) {
      Swal.fire({
        icon: 'error',
        text: 'Phone number must have 10 digits',
      });
      return;
    }
    const ageValue = Number(Age);
    if (isNaN(ageValue) || ageValue < 0 || ageValue > 99) {
      Swal.fire({
        icon: "error",
        text: "Age must be a number between 0 and 99.",
      });
      return;
    }
    if (!isValidEmail(Email)) {
      Swal.fire({
        icon: 'error',
        text: 'Please enter a valid email address',
      });
      return;
    }
    if (Password !== reEnteredPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const uploadImageAndSubmit = (downloadURL) => {
      const data = {
        image: downloadURL || null, // Set image to null if no image is uploaded
        CusID,
        FirstName,
        LastName,
        Age,
        Gender,
        ContactNo,
        Email,
        UserName: CusID,
        Password,
      };

      axios
        .post("http://localhost:8076/customers", data)
        .then(() => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Customer account created successfully for ${Email}. Your Username is: ${CusID} and Password: ${Password}`,
            showCancelButton: true,
            confirmButtonText: "Registration Successful",
          }).then((result) => {
            if (result.isConfirmed) {
              // Optionally handle confirmation action here
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Handle cancel action if needed
            }
            navigate("/");
          });
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.data === 'Already Registered Customer. Log In') {
            Swal.fire({
              icon: "error",
              title: "Already Registered",
              text: "This email is already registered. Please log in or use a different email.",
              showCancelButton: true,
              confirmButtonText: "OK",
              cancelButtonText: "Login",
            }).then((result) => {
              if (result.isConfirmed) {
                // Handle OK action
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                navigate("/login");
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "An error occurred. Please try again later.",
            });
          }
          console.log(error);
        });
    };

    if (image) {
      const storageRef = ref(storage, `customer_images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error(error);
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(uploadImageAndSubmit);
        }
      );
    } else {
      uploadImageAndSubmit(null); // No image uploaded
    }
  };

  const isValidEmail = (Email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(Email);
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle}>
        <BackButton destination={`/`} />
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto ml-[45%]" 
               src={Logo} 
               alt="logo" 
               style={{ width: '50px', height: '50px', marginRight: '50px' }} 
          />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
            <a href="/cLogin" className="font-medium text-pink-600 hover:text-pink-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              login to your account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-5 text-gray-700">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    type="text"
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium leading-5 text-gray-700">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    type="text"
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700"> Image (Optional)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cusID" className="block text-sm font-medium leading-5 text-gray-700">User Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="cusID"
                    name="cusID"
                    placeholder="CUST123"
                    type="text"
                    value={CusID}
                    onChange={(e) => setCusID(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium leading-5 text-gray-700">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="age"
                    name="age"
                    placeholder="25"
                    type="number"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium leading-5 text-gray-700">Gender</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="gender"
                    name="gender"
                    value={Gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="contactNo"
                    name="contactNo"
                    placeholder="0712345678"
                    type="text"
                    value={ContactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    placeholder="user@example.com"
                    type="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reEnteredPassword" className="block text-sm font-medium leading-5 text-gray-700">Confirm Password</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="reEnteredPassword"
                    name="reEnteredPassword"
                    type="password"
                    placeholder="••••••••"
                    value={reEnteredPassword}
                    onChange={(e) => setReEnteredPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <span className="block w-40 rounded-md shadow-sm">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-indigo active:bg-pink-700 transition duration-150 ease-in-out"
                  >
                    {loading ? <Spinner /> : "Create account"}
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;

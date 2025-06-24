import React from "react";
import Logo from '../../images/logo.png'
const Sidebar2 = () => {
  return (
    <>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-50 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-pink-700">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse ml-12">
        <img 
        src={Logo} 
        alt="logo" 
        style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
      />
          <span className=" text-black self-center text-xl font-bold whitespace-nowrap dark:text-">Bashi</span>
        </a>
          <ul className="space-y-2 font-medium mt-10">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                
                <span className="ms-3"></span>
              </a>
            </li>
            <li>
            <button
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-500 group-hover:to-blue-500 hover:text-white"
                            onClick={() => (window.location.href = "order/${CusID}")}
                          
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-opacity-0">
                               My Orders
                            </span>
                        </button>
            </li>
            <li>
            <button
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-blue-900 to-blue-500 group-hover:to-green-500 hover:text-white"
                            onClick={() => (window.location.href = "/allorders")}
                         
                        >
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-opacity-0">
                               Appointments
                            </span>
                        </button>
            </li>
            {/* Add more sidebar items as needed */}
          </ul>
        </div>
      </aside>

      
    </>
  );
};

export default Sidebar2;

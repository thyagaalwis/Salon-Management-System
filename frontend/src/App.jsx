import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CLogin from "./components/cLogin";
import ReadOneHome from "./pages/ReadOneHome";

import ShowAppointment from "./pages/Appointment/ShowAppointment";
import CreateAppointment from "./pages/Appointment/CreateAppointment";
import DeleteAppointment from "./pages/Appointment/DeleteAppointment";
import EditAppointment from "./pages/Appointment/EditAppointment";
import ReadOneAppointment from "./pages/Appointment/ReadOneAppointment";

import CusEditAppointment from "./pages/Customer/CusEditAppointment";

import ShowService from "./pages/SaloonService/ShowService";
import CreateService from "./pages/SaloonService/CreateService";
import DeleteService from "./pages/SaloonService/DeleteService";
import EditService from "./pages/SaloonService/EditService";
import ReadOneService from "./pages/SaloonService/ReadOneService";
import ServicePage from "./pages/SaloonService/ServicePage";

import ShowPkg from "./pages/Pkgs/ShowPkg";
import CreatePkg from "./pages/Pkgs/CreatePkg";
import DeletePkg from "./pages/Pkgs/DeletePkg";
import EditPkg from "./pages/Pkgs/EditPkg";
import ReadOnePkg from "./pages/Pkgs/ReadOnePkg";
import PkgPage from "./pages/Pkgs/PkgPage";

import ShowEmployee from "./pages/Employee/ShowEmployee";
import CreateEmployee from "./pages/Employee/CreateEmployee";
import DeleteEmployee from "./pages/Employee/DeleteEmployee";
import EditEmployee from "./pages/Employee/EditEmployee";
import ReadOneEmployee from "./pages/Employee/ReadOneEmployee";

import ShowSupplier from "./pages/Supplier/ShowSupplier";
import CreateSupplier from "./pages/Supplier/CreateSupplier";
import DeleteSupplier from "./pages/Supplier/DeleteSupplier";
import EditSupplier from "./pages/Supplier/EditSupplier";
import ReadOneSupplier from "./pages/Supplier/ReadOneSupplier";

import ShowInventory from "./pages/Inventory/ShowInventory";
import CreateInventory from "./pages/Inventory/CreateInventory";
import DeleteInventory from "./pages/Inventory/DeleteInventory";
import EditInventory from "./pages/Inventory/EditInventory";
import ReadOneInventory from "./pages/Inventory/ReadOneInventory";

import CreateCustomer from "./pages/Customer/CreateCustomer";
import CreateCustomer1 from "./pages/Customer/CreateCustomer1";
import DeleteCustomer from "./pages/Customer/DeleteCustomer";
//import EditCustomer from "./pages/Customer/EditCustomer";
import ShowAllCustomers from "./pages/Customer/ShowAllCustomers";
import ReadOneCustomer from "./pages/Customer/ReadOneCustomer";

import CreateStore from "./pages/StoreM/CreateStore";
import DeleteStore from "./pages/StoreM/DeleteStore";
import EditStore from "./pages/StoreM/EditStore";
import ShowStore from "./pages/StoreM/ShowStore";

import CreateCard from "./pages/Card/CreateCard";

import CreateEmployeeAttendance from "./pages/EmployeeAttendence/CreateEmployeeAttendence";
import DeleteEmployeeAttendance from "./pages/EmployeeAttendence/DeleteEmployeeAttendence";
import EditEmployeeAttendance from "./pages/EmployeeAttendence/EditEmployeeAttendence";
import ShowEmployeeAttendence from "./pages/EmployeeAttendence/ShowEmployeeAttendence";

import CreateEmployeeSalary from "./pages/EmployeeSalary/CreateEmployeeSalary";
import DeleteEmployeeSalary from "./pages/EmployeeSalary/DeleteEmployeeSalary";
import ShowEmployeeSalary from "./pages/EmployeeSalary/ShowEmployeeSalary";

import ItemCard from "./pages/Cart/ItemCard";
import Main from "./pages/Cart/Main";
import ItemDis from "./pages/Cart/ItemDis";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Cart/Checkout";
import MyOrder from "./pages/Cart/MyOrder";
import AllOrders from "./pages/Cart/AllOrders";
import DeleteOrder from "./pages/Cart/DeleteOrder";


import CreateFeedback from "./pages/Feedback/createfeedback";
import UpdateFeedback from "./pages/Feedback/Updatefeedback";
import ShowFeedback from "./pages/Feedback/ShowFeedback";
import Readfeedback from "./pages/Feedback/Readfeedback";

import EditCustomer1 from "./pages/Customer/EditCustomer1";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feedback/create/:cusID" element={<CreateFeedback />} />
      <Route path="/feedback/edit/:id" element={<UpdateFeedback />} />
      <Route path="/feedback/view/:id" element={<Readfeedback />} />
      <Route path="/Feedback" element={<ShowFeedback />} />


      <Route path="/appointments/allAppointment" element={<ShowAppointment />} />
      <Route path="/appointments/create/:CusID" element={<CreateAppointment />} />
      <Route path="/appointments/delete/:id" element={<DeleteAppointment />} />
      <Route path="/appointments/edit/:id" element={<EditAppointment />} />
      <Route path="/appointments/details/:id" element={<ReadOneAppointment />} />

      <Route path="/cusappointments/edit/:id" element={<CusEditAppointment />} />

      <Route path="/services/allService" element={<ShowService />} />
      <Route path="/services/create" element={<CreateService />} />
      <Route path="/services/delete/:id" element={<DeleteService />} />
      <Route path="/services/edit/:id" element={<EditService />} />
      <Route path="/services/details/:id" element={<ReadOneService />} />
      <Route path="/services/servicePage" element={<ServicePage />} />

      <Route path="/pkg/allPkg" element={<ShowPkg />} />
      <Route path="/pkg/create" element={<CreatePkg />} />
      <Route path="/pkg/delete/:id" element={<DeletePkg />} />
      <Route path="/pkg/edit/:id" element={<EditPkg />} />
      <Route path="/pkg/details/:id" element={<ReadOnePkg />} />
      <Route path="/pkg/pkgPage" element={<PkgPage />} />

      <Route path="/employees/allEmployee" element={<ShowEmployee />} />
      <Route path="/employees/create" element={<CreateEmployee />} />
      <Route path="/employees/delete/:id" element={<DeleteEmployee />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
      <Route path="/employees/details/:id" element={<ReadOneEmployee />} />

      <Route path="/suppliers/allSupplier" element={<ShowSupplier />} />
      <Route path="/suppliers/create" element={<CreateSupplier />} />
      <Route path="/suppliers/delete/:id" element={<DeleteSupplier />} />
      <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
      <Route path="/suppliers/details/:id" element={<ReadOneSupplier />} />

      <Route path="/inventories/allInventory" element={<ShowInventory />} />
      <Route path="/inventories/create" element={<CreateInventory />} />
      <Route path="/inventories/delete/:id" element={<DeleteInventory />} />
      <Route path="/inventories/edit/:id" element={<EditInventory />} />
      <Route path="/inventories/details/:id" element={<ReadOneInventory />} />

      <Route path="/customers/create" element={<CreateCustomer />} />
      <Route path="/customers1/create" element={<CreateCustomer1 />} />

      <Route path="/customers/delete/:id" element={<DeleteCustomer />} />
      {/* <Route path="/customers/edit/:id" element={<EditCustomer />} /> */}
      <Route path="/customers/get/:id" element={<ReadOneCustomer />} />
      <Route path="/customers" element={<ShowAllCustomers />} />

      <Route path="/cLogin" element={<CLogin />} />
      <Route path="/ReadOneHome/:CusID" element={<ReadOneHome />} />

      <Route path="/card/create/:CusID" element={<CreateCard />} />
      <Route path="/store/create" element={<CreateStore />} />
      <Route path="/store/delete/:id" element={<DeleteStore />} />
      <Route path="/store/edit/:id" element={<EditStore />} />
      <Route path="/store" element={<ShowStore />} />

      <Route path="/itemcard/create" element={<ItemCard />} />
      <Route path="/cart/main" element={<Main />} />
      <Route path="/itemdis/:ItemNo/:CusID" element={<ItemDis />} />
      <Route path="/cart/:CusID" element={<Cart />} />
      <Route path="/checkout/:CusID" element={<Checkout />} />
      <Route path="/my-orders/:CusID" element={<MyOrder />} />
      <Route path="/allorders" element={<AllOrders />} />
      <Route path="/deleteorder/:orderId" element={<DeleteOrder />} />

      <Route path="/employeeattendence/create" element={<CreateEmployeeAttendance />} />
      <Route path="/employeeattendence/delete/:id" element={<DeleteEmployeeAttendance />} />
      <Route path="/employeeattendence/edit/:id" element={<EditEmployeeAttendance />} />
      <Route path="/employeeattendence/allEmployeeAttendence" element={<ShowEmployeeAttendence />} />

      <Route path="/employeesalary/create" element={<CreateEmployeeSalary />} />
      <Route path="/employeesalary/delete/:id" element={<DeleteEmployeeSalary />} />
      <Route path="/employeesalary/allEmployeeSalary" element={<ShowEmployeeSalary />} />

      <Route path="/editCustomer1/:CusID" element={<EditCustomer1 />} />
    </Routes>
  );
};

export default App;

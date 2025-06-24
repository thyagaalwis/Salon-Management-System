import express from 'express';
import { Employee } from '../Models/Employee.js';

const router = express.Router();

// Route for Save a new Employee
router.post('/', async (request, response) => {
  try {
    if (
      
      !request.body.FirstName ||
      !request.body.LastName ||
      !request.body.Age ||
      !request.body.Gender ||
      //!request.body.BasicSalary ||
      !request.body.ContactNo ||
      !request.body.Email

    ) {
      return response.status(400).send({
        message: 'Send all required fields:  FirstName, LastName, Age, Gender, //BasicSalary, ContactNo,Email',
      });
    }
    const newEmployee = {
      
      FirstName: request.body.FirstName,
      LastName: request.body.LastName,
      Age: request.body.Age,
      Gender: request.body.Gender,
      //BasicSalary: request.body.BasicSalary,
      ContactNo: request.body.ContactNo,
      Email: request.body.Email,
    };

    const employee = await Employee.create(newEmployee);

    return response.status(201).send(employee);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Employees from database
router.get('/', async (request, response) => {
  try {
    const employees = await Employee.find({});

    return response.status(200).json({
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// Route for Get One Employee from database by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const employee = await Employee.findById(id);

    return response.status(200).json(employee);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update an employee
router.put('/:id', async (request, response) => {
  try {
    if (
      
      !request.body.FirstName ||
      !request.body.LastName ||
      !request.body.Age ||
      !request.body.Gender ||
      //!request.body.BasicSalary ||
      !request.body.ContactNo ||
      !request.body.Email
    ) {
      return response.status(400).send({
        message: 'Send all required fields: EmpID, FirstName, LastName, Age, Gender, //BasicSalary, Salary',
      });
    }

    const { id } = request.params;

    const result = await Employee.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    return response.status(200).send({ message: 'Employee updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete an employee
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Employee.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    return response.status(200).send({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// GET route for retrieving employees based on search criteria, pagination, and sorting
router.get("/searchEmployee", async (req, res) => {
  try {
    // Destructuring the request query with default values
    const { page = 1, limit = 7, search = "", sort = "EmpID" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Regular expression for case-insensitive search
    const query = {
      $or: [
        { EmpID: { $regex: new RegExp(search, 'i') } }, // Using RegExp instead of directly passing $regex
        { FirstName: { $regex: new RegExp(search, 'i') } },
        { LastName: { $regex: new RegExp(search, 'i') } },
        { Age: { $regex: new RegExp(search, 'i') } },
        { Gender: { $regex: new RegExp(search, 'i') } },
        //{ BasicSalary: { $regex: new RegExp(search, 'i') } },
        { ContactNo: { $regex: new RegExp(search, 'i') } },
        { Email: { $regex: new RegExp(search, 'i') } },
      ],
    };
    // Using await to ensure that sorting and pagination are applied correctly
    const employees = await Employee.find(query)
      .sort({ [sort]: 1 }) // Sorting based on the specified field
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({ count: employees.length, data: employees });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


export default router;
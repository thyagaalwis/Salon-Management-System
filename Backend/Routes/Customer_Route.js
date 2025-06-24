import express from 'express';
import mongoose from 'mongoose';
import { Customer } from '../Models/Customer.js';

const router = express.Router();

// Route for Save a new Customer
router.post('/', async (request, response) => {
    try {
        // Check if the email already exists
        const existingCustomer = await Customer.findOne({ Email: request.body.Email });
        if (existingCustomer) {
            return response.status(400).send('Already Registered Customer. Log In');
        }

        const newCustomer = new Customer({
            image: request.body.image,
            CusID: request.body.CusID,  // Generate a unique ID
            FirstName: request.body.FirstName,
            LastName: request.body.LastName,
            Age: request.body.Age,
            Gender: request.body.Gender,
            ContactNo: request.body.ContactNo,
            Email: request.body.Email,
           // UserName: request.body.UserName,
            Password: request.body.Password
        });

        const savedCustomer = await newCustomer.save();
        response.send(savedCustomer);
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).send('Duplicate CusID. Please try again.');
        } else {
            response.status(400).send(error);
        }
    }
});



// Route for Fetching all Customers

router.get('/', async (request, response) => {
    try {
        const customers = await Customer.find();
        response.send(customers);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Route for Fetching a Single Customer

// router.get('/:CusID', async (request, response) => {
//     try {
//         const customer = await Customer.findById(request.params.CusID);

//         if (!customer) return response.status(404).send('Customer not found');

//         response.send(customer);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });
router.get('/:identifier', async (request, response) => {
    try {
        // Extracting the identifier from the request parameters
        const { identifier } = request.params;

        // Checking if the provided identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Fetching a customer from the database based on the ID
            const cuByID = await Customer.findById(identifier);
            if (cuByID) {
                // Sending the fetched customer as a JSON response if found by ID
                return response.status(200).json(cuByID);
            }
        }

        // If the provided identifier is not a valid ObjectId, try searching by register number
        const customerByCUSID = await Customer.findOne({ CusID: identifier });
        if (customerByCUSID) {
            // Sending the fetched customer as a JSON response if found by  number
            return response.status(200).json(customerByCUSID);
        }

        // If no customer found by either ID or  number, send a 404 Not Found response
        return response.status(404).json({ message: 'Customer not found' });
    } catch (error) {
        // Handling errors and sending an error response with detailed error message
        console.error(error);
        response.status(500).send({ message: 'Error fetching Customer: ' + error.message });
    }
});
// Route for Updating a Customer

// router.patch('/:id', async (request, response) => {
//     try {
//         const customer = await Customer.findByIdAndUpdate(request.params.id, request.body, {new: true});

//         if (!customer) return response.status(404).send('Customer not found');

//         response.send(customer);
//     } catch (error) {
//         response.status(400).send(error);
//     }
// });

// Route for Deleting a Customer

router.delete('/:id', async (request, response) => {
    try {
        const customer = await Customer.findByIdAndDelete(request.params.id);

        if (!customer) return response.status(404).send('Customer not found');

        response.send(customer);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.post('/cLogin', async (request, response) => {
    try {
        const { CusID, Password } = request.body;
        if (!CusID || !Password) {
            return response.status(400).json({ message: 'CusID and Password are required' });
        }
        const customer = await Customer.findOne({ CusID });
        if (!customer) {
            return response.status(404).json({ message: 'User not found' });
        }
        if (Password !== customer.Password) {
            return response.status(401).json({ message: 'Incorrect Password' });
        }
        response.status(200).json(customer);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:Email', async (req, res) => { // view one customer by email
    try {
        const Email = req.params.Email; // Extract email from URL params
        const customer = await Customer.findOne({ Email:Email })

        if (!customer) {
            return res.status(404).json({ message: "customer not found" });
        }

        return res.status(200).json({
            data: customer
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}); 

// Route for retrieving a specific service by ID
router.get('/:identifier', async (request, response) => {
    try {
        // Extracting the identifier from the request parameters
        const { identifier } = request.params;

        // Checking if the provided identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Fetching a vehicle from the database based on the ID
            const cuByID = await Customer.findById(identifier);
            if (cuByID) {
                // Sending the fetched vehicle as a JSON response if found by ID
                return response.status(200).json(cuByID);
            }
        }

        // If the provided identifier is not a valid ObjectId, try searching by  number
        const customerByCUSID = await Customer.findOne({ cusID: identifier });
        if (customerByCUSID) {
            // Sending the fetched vehicle as a JSON response if found by  number
            return response.status(200).json(customerByCUSID);
        }

        // If no vehicle found by either ID or  number, send a 404 Not Found response
        return response.status(404).json({ message: 'Customer not found' });
    } catch (error) {
        // Handling errors and sending an error response with detailed error message
        console.error(error);
        response.status(500).send({ message: 'Error fetching Customer: ' + error.message });
    }
});
router.patch('/:identifier', async (request, response) => {
    try {
        const { identifier } = request.params;

        // Check if the identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const customer = await Customer.findByIdAndUpdate(identifier, request.body, { new: true });
            if (!customer) return response.status(404).send('Customer not found');
            return response.status(200).send(customer);
        }

        // If not a valid ObjectId, try searching by CusID
        const customerByCUSID = await Customer.findOneAndUpdate({ CusID: identifier }, request.body, { new: true });
        if (!customerByCUSID) return response.status(404).send('Customer not found');
        return response.status(200).send(customerByCUSID);
        
    } catch (error) {
        console.error(error);
        response.status(400).send({ message: 'Error updating customer: ' + error.message });
    }
});





export default router;
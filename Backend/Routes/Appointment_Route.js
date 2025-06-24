import express from 'express';
import { Appointment } from '../Models/Appointment.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware for validating required fields
const validateFields = (req, res, next) => {
    const requiredFields = [
        "client_name",
        "client_email",
        "client_phone",
        "stylist",
        "appoi_date",
        "appoi_time",
        "services",
        "CusID",
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

// Route to create a new appointment
router.post('/', validateFields, async (req, res) => {
    try {
        const newAppointment = {
            client_name: req.body.client_name,
            client_email: req.body.client_email,
            client_phone: req.body.client_phone,
            stylist: req.body.stylist,
            services: req.body.services,
            packages: req.body.packages,
            customize_package: req.body.customize_package,
            appoi_date: req.body.appoi_date,
            appoi_time: req.body.appoi_time,
            CusID:req.body.CusID
        };

        const createdAppointment = await Appointment.create(newAppointment);
        return res.status(201).send(createdAppointment);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        return res.status(200).json(appointments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get a specific appointment by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const appointment = await Appointment.findById(req.params.id);
//         if (!appointment) {
//           return res.status(404).json({ message: 'Appointment not found' });
//         }
//         res.json(appointment);
//       } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//       }
// });
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const appointmentByID = await Appointment.findById(identifier);
            if (appointmentByID) {
                return res.status(200).json(appointmentByID);
            }
        }

        const appointmentByCusID = await Appointment.find({ CusID: identifier });
        if (appointmentByCusID.length) {
            return res.status(200).json(appointmentByCusID);
        }

        return res.status(404).json({ message: 'Appointment not found' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching appointment: ' + error.message });
    }
});
// Route to update an appointment by ID
router.put('/:id', validateFields, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!appointment) return res.status(404).send('Appointment not found');

        res.send(appointment);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Route to delete an appointment by ID
router.delete('/:id', async (request, response) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(request.params.id);

        if (!appointment) return response.status(404).send('Appointment not found');

        response.send(appointment);
    } catch (error) {
        response.status(500).send(error);
    }
});

//GET search bar
router.get("searchappointment", function (req, res) {
    var search = req.query.search;
    console.log(search);
    Pkg.find({
        $or: [
            
            { appoi_ID: { $regex: search, $options: "i" } },
            { client_name: { $regex: search, $options: "i" } },
           { client_email: { $regex: search, $options: "i" } },
            { client_phone: { $regex: search, $options: "i" } },
            { stylist: { $regex: search, $options: "i"} },
          { appoi_date: { $regex: search, $options: "i"} },
            { appoi_time: { $regex: search, $options: "i"} },
            { services: { $regex: search, $options: "i"} },
            { packages: { $regex: search, $options: "i"} },
            { CusID: { $regex: search, $options: "i"} }
           
        ]
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(result);
        }
    });
});

    // Route for retrieving a specific Service by ID
    router.get('/:identifier', async (request, response) => {
        try {
            // Extracting the identifier from the request parameters
            const { identifier } = request.params;
      
            // Checking if the provided identifier is a valid MongoDB ObjectId
            if (mongoose.Types.ObjectId.isValid(identifier)) {
                // Fetching a vehicle from the database based on the ID
                const BookingByID = await Appointment.findById(identifier);
                if (BookingByID) {
                    // Sending the fetched vehicle as a JSON response if found by ID
                    return response.status(200).json(BookingByID);
                }
            }
      
            // If the provided identifier is not a valid ObjectId, try searching by register number
            const BookingByCUSID = await Appointment.find({ CusID: identifier });
            if (BookingByCUSID) {
                // Sending the fetched vehicle as a JSON response if found by register number
                return response.status(200).json(BookingByCUSID);
            }
      
            // If no vehicle found by either ID or register number, send a 404 Not Found response
            return response.status(404).json({ message: 'booking not found' });
        } catch (error) {
            // Handling errors and sending an error response with detailed error message
            console.error(error);
            response.status(500).send({ message: 'Error fetching booking: ' + error.message });
        }
      });

export default router;

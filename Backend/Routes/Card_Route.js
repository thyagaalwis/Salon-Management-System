import express from 'express';
import mongoose from 'mongoose';
import { Card } from '../Models/Card.js';


const router = express.Router();

// Route for saving a new Card
router.post('/', async (req, res) => {
    console.log("Request body:", req.body); // Log the incoming request body
    try {
      const newCard = new Card(req.body);
      const savedCard = await newCard.save();
      res.status(201).send(savedCard);
    } catch (error) {
      console.error("Error saving Card:", error); // Log the error
      if (error.code === 11000) {
        res.status(400).send('Duplicate card number');
      } else {
        res.status(400).send(error.message);
      }
    }
  });
  

// Route for Get All Cards from database
router.get('/', async (request, response) => {
    try {
        const Cards = await Card.find({});
        response.json(Cards);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
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
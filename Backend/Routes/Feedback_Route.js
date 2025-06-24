import express from 'express';
import mongoose from 'mongoose'; // Assuming you are using Mongoose for MongoDB

import { Feedback } from '../Models/Feedback.js';
const router = express.Router();

const validateFields = (req, res, next) => {
    const requiredFields = [
        "cusID",
        "name",
        "phone_number",
        "email",
        "employee",
        "date_of_service",
        "message",
        "star_rating",
    ];

    // Check if all required fields are present
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Missing required field: ${field}` });
        }
    }

    // Validate email format
    if (!req.body.email.match(/^\S+@\S+\.\S+$/)) {
        return res.status(400).send({ message: "Please provide a valid email address" });
    }

    // Validate phone number format
    if (!req.body.phone_number.match(/^\d{10}$/)) {
        return res.status(400).send({ message: "Please provide a valid 10-digit phone number" });
    }

    // Convert date_of_service to a Date object
    const parseDate = req.body.date_of_service ? new Date(req.body.date_of_service) : undefined;
    if (!parseDate || isNaN(parseDate.getTime())) {
        return res.status(400).send({ message: "Please provide a valid date for date_of_service" });
    }

    // Make data available in request
    req.parseDate = parseDate;
    next();
};

// Create new feedback
router.post("/", validateFields, async (req, res) => {
    try {
        const {
            cusID,
            name,
            email,
            phone_number,
            employee,
            message,
            star_rating,
        } = req.body;

        const newFeedback = {
            cusID,
            name,
            email,
            phone_number,
            employee,
            date_of_service: req.parseDate,
            message,
            star_rating,
        };

        // Save new feedback to the database
        const feedback = await Feedback.create(newFeedback);
        if (!feedback) {
            return res.status(500).send({ message: "Failed to create feedback" });
        }
        res.status(201).send(feedback);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get names for employees
router.get("/employees/names", async (req, res) => {
    try {
        const employees = await Feedback.distinct("employee");
        res.status(200).json({ count: employees.length, data: employees });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get route for feedback based on search criteria
router.get("/feedback", async (req, res) => {
    try {
        const { search = "" } = req.query;
        const query = {
            $or: [
                { cusID: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone_number: { $regex: search, $options: "i" } },
                { employee: { $regex: search, $options: "i" } },
                { date_of_service: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } },
                { star_rating: { $regex: search, $options: "i" } },
            ],
        };
        const feedback = await Feedback.find(query);
        res.status(200).json({ count: feedback.length, data: feedback });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Get all feedback
router.get("/", async (req, res) => {
    try {
        const feedback = await Feedback.find({});
        res.status(200).json({ count: feedback.length, data: feedback });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for retrieving feedback from a specific Customer by ID or cusID


// Update feedback by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        await Feedback.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).send({ message: "Feedback updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete feedback by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        await Feedback.findByIdAndDelete(id);
        res.status(200).send({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get("/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const feedbackByID = await Feedback.findById(identifier);
            if (feedbackByID) {
                return res.status(200).json(feedbackByID);
            }
        }

        const feedbackByCusID = await Feedback.find({ cusID: identifier });
        if (feedbackByCusID.length) {
            return res.status(200).json(feedbackByCusID);
        }

        return res.status(404).json({ message: 'Feedback not found' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Error fetching feedback: ' + error.message });
    }
});


export default router;

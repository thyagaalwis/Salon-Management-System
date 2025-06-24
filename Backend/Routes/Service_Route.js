import express from 'express';
import { Service } from '../Models/Service.js'; // Assuming the model is named Service
import mongoose from 'mongoose';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original file name
    }
});

const uploads = multer({ storage: storage }).single('image');

// Serve static files from the uploads directory
router.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware for validating required fields (excluding image)
const validateFields = (req, res, next) => {
    const requiredFields = [
        'category',
        'description',
        'duration',
        'price',
        'available',
        'subCategory'
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

// Route to create a new service
router.post('/', uploads, validateFields, async (req, res) => {
    try {
        const { category, description, duration, price, available, subCategory } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const newService = new Service({
            category,
            description,
            duration,
            price,
            available,
            subCategory,
            image
        });

        await newService.save();
        return res.status(201).json({ message: "Service created" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        return res.status(200).json(services);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get a service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundService = await Service.findById(id);

        if (!foundService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).json(foundService);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to update a service (with optional file upload)
router.put('/:id', uploads, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if a new image is uploaded
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const updatedData = {
            ...req.body,
            ...(image && { image }) // Only update image if a new file is uploaded
        };

        const updatedService = await Service.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).send({ message: 'Service updated successfully', updatedService });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to delete a service
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.status(200).send({ message: 'Service deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to search for services by multiple fields
router.get('/searchservice', (req, res) => {
    const search = req.query.search;
    console.log(search);

    Service.find({
        $or: [
            { service_ID: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { duration: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
            { available: { $regex: search, $options: "i" } },
            { subCategory: { $regex: search, $options: "i" } }
        ]
    }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Search failed' });
        } else {
            return res.json(result);
        }
    });
});

export default router;

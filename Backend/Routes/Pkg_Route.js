import express from 'express';
import { Pkg } from '../Models/Pkg.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cron from 'node-cron';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const uploads = multer({ storage: storage }).single('image');

// Serve static files from the uploads directory
router.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware for validating required fields (excluding image)
const validateFields = (req, res, next) => {
    const requiredFields = [
        "description",
        "base_price",
        "discount_rate",
        "final_price",
        "start_date",
        "end_date",
        "package_type",
        "p_name",
        "category",
        
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

// Route to create a new package
router.post('/', uploads, validateFields, async (req, res) => {
    try {
        const { description, base_price, discount_rate, final_price, start_date, end_date, conditions, package_type, category, subCategory, p_name } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const newPackage = new Pkg({
            description,
            base_price,
            discount_rate,
            final_price,
            start_date,
            end_date,
            conditions,
            package_type,
            category,
            p_name,
            image
        });

        await newPackage.save();
        return res.status(201).json({ message: "Package created", package: newPackage });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get all packages
router.get('/', async (req, res) => {
    try {
        const getPackages = await Pkg.find({});
        return res.status(200).json(getPackages);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get a package by custom ID field (not _id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundPackage = await Pkg.findById(id);

        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).json(foundPackage);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to update a package
router.put('/:id', uploads, validateFields, async (req, res) => {
    try {
        const { id } = req.params;
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const updatedData = {
            ...req.body,
            ...(image && { image }) // Only update image if a new file is uploaded
        };

        const updatedPackage = await Pkg.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).send({ message: 'Package updated successfully', updatedPackage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to delete a package
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPackage = await Pkg.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).send({ message: 'Package deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// GET route for search functionality
router.get('/searchpkg', async (req, res) => {
    try {
        const search = req.query.search;
        const results = await Pkg.find({
            $or: [
                { ID: { $regex: search, $options: 'i' } },
                { p_name: { $regex: search, $options: 'i' } },
                { base_price: { $regex: search, $options: 'i' } },
                { discount_rate: { $regex: search, $options: 'i' } },
                { final_price: { $regex: search, $options: 'i' } },
                { start_date: { $regex: search, $options: 'i' } },
                { end_date: { $regex: search, $options: 'i' } },
                { package_type: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        });

        res.json(results);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Schedule the task to run once a day (at midnight)
cron.schedule('0 0 * * *', async () => {
    try {
      const currentDate = new Date();
  
      // Find and delete packages where the end_date has passed
      const result = await Pkg.deleteMany({ end_date: { $lt: currentDate } });
  
      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired packages.`);
      }
    } catch (error) {
      console.error("Error deleting expired packages:", error);
    }
  });

export default router;

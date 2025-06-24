import express from 'express';
import { Supplier } from '../Models/Supplier.js';

const router = express.Router();

// Route for Save a new Supplier
router.post('/', async (request, response) => {
  try {
    const { SupplierName, Items, ContactNo, Email, Address } = request.body;

    if (!SupplierName || !Items || !Items.length || !ContactNo || !Email || !Address) {
      return response.status(400).send({
        message: 'Send all required fields: SupplierName, Items (ItemNo and ItemName for each), ContactNo, Email, Address',
      });
    }

    const newSupplier = {
      SupplierName,
      Items,
      ContactNo,
      Email,
      Address,
    };

    const supplier = await Supplier.create(newSupplier);
    return response.status(201).send(supplier);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Suppliers from database
router.get('/', async (request, response) => {
  try {
    const suppliers = await Supplier.find({});

    return response.status(200).json({
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Supplier from database by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).json(supplier);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Supplier
router.put('/:id', async (request, response) => {
  try {
    const { SupplierName, Items, ContactNo, Email, Address } = request.body;

    if (!SupplierName || !Items || !Items.length || !ContactNo || !Email || !Address) {
      return response.status(400).send({
        message: 'Send all required fields: SupplierName, Items (ItemNo and ItemName for each), ContactNo, Email, Address',
      });
    }

    const { id } = request.params;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { SupplierName, Items, ContactNo, Email, Address },
      { new: true }
    );

    if (!updatedSupplier) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).send({ message: 'Supplier updated successfully', data: updatedSupplier });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a Supplier
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Supplier.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).send({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// GET route for retrieving supplier based on search criteria, pagination, and sorting
router.get('/searchSupplier', async (req, res) => {
  try {
    // Destructuring the request query with default values
    const { page = 1, limit = 7, search = '', sort = 'SupplierID' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Regular expression for case-insensitive search
    const query = {
      $or: [
        { SupplierID: { $regex: new RegExp(search, 'i') } },
        { SupplierName: { $regex: new RegExp(search, 'i') } },
        { 'Items.ItemNo': { $regex: new RegExp(search, 'i') } },
        { 'Items.ItemName': { $regex: new RegExp(search, 'i') } },
        { ContactNo: { $regex: new RegExp(search, 'i') } },
        { Email: { $regex: new RegExp(search, 'i') } },
        { Address: { $regex: new RegExp(search, 'i') } },
      ],
    };
    // Using await to ensure that sorting and pagination are applied correctly
    const supplier = await Supplier.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({ count: supplier.length, data: supplier });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;

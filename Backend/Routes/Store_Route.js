import express from 'express';
import mongoose from 'mongoose';
import { Store } from '../Models/Store.js';


const router = express.Router();
router.put('/update/:id', async (req, res) => {
  try {
    const { quantityOrdered } = req.body; // Get quantity ordered from request

    // Find the store item by ID
    const storeItem = await Store.findById(req.params.id);

    if (!storeItem) {
      return res.status(404).send({ message: 'Item not found' });
    }

    // Ensure enough stock is available
    if (storeItem.Quantity < quantityOrdered) {
      return res.status(400).send({ message: 'Not enough stock available' });
    }

    // Reduce the quantity
    storeItem.Quantity -= quantityOrdered;

    // Save the updated store item
    await storeItem.save();

    res.status(200).send({ message: 'Quantity updated successfully', storeItem });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});// Route to get the updated store item data after quantity update
router.get('/item/:id', async (req, res) => {
  try {
    const storeItem = await Store.findById(req.params.id);

    if (!storeItem) {
      return res.status(404).send({ message: 'Item not found' });
    }

    res.status(200).send({ message: 'Item fetched successfully', storeItem });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Example route for transaction logging (if required)
router.post('/log-transaction', async (req, res) => {
  try {
    const { orderId, customerId, items } = req.body;

    // Create a log entry for the transaction
    const transactionLog = {
      orderId,
      customerId,
      items,
      date: new Date(),
    };

    // You can save this to a database or handle as needed
    // For now, we just return it as a response
    res.status(201).send({ message: 'Transaction logged successfully', transactionLog });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// If you want, you can add more routes like notifications, reports, etc.


// Route for Save a new Store

router.post('/', async (req, res) => {
    const store = new Store(req.body);
    try {
        await store.save();
        res.status(201).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route for Get all Stores

router.get('/', async (req, res) => {
    try {
        const stores = await Store.find({});
        res.send(stores);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route for Get one Store

router.get('/:id', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) return res.status(404).send('Store not found');

        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route for Update a Store

router.put('/:id', async (request, response) => {
    try {
      if (
        
        !request.body.ItemNo ||
        !request.body.ItemName ||
        !request.body.Description ||
        !request.body.Quantity ||
        !request.body.cost ||
        !request.body.SPrice 
  
      ) {
        return response.status(400).send({
          message: 'Send all required fields: ItemNo, ItemName, Category, Quantity, Price, SupplierName, SupplierEmail',
        });
      }
  
      const { id } = request.params;
  
      const result = await Store.findByIdAndUpdate(id, request.body);
  
      if (!result) {
        return response.status(404).json({ message: 'item not found' });
      }
  
      return response.status(200).send({ message: 'item updated successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
  

// Route for Delete a Store

router.delete('/:id', async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);

        if (!store) return res.status(404).send('item not found');

        res.send(store);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
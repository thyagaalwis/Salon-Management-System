import express from 'express';
import mongoose from 'mongoose';
import Order from '../Models/order.js'; // Ensure correct casing in the filename

const router = express.Router();

// Helper function to generate a unique 6-digit order ID starting with 'O'
const generateOrderId = async () => {
  let orderId;
  let existingOrder;
  do {
    orderId = "O" + Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
    existingOrder = await Order.findOne({ orderId }); // Use the Order model to find the order
  } while (existingOrder); // Ensure unique ID

  return orderId;
};

// Route to create an order
router.post("/", async (req, res) => {
  try {
    const orderId = await generateOrderId();
    const orderData = { ...req.body, orderId };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});
//Route to fetch all orders

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}); // No need to specify the model here
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to fetch orders by CusID
router.get("/:CusID", async (req, res) => {
  try {
    const orders = await Order.find({ CusID: req.params.CusID }); // Corrected to use CusID
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete an order by orderId
router.delete("/:orderId", async (req, res) => {
    try {
      // Ensure you're using the correct field to delete the order
      await Order.findOneAndDelete({ orderId: req.params.orderId });
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Route to update an order by orderId
router.put("/:orderId", async (req, res) => {
    try {
      // Ensure you're using the correct field to update the order
      const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, req.body, {
        new: true, // Return the updated order
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
export default router;

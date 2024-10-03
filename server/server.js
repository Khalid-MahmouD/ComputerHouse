const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Initialize app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/newDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema and model
const customerSchema = new mongoose.Schema({
  customerName: String,
  deviceCategory: String,
  issue: String,
  toFix: String,
  status: String,
  specifications: Object,
  timestamp: { type: Date, default: Date.now },
});

customerSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 100 });

const Customer = mongoose.model('Customer', customerSchema);

// Endpoint for submitting device details
app.post('/submit', async (req, res) => {
  console.log(req.body); // Check the data coming from the frontend

  // Destructure the incoming data from req.body, including toFix and status
  const { customerName, deviceCategory, issue, toFix, status, specifications } =
    req.body;

  // Create a new customer with the provided data
  const newCustomer = new Customer({
    customerName,
    deviceCategory,
    issue, // Default to 'waiting'
    toFix, // Make sure this matches the field sent from the frontend
    status: 'waiting', // Ensure the status is being passed and matches the schema
    specifications, // This should be an object, so double-check how it's structured in the request body
  });

  try {
    await newCustomer.save();
    res.status(201).json(newCustomer); // Respond with the created customer
  } catch (error) {
    res.status(500).json({ message: 'Error saving customer data.' });
  }
});

// Endpoint to count customers by status
app.get('/status-count', async (req, res) => {
  try {
    const doneCount = await Customer.countDocuments({ status: 'done' });
    const waitingCount = await Customer.countDocuments({ status: 'waiting' });
    const betweenCount = await Customer.countDocuments({ status: 'between' });

    res.json({
      done: doneCount,
      waiting: waitingCount,
      between: betweenCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving status counts.' });
  }
});

app.patch('/update-status/:id', async (req, res) => {
  try {
    const customerId = req.params.id;

    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check the current status and update accordingly
    let newStatus;
    if (customer.status.toLowerCase() === 'waiting') {
      newStatus = 'between';
    } else if (customer.status.toLowerCase() === 'between') {
      newStatus = 'done';
    } else {
      return res.status(400).json({
        message: `Status cannot be updated further from "${customer.status}".`,
      });
    }

    // Update the status
    customer.status = newStatus;
    const updatedCustomer = await customer.save();

    res.json(updatedCustomer); // Respond with the updated customer
  } catch (error) {
    console.error('Error updating status:', error); // Log error for debugging
    res.status(500).json({ message: 'Error updating status.' });
  }
});

// Endpoint for searching customers by name
app.get('/search', async (req, res) => {
  const { name, status } = req.query; // Destructure name and status from query parameters

  try {
    // Build the query based on provided parameters
    const query = {};

    // If a name is provided, add to the query for customer name
    if (name) {
      query.customerName = { $regex: name, $options: 'i' }; // Case-insensitive regex search for customer name
    }

    // If a status is provided, add to the query for status
    if (status) {
      query.status = { $regex: status, $options: 'i' }; // Case-insensitive regex search for status
    }

    // Execute the query to find matching customers
    const result = await Customer.find(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No customers found.' });
    }

    res.json(result); // Respond with the found customers
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customers.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

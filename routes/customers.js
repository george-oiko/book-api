const express = require('express');
const Customer = require('../models/customer');  // Assuming you save the Customer schema as customer.js in models directory
const router = express.Router();
const Reservation = require('../models/reservation');
// GET: Fetch all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch a customer by ID
router.get('/:id', getCustomer, (req, res) => {
    res.json(res.customer);  // customer object is attached to the response by the middleware
});

// POST: Create a new customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update a customer by ID
router.put('/:id', getCustomer, async (req, res) => {
    if (req.body.name != null) {
        res.customer.name = req.body.name;
    }
    if (req.body.surname != null) {
        res.customer.surname = req.body.surname;
    }
    if (req.body.email != null) {
        res.customer.email = req.body.email;
    }
    if (req.body.phoneNumber != null) {
        res.customer.phoneNumber = req.body.phoneNumber;
    }

    try {
        const updatedCustomer = await res.customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a customer by ID
router.delete('/:id', getCustomer, async (req, res) => {
    try {

        const activeReservation = await Reservation.findOne({ customerId: req.params.id });
        
        if (activeReservation) {
            return res.status(400).json({ message: "Cannot delete a customer that has an active reservation." });
        }

        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer deleted successfully", deletedCustomer });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to fetch a customer by ID
async function getCustomer(req, res, next) {
    let customer;
    try {
        customer = await Customer.findById(req.params.id);
        if (customer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.customer = customer;  // Attach customer object to the response
    next();
}

module.exports = router;

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }
});

// Create the Customer model from the schema
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

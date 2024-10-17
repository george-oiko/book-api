const mongoose = require('mongoose');

// Define Reservation schema
const reservationSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    reservedOn: { type: Date, default: Date.now },
    returnBy: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
});

// Create the Reservation model from the schema
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

const express = require('express');
const Reservation = require('../models/reservation');
const Book = require('../models/book');
const Customer = require('../models/customer');
const router = express.Router();

// POST: Create a new reservation
router.post('/', async (req, res) => {
    const { customerId, bookId, returnBy } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).json({ message: 'Book not available for reservation' });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const reservation = new Reservation({
            customer: customerId,
            book: bookId,
            returnBy: returnBy
        });

        await reservation.save();
        book.available = false; // Mark the book as unavailable
        await book.save();

        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('customer').populate('book');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch a reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('customer').populate('book');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Complete a reservation (mark it as completed)
router.post('/:id/complete', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        reservation.status = 'completed';
        await reservation.save();

        const book = await Book.findById(reservation.book);
        book.available = true; // Mark the book as available again
        await book.save();

        res.json({ message: 'Reservation completed', reservation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Cancel a reservation
router.post('/:id/cancel', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        reservation.status = 'cancelled';
        await reservation.save();

        const book = await Book.findById(reservation.book);
        book.available = true; // Mark the book as available again
        await book.save();

        res.json({ message: 'Reservation cancelled', reservation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

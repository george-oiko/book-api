const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search, sort } = req.query;

        // Build the query object
        let query = {};

        // If search is provided, add it to the query (case-insensitive search by name)
        if (search) {
            query.name = { $regex: search, $options: 'i' };  // 'i' makes it case-insensitive
        }

        // Define sorting order (ascending or descending based on 'sort' query param)
        let sortOrder = {};
        if (sort) {
            if (sort === 'asc') {
                sortOrder.name = 1;  // Ascending
            } else if (sort === 'desc') {
                sortOrder.name = -1; // Descending
            }
        }

        // Execute the query with optional sorting
        const books = await Book.find(query).sort(sortOrder);

        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Fetch a book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new book
router.post('/', async (req, res) => {
    const { name, year, type, author, createdOn } = req.body;
    const available = true;
    const book = new Book({
        name,
        year,
        type,
        author,
        available,
        createdOn
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update an existing book
router.put('/:id', async (req, res) => {
    try {
        const { name, year, type, author } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { name, year, type, author },
            { new: true } // returns the updated document
        );
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully", deletedBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

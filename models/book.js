const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    type: {
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography'],
        required: true
    },
    author: { type: String, required: true },
    available: { type: Boolean, required: true },
    createdOn: { type: Date, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
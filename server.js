require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/books');
const customerRoutes = require('./routes/customers');
const reservationRoutes = require('./routes/reservations'); 
const cors = require('cors')
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Could not connect to MongoDB", err));

// Use the books route
app.use('/books', booksRouter);
app.use('/customers', customerRoutes);
app.use('/reservations', reservationRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

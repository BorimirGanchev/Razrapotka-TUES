const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const eventRoutes = require('./routes/events');

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Library Management System API!');
});

app.use((req, res) => {
    res.status(404).send('The requested resource was not found.');
});

const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Failed to connect to MongoDB Atlas', err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

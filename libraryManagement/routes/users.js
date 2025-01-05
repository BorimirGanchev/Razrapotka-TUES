const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
});

router.put('/profile', async (req, res) => {
    const { userId, updates } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/history', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).populate('borrowingHistory');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(user.borrowingHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/borrow', async (req, res) => {
    const { bookId, userId, returnDate } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found!' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        if (book.quantity <= 0) {
            return res.status(400).json({ error: 'Book not available' });
        }

        const borrow = new Borrow({
            book: bookId,
            user: userId,
            returnDate
        });
        await borrow.save();

        book.quantity -= 1;
        await book.save();

        user.borrowingHistory.push(bookId);
        await user.save();

        res.status(201).json({ message: 'Book borrowed successfully!', borrow });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

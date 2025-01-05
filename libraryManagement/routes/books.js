const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/search', async (req, res) => {
    const { query } = req.query;
    const books = await Book.find({ title: new RegExp(query, 'i') });
    res.status(200).json(books);
});

router.post('/borrow', async (req, res) => {
    const { userId, bookId } = req.body;
    const book = await Book.findById(bookId);
    if (book.quantity <= 0) return res.status(400).json({ error: 'Book not available' });
    book.quantity--;
    book.borrowedBy.push(userId);
    await book.save();
    res.status(200).json({ message: 'Book borrowed successfully' });
});

router.post('/add', async (req, res) => {
    const { title, description, author, year, isbn, quantity } = req.body;

    try {
        const book = new Book({ title, description, author, year, isbn, quantity });
        await book.save();
        res.status(201).json({ message: 'Book added successfully!', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(id, { quantity }, { new: true });
        res.status(200).json({ message: 'Book quantity updated!', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.findByIdAndDelete(id);
        res.status(200).json({ message: 'Book removed successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/overdue', async (req, res) => {
    try {
        const overdueBooks = await Borrow.find({ returnDate: { $lt: new Date() }, returned: false }).populate('book user');
        res.status(200).json(overdueBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/overdue', async (req, res) => {
    try {
        const overdueBooks = await Borrow.find({ returnDate: { $lt: new Date() }, returned: false }).populate('book user');
        res.status(200).json(overdueBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const Borrow = require('../models/Borrow');

router.get('/overdue', async (req, res) => {
    try {
        const overdueBooks = await Borrow.find({
            returnDate: { $lt: new Date() }, 
            returned: false 
        }).populate('book user'); 

        res.status(200).json(overdueBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    year: { type: Number },
    isbn: { type: String, unique: true },
    quantity: { type: Number, required: true },
    borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Book', bookSchema);

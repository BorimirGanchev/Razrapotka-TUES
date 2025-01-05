const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date, required: true },
    returned: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Borrow', borrowSchema);

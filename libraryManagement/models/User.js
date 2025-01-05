const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'librarian'], default: 'user' },
    borrowingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);

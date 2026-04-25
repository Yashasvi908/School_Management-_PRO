const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String },
    category: { type: String },
    totalCopies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    schoolId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

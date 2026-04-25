const Book = require('../../models/Book');
const Route = require('../../models/Route');

// LIBRARY HANDLERS
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({ schoolId: req.user.schoolId });
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const book = await Book.create({ ...req.body, schoolId: req.user.schoolId });
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// TRANSPORT HANDLERS
exports.getRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ schoolId: req.user.schoolId });
        res.json({ success: true, data: routes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createRoute = async (req, res) => {
    try {
        const route = await Route.create({ ...req.body, schoolId: req.user.schoolId });
        res.status(201).json({ success: true, data: route });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

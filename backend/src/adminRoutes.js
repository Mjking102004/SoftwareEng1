const express = require('express');
const router = express.Router();
const {getBooks, createBook, deleteBook, getCategories} = require('./controllers/adminController');

router.get('/books', getBooks);
router.post('/books', createBook);
router.get('/categories', getCategories);
router.delete('/books/:id', deleteBook);

module.exports = router;
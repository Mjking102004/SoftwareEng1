const express = require('express');
const router = express.Router();
const {getBooks, createBook, getCategories} = require('./controllers/adminController');

router.get('/books', getBooks);
router.post('/books', createBook);
router.get('/categories', getCategories);

module.exports = router;
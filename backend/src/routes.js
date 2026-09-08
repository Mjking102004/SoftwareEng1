const express = require('express');
const router = express.Router();
const { getItems, addItem } = require('./controllers/controller');

router.get('/items', getItems);
router.post('/items', addItem);

module.exports = router;

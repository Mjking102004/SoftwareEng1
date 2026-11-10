const router = require('express').Router();
const controller = require('../controllers/bookController');

router.get('/', controller.getBooks);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getBook);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', controller.getCart);
router.get('/summary', controller.getCartSummary);
router.post('/items', controller.addCartItem);
router.patch('/items/:bookId', controller.updateCartItem);
router.delete('/items/:bookId', controller.removeCartItem);

module.exports = router;

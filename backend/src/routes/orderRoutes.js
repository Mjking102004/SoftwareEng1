const router = require('express').Router();
const controller = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrder);
router.post('/', controller.createOrder);

module.exports = router;

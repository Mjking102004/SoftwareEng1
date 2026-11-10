const router = require('express').Router();
const controller = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Preserve existing admin book/category handlers and require server-side admin access.
router.use(requireAuth, requireAdmin);

router.get('/books', controller.getBooks);
router.post('/books', controller.createBook);
router.patch('/books/:id', controller.updateBook);
router.delete('/books/:id', controller.deleteBook);
router.get('/categories', controller.getCategories);
router.post('/categories', controller.createCategory);
router.get('/users', controller.getUsers);
router.patch('/users/:id/role', controller.updateUserRole);
router.get('/orders', controller.getOrders);
router.patch('/orders/:id/status', controller.updateOrderStatus);
router.get('/discounts', controller.getDiscounts);
router.post('/discounts', controller.createDiscount);
router.patch('/discounts/:id', controller.updateDiscount);
router.get('/sales', controller.getSales);
router.post('/sales', controller.createSale);
router.patch('/sales/:id', controller.updateSale);

module.exports = router;

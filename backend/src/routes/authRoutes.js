const router = require('express').Router();
const controller = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);
router.patch('/me', requireAuth, controller.updateMe);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../utils/protect');
const restrictTo = require('../utils/restrictTo');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post(
  '/submit-form',
  protect,
  restrictTo('student'),
  userController.submitForm,
);

router.patch(
  '/form-status',
  protect,
  restrictTo('admin'),
  userController.updateFormStatus,
);

router.get(
  '/forms',
  protect,
  restrictTo('admin security'),
  userController.getAllForms,
);

router.route('/').get(protect, restrictTo('admin'), userController.getAllUsers);
router
  .route('/profile')
  .get(protect, restrictTo('student'), userController.getUser);

module.exports = router;

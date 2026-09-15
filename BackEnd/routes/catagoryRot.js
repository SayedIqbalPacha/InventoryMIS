const express = require('express');

const categoryController = require('../controllers/catagoryController');
const { protect, restrictTo } = require('../controllers/authCon');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    categoryController.getAllCategories,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    categoryController.createCategory,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    categoryController.getCategory,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    categoryController.updateCategory,
  )
  .delete(protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;

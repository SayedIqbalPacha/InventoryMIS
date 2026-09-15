const express = require('express');

const itemCon = require('../controllers/itemCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), itemCon.getAllItems)
  .post(protect, restrictTo('user', 'manager', 'admin'), itemCon.createItem);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), itemCon.getItem)
  .patch(protect, restrictTo('manager', 'admin'), itemCon.updateItem)
  .delete(protect, restrictTo('admin'), itemCon.deleteItem);

module.exports = router;

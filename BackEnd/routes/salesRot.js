const express = require('express');

const salesCon = require('../controllers/salesCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/available-stock')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    salesCon.getAvailableStock,
  );

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), salesCon.getAllSales)
  .post(protect, restrictTo('user', 'manager', 'admin'), salesCon.createSale);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), salesCon.getSale)
  .patch(protect, restrictTo('manager', 'admin'), salesCon.updateSale)
  .delete(protect, restrictTo('admin'), salesCon.deleteSale);

module.exports = router;

const express = require('express');

const currencyCon = require('../controllers/currencyCon');
const { protect, restrictTo } = require('../controllers/authCon');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    currencyCon.getAllCurrencies,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    currencyCon.createCurrency,
  );

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), currencyCon.getCurrency)
  .patch(protect, restrictTo('manager', 'admin'), currencyCon.updateCurrency)
  .delete(protect, restrictTo('admin'), currencyCon.deleteCurrency);

module.exports = router;

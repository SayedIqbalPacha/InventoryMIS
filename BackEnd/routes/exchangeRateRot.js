const express = require('express');

const exchangeRateCon = require('../controllers/exchangeRateCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    exchangeRateCon.getAllExchangeRates,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    exchangeRateCon.createExchangeRate,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    exchangeRateCon.getExchangeRate,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    exchangeRateCon.updateExchangeRate,
  )
  .delete(protect, restrictTo('admin'), exchangeRateCon.deleteExchangeRate);

module.exports = router;

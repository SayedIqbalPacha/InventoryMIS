const express = require('express');

const router = express.Router();

const customerPaymentCon = require('../controllers/customerPaymentCon');

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    customerPaymentCon.getAllCustomerPayment,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    customerPaymentCon.createCustomerPayment,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    customerPaymentCon.getOneCustomerPayment,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    customerPaymentCon.updateCustomerPayment,
  )
  .delete(
    protect,
    restrictTo('admin'),
    customerPaymentCon.deleteCustomerPayment,
  );

module.exports = router;

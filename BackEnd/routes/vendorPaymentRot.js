const express = require('express');

const vendorPayment = require('../controllers/vendorPaymentCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    vendorPayment.getAllVendorPayments,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    vendorPayment.createVendorPayment,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    vendorPayment.getVendorPayment,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    vendorPayment.updateVendorPayment,
  )
  .delete(protect, restrictTo('admin'), vendorPayment.deleteVendorPayment);

module.exports = router;

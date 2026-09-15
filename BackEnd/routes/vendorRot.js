const express = require('express');

const vendorCon = require('../controllers/vendorCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), vendorCon.getAllVendors)
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    vendorCon.createVendor,
  );

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), vendorCon.getVendor)
  .patch(protect, restrictTo('manager', 'admin'), vendorCon.updateVendor)
  .delete(protect, restrictTo('admin'), vendorCon.deleteVendor);

module.exports = router;

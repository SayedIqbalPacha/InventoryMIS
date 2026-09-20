const express = require('express');

const reportCon = require('../controllers/reportCon');

const { protect, restrictTo } = require('../controllers/authCon');

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), reportCon.getReports);

router
  .route('/customer-activity')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    reportCon.getCustomerActivity,
  );

module.exports = router;

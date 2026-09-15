const express = require('express');

const reportCon = require('../controllers/reportCon');

const { protect, restrictTo } = require('../controllers/authCon');

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), reportCon.getReports);

module.exports = router;

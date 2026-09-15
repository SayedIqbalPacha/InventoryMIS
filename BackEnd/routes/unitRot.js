const express = require('express');

const untiCon = require('../controllers/unitCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(protect, restrictTo('user', 'manager', 'admin'), untiCon.getAllUnits)
  .post(protect, restrictTo('user', 'manager', 'admin'), untiCon.createUnit);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), untiCon.getUnit)
  .patch(protect, restrictTo('manager', 'admin'), untiCon.updateUnit)
  .delete(protect, restrictTo('admin'), untiCon.deleteUnit);

module.exports = router;

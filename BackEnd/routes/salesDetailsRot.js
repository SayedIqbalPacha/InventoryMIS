const express = require('express');

const salesDetailsCon = require('../controllers/salesDetailsCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    salesDetailsCon.getAllSalesDetails,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    salesDetailsCon.createSalesDetail,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    salesDetailsCon.getSalesDetail,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    salesDetailsCon.updateSalesDetail,
  )
  .delete(protect, restrictTo('admin'), salesDetailsCon.deleteSalesDetail);

module.exports = router;

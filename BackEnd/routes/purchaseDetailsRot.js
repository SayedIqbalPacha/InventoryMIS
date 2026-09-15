const express = require('express');

const purchaseDetailsCon = require('../controllers/purchaseDetilasCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    purchaseDetailsCon.getAllPurchaseDetails,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    purchaseDetailsCon.createPurchaseDetail,
  );

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    purchaseDetailsCon.getPurchaseDetail,
  )
  .patch(
    protect,
    restrictTo('manager', 'admin'),
    purchaseDetailsCon.updatePurchaseDetail,
  )
  .delete(
    protect,
    restrictTo('admin'),
    purchaseDetailsCon.deletePurchaseDetail,
  );

module.exports = router;

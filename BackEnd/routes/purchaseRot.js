const express = require('express');

const purchaseCon = require('../controllers/purchaseCon');

const router = express.Router();

const { protect, restrictTo } = require('../controllers/authCon');

router
  .route('/')
  .get(
    protect,
    restrictTo('user', 'manager', 'admin'),
    purchaseCon.getAllPurchases,
  )
  .post(
    protect,
    restrictTo('user', 'manager', 'admin'),
    purchaseCon.createPurchase,
  );

router
  .route('/:id')
  .get(protect, restrictTo('user', 'manager', 'admin'), purchaseCon.getPurchase)
  .patch(protect, restrictTo('manager', 'admin'), purchaseCon.updatePurchase)
  .delete(protect, restrictTo('admin'), purchaseCon.deletePurchase);

module.exports = router;

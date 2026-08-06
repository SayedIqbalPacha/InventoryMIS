const express = require('express');

const purchaseCon = require('../controllers/purchaseCon');

const router = express.Router();

router
    .route('/')
    .get(purchaseCon.getAllPurchases)
    .post(purchaseCon.createPurchase);

router
    .route('/:id')
    .get(purchaseCon.getPurchase)
    .patch(purchaseCon.updatePurchase)
    .delete(purchaseCon.deletePurchase);

module.exports = router;
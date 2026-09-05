const express = require('express');

const purchaseDetailsCon = require('../controllers/purchaseDetilasCon');

const router = express.Router();

router
    .route('/')
    .get(purchaseDetailsCon.getAllPurchaseDetails)
    .post(purchaseDetailsCon.createPurchaseDetail);

router
    .route('/:id')
    .get(purchaseDetailsCon.getPurchaseDetail)
    .patch(purchaseDetailsCon.updatePurchaseDetail)
    .delete(purchaseDetailsCon.deletePurchaseDetail);

module.exports = router;
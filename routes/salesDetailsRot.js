const express = require('express');

const salesDetailsCon = require('../controllers/salesDetailsCon');

const router = express.Router();

router
    .route('/')
    .get(salesDetailsCon.getAllSalesDetails)
    .post(salesDetailsCon.createSalesDetail);

router
    .route('/:id')
    .get(salesDetailsCon.getSalesDetail)
    .patch(salesDetailsCon.updateSalesDetail)
    .delete(salesDetailsCon.deleteSalesDetail);

module.exports = router;
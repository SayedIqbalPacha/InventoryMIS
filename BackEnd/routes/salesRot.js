const express = require('express');

const salesCon = require('../controllers/salesCon');

const router = express.Router();

router
    .route('/')
    .get(salesCon.getAllSales)
    .post(salesCon.createSale);

router
    .route('/:id')
    .get(salesCon.getSale)
    .patch(salesCon.updateSale)
    .delete(salesCon.deleteSale);

module.exports = router;
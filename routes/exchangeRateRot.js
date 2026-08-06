const express = require('express');

const exchangeRateCon = require('../controllers/exchangeRateCon');

const router = express.Router();

router
    .route('/')
    .get(exchangeRateCon.getAllExchangeRates)
    .post(exchangeRateCon.createExchangeRate);

router
    .route('/:id')
    .get(exchangeRateCon.getExchangeRate)
    .patch(exchangeRateCon.updateExchangeRate)
    .delete(exchangeRateCon.deleteExchangeRate);

module.exports = router;
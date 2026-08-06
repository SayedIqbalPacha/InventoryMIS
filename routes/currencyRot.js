const express = require('express');

const currencyCon = require('../controllers/currencyCon');

const router = express.Router();

router
    .route('/')
    .get(currencyCon.getAllCurrencies)
    .post(currencyCon.createCurrency);

router
    .route('/:id')
    .get(currencyCon.getCurrency)
    .patch(currencyCon.updateCurrency)
    .delete(currencyCon.deleteCurrency);

module.exports = router;
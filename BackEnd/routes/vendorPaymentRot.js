const express = require('express');

const vendorPayment = require('../controllers/vendorPaymentCon');

const router = express.Router();

router
    .route('/')
    .get(vendorPayment.getAllVendorPayments)
    .post(vendorPayment.createVendorPayment);

router
    .route('/:id')
    .get(vendorPayment.getVendorPayment)
    .patch(vendorPayment.updateVendorPayment)
    .delete(vendorPayment.deleteVendorPayment);

module.exports = router;
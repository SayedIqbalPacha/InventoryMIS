const express = require('express');
const router = express.Router();

const customerPaymentCon = require('../controllers/customerPaymentCon');

router
.route('/')
.get(customerPaymentCon.getAllCustomerPayment)
.post(customerPaymentCon.createCustomerPayment);

router
.route('/:id')
.get(customerPaymentCon.getOneCustomerPayment)
.patch(customerPaymentCon.updateCustomerPayment)
.delete(customerPaymentCon.deleteCustomerPayment);

module.exports = router;
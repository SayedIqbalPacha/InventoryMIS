const express = require('express');

const customerController = require('../controllers/customerCon');

const router = express.Router();

router
    .route('/')
    .get(customerController.getAllCustomers)
    .post(customerController.createCustomer);

router
    .route('/:id')
    .get(customerController.getCustomer)
    .patch(customerController.updateCustomer)
    .delete(customerController.deleteCustomer);

module.exports = router;
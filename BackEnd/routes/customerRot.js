const express = require('express');

const customerController = require('../controllers/customerCon');

const { protect, restrictTo } = require('../controllers/authCon');

const router = express.Router();

router

    .route('/')

    .get(
         protect,
        restrictTo('user', 'manager', 'admin'),
        customerController.getAllCustomers
    )

    .post(
        protect,
        restrictTo('user', 'manager', 'admin'),
        customerController.createCustomer

    );


router

    .route('/:id')

    .get(
        protect,
        restrictTo('user', 'manager', 'admin'),
        customerController.getCustomer
    )

    .patch(
        protect,
        restrictTo('manager', 'admin'),
        customerController.updateCustomer
    )

    .delete(
        protect,
        restrictTo('admin'),
        customerController.deleteCustomer
    );


module.exports = router;
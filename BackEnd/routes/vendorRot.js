const express = require('express');

const vendorCon = require('../controllers/vendorCon');

const router = express.Router();

router
    .route('/')
    .get(vendorCon.getAllVendors)
    .post(vendorCon.createVendor);

router
    .route('/:id')
    .get(vendorCon.getVendor)
    .patch(vendorCon.updateVendor)
    .delete(vendorCon.deleteVendor);

module.exports = router;
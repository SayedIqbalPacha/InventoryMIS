const express = require('express');

const untiCon = require('../controllers/unitCon');

const router = express.Router();

router
    .route('/')
    .get(untiCon.getAllUnits)
    .post(untiCon.createUnit);

router
    .route('/:id')
    .get(untiCon.getUnit)
    .patch(untiCon.updateUnit)
    .delete(untiCon.deleteUnit);

module.exports = router;
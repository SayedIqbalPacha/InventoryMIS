const express = require('express');

const itemCon = require('../controllers/itemCon');

const router = express.Router();

router
    .route('/')
    .get(itemCon.getAllItems)
    .post(itemCon.createItem);

router
    .route('/:id')
    .get(itemCon.getItem)
    .patch(itemCon.updateItem)
    .delete(itemCon.deleteItem);

module.exports = router;
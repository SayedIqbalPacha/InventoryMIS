const express = require('express');
const userCon = require('../controllers/userCon');

const router = express.Router();

router
    .route('/')
    .get(userCon.getAllUsers);

router
    .route('/:id')
    .get(userCon.getUser);

module.exports = router;
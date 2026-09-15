const express = require('express');
const dashboardCon = require('../controllers/dashboardCon');
const { protect } = require('../controllers/authCon');

const router = express.Router();

router.route('/').get(protect, dashboardCon.getDashboard);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/last_month', paymentController.fetchRevenueData);

module.exports = router;
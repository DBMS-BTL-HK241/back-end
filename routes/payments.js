// routes/auth.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create_bill', paymentController.createBill);

module.exports = router;
// routes/auth.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create_bill', paymentController.createBill);
router.get('/invoices', paymentController.getAllInvoices);
router.post('/update_invoices/:id', paymentController.updateInvoice);

module.exports = router;
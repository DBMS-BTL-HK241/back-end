const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create_bill', paymentController.createBill);
router.get('/invoices', paymentController.getAllInvoices);
router.post('/update_invoice/:id', paymentController.updateInvoice);

router.delete('/delete_all_bills', paymentController.deleteAllBills);

router.post('/create-payment-url', paymentController.createPaymentUrl);

router.post('/payment_succeed/:id', paymentController.paymentSucceed);

module.exports = router;
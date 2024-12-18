const express = require('express');
const router = express.Router();
const { getAllClinics } = require('../controllers/clinicController.js');

router.get('/', getAllClinics);

module.exports = router;

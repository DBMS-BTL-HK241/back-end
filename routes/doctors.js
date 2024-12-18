const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctorController.js');

router.get('/', getAllDoctors);

module.exports = router;

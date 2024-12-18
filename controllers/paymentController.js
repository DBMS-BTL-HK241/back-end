const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { session } = require('../config/neo4j');
const Bill = require('../models/billModel');

const createBill = async (req, res) => {
    console.log("IN");
    const {
        patientName,
        doctorName,
        amount,
        status,
        dateOfVisit,
        symptoms,
        disease,
        medicines
    } = req.body;
    const newBill = await Bill.createBill(patientName, doctorName, amount, status, dateOfVisit, symptoms, disease, medicines);
    res.status(201).json({ message: 'Bill created', bill: newBill });
};

module.exports = { createBill };

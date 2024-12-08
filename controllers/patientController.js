const patientModel = require('../models/patientModel');

// Lấy tất cả bệnh nhân
const getAllPatients = async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllPatients,
};

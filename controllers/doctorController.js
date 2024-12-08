const doctorModel = require('../models/doctorModel');

// Lấy tất cả bác sĩ
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.getAllDoctors();
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllDoctors,
};

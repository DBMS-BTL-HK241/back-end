const clinicModel = require('../models/clinicModel');

// Lấy tất cả phòng khám
const getAllClinics = async (req, res) => {
    try {
        const clinics = await clinicModel.getAllClinics();
        res.json(clinics);
    } catch (error) {
        console.error('Error fetching clinics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllClinics,
};

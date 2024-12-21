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

// Lấy thông tin một phòng khám theo ID
const getClinicByID = async (req, res) => {
    try {
        const { id } = req.params;
        const clinic = await clinicModel.getClinicByID(id);
        if (clinic) {
            res.json(clinic);
        } else {
            res.status(404).json({ message: 'Clinic not found' });
        }
    } catch (error) {
        console.error('Error fetching clinic by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Thêm mới một phòng khám
const addClinic = async (req, res) => {
    try {
        const clinicData = req.body;
        const success = await clinicModel.addClinic(clinicData);
        if (success) {
            res.status(201).json({ message: 'Clinic added successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add clinic' });
        }
    } catch (error) {
        console.error('Error adding clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Chỉnh sửa thông tin phòng khám
const updateClinic = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const success = await clinicModel.updateClinic(id, updatedFields);
        if (success) {
            res.json({ message: 'Clinic updated successfully' });
        } else {
            res.status(404).json({ message: 'Clinic not found' });
        }
    } catch (error) {
        console.error('Error updating clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Xóa một phòng khám
const deleteClinic = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await clinicModel.deleteClinic(id);
        if (success) {
            res.json({ message: 'Clinic deleted successfully' });
        } else {
            res.status(404).json({ message: 'Clinic not found' });
        }
    } catch (error) {
        console.error('Error deleting clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Thêm bác sĩ vào phòng khám
const addDoctorToClinic = async (req, res) => {
    try {
        const { clinicID, doctorID } = req.body;
        const success = await clinicModel.addDoctorToClinic(clinicID, doctorID);
        if (success) {
            res.status(201).json({ message: 'Doctor added to clinic successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add doctor to clinic' });
        }
    } catch (error) {
        console.error('Error adding doctor to clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Xóa bác sĩ khỏi phòng khám
const removeDoctorFromClinic = async (req, res) => {
    try {
        const { clinicID, doctorID } = req.params;

        const success = await clinicModel.removeDoctorFromClinic(clinicID, doctorID);

        if (success) {
            res.json({ message: 'Doctor removed from clinic successfully' });
        } else {
            res.status(404).json({ message: 'Clinic or doctor not found' });
        }
    } catch (error) {
        console.error('Error removing doctor from clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Lấy danh sách bác sĩ của một phòng khám
const getDoctorsByClinic = async (req, res) => {
    try {
        const { clinicID } = req.params;
        const doctors = await clinicModel.getDoctorsByClinic(clinicID);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors by clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Hàm lấy danh sách bác sĩ không thuộc phòng khám nào
const getDoctorsNotInClinic = async (req, res) => {
    try {
        const doctors = await clinicModel.getDoctorsNotInClinic();
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors not in clinic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Lấy danh sách bác sĩ theo khoảng thời gian
const getDoctorsByDateRange = async (req, res) => {
    try {
        const { clinicID } = req.params;
        const { startDate, endDate } = req.query;
        const doctors = await clinicModel.getDoctorsByDateRange(clinicID, startDate, endDate);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors by date range:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllClinics,
    getClinicByID,
    addClinic,
    updateClinic,
    deleteClinic,
    addDoctorToClinic,
    removeDoctorFromClinic,
    getDoctorsByClinic,
    getDoctorsNotInClinic,
    getDoctorsByDateRange,
};

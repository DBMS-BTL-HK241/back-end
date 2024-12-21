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

// Thêm bác sĩ
const addDoctor = async (req, res) => {
    try {
        const doctor = req.body;
        const result = await doctorModel.addDoctor(doctor);
        if (result) {
            res.status(201).json({ message: 'Doctor added successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add doctor' });
        }
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Sửa thông tin bác sĩ
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const result = await doctorModel.updateDoctor(id, updatedFields);
        if (result) {
            res.json({ message: 'Doctor updated successfully' });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Xóa bác sĩ
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await doctorModel.deleteDoctor(id);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Lấy danh sách bác sĩ với phân trang
const getDoctorsWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Page and limit must be positive integers' });
        }

        // Gọi hàm model để lấy tổng số bác sĩ
        const totalCount = await doctorModel.getTotalDoctorsCount();

        // Gọi hàm model để lấy danh sách bác sĩ
        const doctors = await doctorModel.getDoctorsWithPagination(page, limit);

        res.json({
            doctors: doctors,
            totalPages: Math.ceil(totalCount / limit), // Tính tổng số trang
        });
    } catch (error) {
        console.error('Error fetching doctors with pagination:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Tìm kiếm bác sĩ bằng tên
const searchDoctorsByName = async (req, res) => {
    try {
        const { name } = req.query;
        const doctors = await doctorModel.searchDoctorsByName(name);
        res.json(doctors);
    } catch (error) {
        console.error('Error searching doctors by name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Lấy thông tin bác sĩ bằng id
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await doctorModel.getDoctorById(id);
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error fetching doctor by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsWithPagination,
    searchDoctorsByName,
    getDoctorById,
};

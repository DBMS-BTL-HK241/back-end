const express = require('express');
const router = express.Router();
const {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsWithPagination,
    searchDoctorsByName,
    getDoctorById,
} = require('../controllers/doctorController.js');

// Lấy tất cả bác sĩ
router.get('/', getAllDoctors);

// Thêm bác sĩ
/*
{
    Name: 'Dr. John Smith',
    Specialty: 'Cardiology',
    PhoneNumber: '1234567890',
    ClinicAddress: '123 Heart Ave',
    WorkingHours: 'Mon-Fri 9:00 AM - 5:00 PM',
}
*/
router.post('/', addDoctor);

// Sửa thông tin bác sĩ
/*
{
    Name: 'Dr. John Smith',
    Specialty: 'Cardiology',
    PhoneNumber: '1234567890',
    ClinicAddress: '123 Heart Ave',
    WorkingHours: 'Mon-Fri 9:00 AM - 5:00 PM',
}
*/
router.put('/:id', updateDoctor);

// Xóa bác sĩ
router.delete('/:id', deleteDoctor);

// Lấy danh sách bác sĩ với phân trang
// { page = 1, limit = 10 }
router.get('/pagination', getDoctorsWithPagination);

// Tìm kiếm bác sĩ bằng tên
// /search?name=ABC
router.get('/search', searchDoctorsByName);

// Lấy thông tin bác sĩ bằng ID
router.get('/:id', getDoctorById);

module.exports = router;

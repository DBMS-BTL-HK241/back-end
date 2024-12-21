const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController.js');

// Lấy tất cả phòng khám
router.get('/', clinicController.getAllClinics);

// Lấy thông tin một phòng khám theo ID
router.get('/:id', clinicController.getClinicByID);

// Thêm mới một phòng khám
/*
{
    Name: 'Brain Health Center',
    Address: '654 Brain Rd',
    PhoneNumber: '9998887777',
    OpeningHours: 'Mon-Fri, 7:00 - 15:00',
}
*/
router.post('/', clinicController.addClinic);

// Chỉnh sửa thông tin phòng khám
/*
{
    Name: 'Brain Health Center',
    Address: '654 Brain Rd',
    PhoneNumber: '9998887777',
    OpeningHours: 'Mon-Fri, 7:00 - 15:00',
}
*/
router.put('/:id', clinicController.updateClinic);

// Xóa một phòng khám
router.delete('/:id', clinicController.deleteClinic);

// Thêm bác sĩ vào phòng khám
// (truyền clinicID và doctorID trong body).
router.post('/add-doctor', clinicController.addDoctorToClinic);

// Xóa bác sĩ khỏi phòng khám
// (truyền clinicID và doctorID trong body)
router.delete('/:clinicID/remove-doctor/:doctorID', clinicController.removeDoctorFromClinic);

// Lấy danh sách bác sĩ của một phòng khám
router.get('/:clinicID/doctors', clinicController.getDoctorsByClinic);

// Hàm lấy danh sách bác sĩ không thuộc phòng khám
router.get('/doctors/not-in-clinic', clinicController.getDoctorsNotInClinic);

// Lấy danh sách bác sĩ theo khoảng thời gian
// (truyền startDate và endDate qua query string).
router.get('/:clinicID/doctors/date-range', clinicController.getDoctorsByDateRange);

module.exports = router;

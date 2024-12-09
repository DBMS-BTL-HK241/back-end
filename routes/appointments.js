const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    statisticsMonthlyAppointments,
    calendarAppointments,
} = require('../controllers/appointmentController.js');

router.get('/', getAllAppointments);
router.get('/calendar', calendarAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/statistics/monthly', statisticsMonthlyAppointments);
module.exports = router;

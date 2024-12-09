const appointmentModel = require('../models/appointmentModel');

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const appointment = await appointmentModel.getAppointmentById(req.params.id);
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error fetching appointment by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createAppointment = async (req, res) => {
    try {
        const newAppointment = await appointmentModel.createAppointment({
            AppointmentID: Date.now(), // Tạo ID duy nhất
            ...req.body,
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await appointmentModel.updateAppointment(req.params.id, req.body);
        if (updatedAppointment) {
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        await appointmentModel.deleteAppointment(req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const statisticsMonthlyAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.statisticsMonthlyAppointments();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const calendarAppointments = async (req, res) => {
    try {
        const appointments = [
            {
                "AppointmentID": 1,
                "PatientID": 123,
                "DoctorID": 456,
                "ClinicID": 789,
                "AppointmentDate": "2024-12-10T10:00:00",
                "Status": "Scheduled"
            },
            {
                "AppointmentID": 2,
                "PatientID": 124,
                "DoctorID": 457,
                "ClinicID": 790,
                "AppointmentDate": "2024-12-11T14:00:00",
                "Status": "Scheduled"
            }
        ];
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    statisticsMonthlyAppointments,
    calendarAppointments,
};

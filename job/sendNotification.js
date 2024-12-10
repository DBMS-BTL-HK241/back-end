const sendEmail = require('../services/mailServices');
const { checkUpcomingAppointments } = require('../models/appointmentModel');
const moment = require('moment');

const sendAppointmentNotifications = async () => {
    const upcomingAppointments = await checkUpcomingAppointments();

    if (upcomingAppointments.length === 0) {
        console.log('No appointments for tomorrow.');
        return;
    }

    console.log('Appointments for tomorrow:');
    upcomingAppointments.forEach((appointment) => {
        console.log(`Appointment ID: ${appointment.AppointmentID}, Patient: ${appointment.PatientName}, Doctor: ${appointment.DoctorName}, Clinic: ${appointment.ClinicName}, Date: ${moment(appointment.AppointmentDate).format('MMMM Do YYYY, h:mm:ss a')}`);
    });

    for (const appointment of upcomingAppointments) {
        const appointmentDate = moment(appointment.AppointmentDate);
        const subject = `Reminder: Your Appointment Tomorrow (${appointmentDate.format('MMMM Do YYYY, h:mm A')})`;
        const text = `Dear ${appointment.PatientName},\n\nThis is a reminder that your appointment is scheduled for tomorrow with ${appointment.DoctorName} at ${appointment.ClinicName}, scheduled for ${moment(appointment.AppointmentDate).format('MMMM Do YYYY, h:mm:ss a')}.\nPlease be on time.\n\nBest regards,\n${appointment.ClinicName}`;
        try {
            await sendEmail(appointment.EMAIL, subject, text);
            console.log(`Email sent to Patient ${appointment.PatientName}`);
        } catch (error) {
            console.error(`Failed to send email to Patient ${appointment.PatientName}: ${error.message}`);
        }
    }
};


module.exports = sendAppointmentNotifications;
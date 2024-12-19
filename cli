#!/usr/bin/env node

const sendAppointmentNotifications = require('./job/sendNotification');
const createPatients = require('./migrations/Patients');
const createDoctors = require('./migrations/Doctors');
const createClinics = require('./migrations/Clinics');
const createAppointment = require('./migrations/Appointments');

const [, , command] = process.argv;

if (command === 'sendNotification') {
    sendAppointmentNotifications().then(() => {
        console.log('Notifications sent successfully.');
    }).catch((err) => {
        console.error('Error sending notifications:', err);
    });
} else if (command === 'createPatients') {
    createPatients()
        .then(() => {
            console.log('Patients created successfully.');
        })
        .catch((err) => {
            console.error('Error creating patients:', err);
        });
} else if (command === 'createDoctors') {
    createDoctors()
        .then(() => {
            console.log('Doctors created successfully.');
        })
        .catch((err) => {
            console.error('Error creating doctors:', err);
        });
} else if (command === 'createClinics') {
    createClinics()
        .then(() => {
            console.log('Clinics created successfully.');
        })
        .catch((err) => {
            console.error('Error creating Clinics:', err);
        });
} else if (command === 'createAppointment') {
    createAppointment()
        .then(() => {
            console.log('Appointment created successfully.');
        })
        .catch((err) => {
            console.error('Error creating Appointment:', err);
        });
}


else {
    console.log('Unknown command');
}

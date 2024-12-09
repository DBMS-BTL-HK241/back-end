#!/usr/bin/env node

const sendAppointmentNotifications = require('./job/sendNotification');

// Kiểm tra các tham số dòng lệnh
const [, , command] = process.argv;

if (command === 'sendNotification') {
    sendAppointmentNotifications().then(() => {
        console.log('Notifications sent successfully.');
    }).catch((err) => {
        console.error('Error sending notifications:', err);
    });
} else {
    console.log('Unknown command. Use "sendNotification" to send appointment notifications.');
}

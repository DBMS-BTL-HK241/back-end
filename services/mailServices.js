const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'localhost',
    port: process.env.MAIL_PORT || 1025,
    secure: process.env.MAIL_SECURE === 'true',
    tls: {
        rejectUnauthorized: process.env.MAIL_TLS_REJECT_UNAUTHORIZED === 'true',
    }
});

const sendEmail = (recipient, subject, text) => {
    const mailOptions = {
        from: process.env.MAIL_FROM || 'no-reply@mailpit.local',
        to: recipient,
        subject: subject,
        text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
};

module.exports = sendEmail;

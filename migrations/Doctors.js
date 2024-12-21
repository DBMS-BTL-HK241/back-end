const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

const {addDoctor} = require('../models/doctorModel');

async function createDoctors() {

    const doctors = [
        {
            DoctorID: uuidv4(),
            Name: 'Dr. John Smith',
            Specialty: 'Cardiology',
            PhoneNumber: '1234567890',
            ClinicAddress: '123 Heart Ave',
            WorkingHours: 'Mon-Fri, 9:00 - 15:00',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Alice Brown',
            Specialty: 'Dermatology',
            PhoneNumber: '0987654321',
            ClinicAddress: '456 Skin St',
            WorkingHours: 'Tue-Thu, 10:00 - 14:00',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Emily Davis',
            Specialty: 'Pediatrics',
            PhoneNumber: '1112223333',
            ClinicAddress: '789 Child Ln',
            WorkingHours: 'Mon-Sat, 8:00 - 12:00',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Michael Johnson',
            Specialty: 'Orthopedics',
            PhoneNumber: '4445556666',
            ClinicAddress: '321 Bone Blvd',
            WorkingHours: 'Wed-Sun, 1:00 - 17:00',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Sarah Lee',
            Specialty: 'Neurology',
            PhoneNumber: '9998887777',
            ClinicAddress: '654 Brain Rd',
            WorkingHours: 'Mon-Fri, 7:00 - 13:00',
        },
    ];

    let x = 0;
    for (const doctor of doctors) {
        try {
            const result = await addDoctor(doctor);
            if (result) {
                x++;
            } else {
                console.error('Failed to add doctor');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            return;
        }
    }
    console.log(`${x} doctors added successfully.`)
}



module.exports = createDoctors;



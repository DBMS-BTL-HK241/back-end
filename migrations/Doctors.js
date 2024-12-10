const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

async function createDoctors() {

    const doctors = [
        {
            DoctorID: uuidv4(),
            Name: 'Dr. John Smith',
            Specialty: 'Cardiology',
            PhoneNumber: '1234567890',
            ClinicAddress: '123 Heart Ave',
            WorkingHours: 'Mon-Fri 9:00 AM - 5:00 PM',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Alice Brown',
            Specialty: 'Dermatology',
            PhoneNumber: '0987654321',
            ClinicAddress: '456 Skin St',
            WorkingHours: 'Tue-Thu 10:00 AM - 4:00 PM',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Emily Davis',
            Specialty: 'Pediatrics',
            PhoneNumber: '1112223333',
            ClinicAddress: '789 Child Ln',
            WorkingHours: 'Mon-Sat 8:00 AM - 2:00 PM',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Michael Johnson',
            Specialty: 'Orthopedics',
            PhoneNumber: '4445556666',
            ClinicAddress: '321 Bone Blvd',
            WorkingHours: 'Wed-Sun 1:00 PM - 7:00 PM',
        },
        {
            DoctorID: uuidv4(),
            Name: 'Dr. Sarah Lee',
            Specialty: 'Neurology',
            PhoneNumber: '9998887777',
            ClinicAddress: '654 Brain Rd',
            WorkingHours: 'Mon-Fri 7:00 AM - 3:00 PM',
        },
    ];

    for (const doctor of doctors) {
        const query = `
          CREATE (d:Doctor {
            DoctorID: $DoctorID,
            Name: $Name,
            Specialty: $Specialty,
            PhoneNumber: $PhoneNumber,
            ClinicAddress: $ClinicAddress,
            WorkingHours: $WorkingHours
          })
        `;
        await runQuery(query, doctor);
    }
}



module.exports = createDoctors;



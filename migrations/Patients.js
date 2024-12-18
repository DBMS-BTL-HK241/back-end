const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

async function createPatients() {

    const patients = [
        {
            PatientID: uuidv4(),
            Name: 'John Doe',
            DateOfBirth: '1990-01-01',
            Gender: 'Nam',
            Address: '123 Main St',
            PhoneNumber: '1234567890',
            EmergencyContact: 'Jane Doe - 9876543210',
            EMAIL: 'john.doe@example.com',
        },
        {
            PatientID: uuidv4(),
            Name: 'Jane Smith',
            DateOfBirth: '1985-05-15',
            Gender: 'Nữ',
            Address: '456 Elm St',
            PhoneNumber: '0987654321',
            EmergencyContact: 'John Smith - 1122334455',
            EMAIL: 'jane.smith@example.com',
        },
        {
            PatientID: uuidv4(),
            Name: 'Alex Johnson',
            DateOfBirth: '1995-09-09',
            Gender: 'Khác',
            Address: '789 Oak St',
            PhoneNumber: '1112223333',
            EmergencyContact: 'Chris Johnson - 5556667777',
            EMAIL: 'alex.johnson@example.com',
        },
        {
            PatientID: uuidv4(),
            Name: 'Emily Davis',
            DateOfBirth: '2000-12-25',
            Gender: 'Nữ',
            Address: '321 Maple St',
            PhoneNumber: '4445556666',
            EmergencyContact: 'Sarah Davis - 7778889999',
            EMAIL: 'emily.davis@example.com',
        },
        {
            PatientID: uuidv4(),
            Name: 'Michael Brown',
            DateOfBirth: '1980-07-20',
            Gender: 'Nam',
            Address: '654 Pine St',
            PhoneNumber: '9998887777',
            EmergencyContact: 'Laura Brown - 3332221111',
            EMAIL: 'michael.brown@example.com',
        },
    ];

    // Tạo dữ liệu trong Neo4j
    for (const patient of patients) {
        const query = `
        CREATE (p:Patient {
          PatientID: $PatientID,
          Name: $Name,
          DateOfBirth: $DateOfBirth,
          Gender: $Gender,
          Address: $Address,
          PhoneNumber: $PhoneNumber,
          EmergencyContact: $EmergencyContact,
          EMAIL: $EMAIL
        })
      `;

        await runQuery(query, patient);
    }
}



module.exports = createPatients;



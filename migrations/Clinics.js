const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

async function createClinics() {

    const clinics = [
        {
            ClinicID: uuidv4(),
            Name: 'Heart Health Clinic',
            Address: '123 Heart Ave',
            PhoneNumber: '1234567890',
            OpeningHours: 'Mon-Fri 8:00 AM - 6:00 PM',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Skin Care Clinic',
            Address: '456 Skin St',
            PhoneNumber: '0987654321',
            OpeningHours: 'Mon-Sat 9:00 AM - 5:00 PM',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Pediatric Care Center',
            Address: '789 Child Ln',
            PhoneNumber: '1112223333',
            OpeningHours: 'Mon-Sun 7:00 AM - 3:00 PM',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Bone & Joint Clinic',
            Address: '321 Bone Blvd',
            PhoneNumber: '4445556666',
            OpeningHours: 'Tue-Sun 10:00 AM - 7:00 PM',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Brain Health Center',
            Address: '654 Brain Rd',
            PhoneNumber: '9998887777',
            OpeningHours: 'Mon-Fri 7:00 AM - 5:00 PM',
        },
    ];

    for (const clinic of clinics) {
        const query = `
          CREATE (c:Clinic {
            ClinicID: $ClinicID,
            Name: $Name,
            Address: $Address,
            PhoneNumber: $PhoneNumber,
            OpeningHours: $OpeningHours
          })
        `;

        await runQuery(query, clinic);
    }
}



module.exports = createClinics;



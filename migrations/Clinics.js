const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

async function createClinics() {

    const clinics = [
        {
            ClinicID: uuidv4(),
            Name: 'Heart Health Clinic',
            Address: '123 Heart Ave',
            PhoneNumber: '1234567890',
            OpeningHours: 'Mon-Fri, 08:00 - 16:00',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Skin Care Clinic',
            Address: '456 Skin St',
            PhoneNumber: '0987654321',
            OpeningHours: 'Mon-Sat, 09:00 - 15:00',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Pediatric Care Center',
            Address: '789 Child Ln',
            PhoneNumber: '1112223333',
            OpeningHours: 'Mon-Sun, 07:00 - 23:00',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Bone & Joint Clinic',
            Address: '321 Bone Blvd',
            PhoneNumber: '4445556666',
            OpeningHours: 'Tue-Sun, 10:00 - 17:00',
        },
        {
            ClinicID: uuidv4(),
            Name: 'Brain Health Center',
            Address: '654 Brain Rd',
            PhoneNumber: '9998887777',
            OpeningHours: 'Mon-Fri, 07:00 - 15:00',
        },
    ];

    for (const clinic of clinics) {
        const query = `
          CREATE (c:Clinic {
            ClinicID: $ClinicID,
            Name: $Name,
            Address: $Address,
            PhoneNumber: $PhoneNumber,
            OpeningHours: $OpeningHours,
            CreatedAt: datetime()
          })
        `;

        await runQuery(query, clinic);
    }
}



module.exports = createClinics;



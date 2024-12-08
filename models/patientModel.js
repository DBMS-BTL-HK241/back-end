const { runQuery } = require('../config/neo4j');

// Hàm lấy tất cả bệnh nhân
const getAllPatients = async () => {
    const query = `
        MATCH (p:Patient) 
        RETURN p.PatientID AS PatientID, p.Name AS Name, p.DateOfBirth AS DateOfBirth, 
               p.Gender AS Gender, p.Address AS Address, p.PhoneNumber AS PhoneNumber, 
               p.EmergencyContact AS EmergencyContact
    `;
    const result = await runQuery(query);
    return result.records.map((record) => ({
        PatientID: record.get('PatientID'),
        Name: record.get('Name'),
        DateOfBirth: record.get('DateOfBirth'),
        Gender: record.get('Gender'),
        Address: record.get('Address'),
        PhoneNumber: record.get('PhoneNumber'),
        EmergencyContact: record.get('EmergencyContact'),
    }));
};
module.exports = {
    getAllPatients,
};

const { runQuery } = require('../config/neo4j');

// Hàm lấy tất cả phòng khám
const getAllClinics = async () => {
    const query = `
        MATCH (c:Clinic) 
        RETURN c.ClinicID AS ClinicID, c.Name AS Name, c.Address AS Address, 
               c.PhoneNumber AS PhoneNumber, c.OpeningHours AS OpeningHours
    `;
    const result = await runQuery(query);
    return result.records.map((record) => ({
        ClinicID: record.get('ClinicID'),
        Name: record.get('Name'),
        Address: record.get('Address'),
        PhoneNumber: record.get('PhoneNumber'),
        OpeningHours: record.get('OpeningHours'),
    }));
};

module.exports = {
    getAllClinics,
};

const { runQuery } = require('../config/neo4j');

// Hàm lấy tất cả bác sĩ
const getAllDoctors = async () => {
    const query = `
        MATCH (d:Doctor) 
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, d.ClinicAddress AS ClinicAddress, 
               d.WorkingHours AS WorkingHours
    `;
    const result = await runQuery(query);
    return result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        ClinicAddress: record.get('ClinicAddress'),
        WorkingHours: record.get('WorkingHours'),
    }));
};
module.exports = {
    getAllDoctors,
};

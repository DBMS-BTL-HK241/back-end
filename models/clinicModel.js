const { v4: uuidv4 } = require('uuid');
const { runQuery } = require('../config/neo4j');

// Hàm lấy tất cả phòng khám
const getAllClinics = async () => {
    const query = `
        MATCH (c:Clinic)
        RETURN c.ClinicID AS ClinicID, c.Name AS Name, c.Address AS Address, 
               c.PhoneNumber AS PhoneNumber, c.OpeningHours AS OpeningHours
        ORDER BY c.CreatedAt DESC
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

// Hàm thêm phòng khám
const addClinic = async (clinic) => {
    const query = `
        CREATE (c:Clinic {
            ClinicID: $ClinicID,
            Name: $Name,
            Address: $Address,
            PhoneNumber: $PhoneNumber,
            OpeningHours: $OpeningHours,
            CreatedAt: datetime()
        })
        RETURN c
    `;
    const params = { ClinicID: uuidv4(), ...clinic };
    const result = await runQuery(query, params);
    return result.records.length > 0;
};

// Hàm chỉnh sửa phòng khám
const updateClinic = async (clinicID, updatedFields) => {
    const setFields = Object.keys(updatedFields)
        .map((key) => `c.${key} = $${key}`)
        .join(', ');

    const query = `
        MATCH (c:Clinic {ClinicID: $ClinicID})
        SET ${setFields}
        RETURN c
    `;

    const params = { ClinicID: clinicID, ...updatedFields };
    const result = await runQuery(query, params);
    return result.records.length > 0;
};

// Hàm xóa phòng khám
const deleteClinic = async (id) => {
    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID })
        DELETE c
    `;
    await runQuery(query, { ClinicID: id });
    return true;
};

// Hàm thêm bác sĩ vào trạm xá
const addDoctorToClinic = async (clinicID, doctorID) => {
    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID }), (d:Doctor { DoctorID: $DoctorID })
        MERGE (c)-[r:HAS_DOCTOR]->(d)
        ON CREATE SET r.startWorkDate = date()
        RETURN r
    `;
    const params = { ClinicID: clinicID, DoctorID: doctorID };
    const result = await runQuery(query, params);
    return result.records.length > 0;
};

// Hàm xóa bác sĩ khỏi trạm xá
const removeDoctorFromClinic = async (clinicID, doctorID) => {

    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID })-[r:HAS_DOCTOR]->(d:Doctor { DoctorID: $DoctorID })
        DELETE r
        RETURN r
    `;
    const params = { ClinicID: clinicID, DoctorID: doctorID };

    const result = await runQuery(query, params);

    return result.records.length > 0;
};

// Hàm lấy danh sách bác sĩ của một trạm xá
const getDoctorsByClinic = async (clinicID) => {
    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID })-[r:HAS_DOCTOR]->(d:Doctor)
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, 
               d.WorkingHours AS WorkingHours, 
               toString(r.startWorkDate) AS startWorkDate
        ORDER BY r.startWorkDate DESC
    `;
    const params = { ClinicID: clinicID };
    const result = await runQuery(query, params)
    return result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        WorkingHours: record.get('WorkingHours'),
        StartWorkDate: record.get('startWorkDate'),
    }));
};

// Truy vấn lấy bác sĩ không thuộc phòng khám nào
const getDoctorsNotInClinic = async () => {
    const query = `
        MATCH (d:Doctor)
        WHERE NOT (d)<-[:HAS_DOCTOR]-(:Clinic)
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, d.WorkingHours AS WorkingHours
        ORDER BY d.Name ASC
    `;
    const result = await runQuery(query);
    return result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        WorkingHours: record.get('WorkingHours'),
    }));
};


// Hàm lấy danh sách bác sĩ được thêm vào trong khoảng thời gian cụ thể
const getDoctorsByDateRange = async (clinicID, startDate, endDate) => {
    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID })-[r:HAS_DOCTOR]->(d:Doctor)
        WHERE r.startWorkDate >= date($startDate) AND r.startWorkDate <= date($endDate)
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, r.startWorkDate AS startWorkDate
        ORDER BY r.startWorkDate DESC
    `;
    const params = { ClinicID: clinicID, startDate, endDate };
    const result = await runQuery(query, params);
    return result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        startWorkDate: record.get('startWorkDate'),
    }));
};

// Hàm lấy thông tin phòng khám theo ID
const getClinicByID = async (id) => {
    const query = `
        MATCH (c:Clinic { ClinicID: $ClinicID })
        RETURN c.ClinicID AS ClinicID, c.Name AS Name, c.Address AS Address, 
               c.PhoneNumber AS PhoneNumber, c.OpeningHours AS OpeningHours
    `;
    const params = { ClinicID: id };
    const result = await runQuery(query, params);
    if (result.records.length === 0) {
        return []; // Không tìm thấy phòng khám
    }
    const record = result.records[0];
    return {
        ClinicID: record.get('ClinicID'),
        Name: record.get('Name'),
        Address: record.get('Address'),
        PhoneNumber: record.get('PhoneNumber'),
        OpeningHours: record.get('OpeningHours'),
    };
};

module.exports = {
    getAllClinics,
    addClinic,
    updateClinic,
    deleteClinic,
    addDoctorToClinic,
    removeDoctorFromClinic,
    getDoctorsByClinic,
    getDoctorsNotInClinic,
    getDoctorsByDateRange,
    getClinicByID
};

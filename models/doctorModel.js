const { runQuery } = require('../config/neo4j');
const { v4: uuidv4 } = require('uuid');

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

// Hàm thêm bác sĩ
const addDoctor = async (doctor) => {
    const query = `
        CREATE (d:Doctor {
            DoctorID: $DoctorID,
            Name: $Name,
            Specialty: $Specialty,
            PhoneNumber: $PhoneNumber,
            ClinicAddress: $ClinicAddress,
            WorkingHours: $WorkingHours,
            CreatedAt: datetime()
        })
        RETURN d
    `;
    const params = { DoctorID: uuidv4(), ...doctor };
    const result = await runQuery(query, params);
    return result.records.length > 0;
};

// Hàm sửa thông tin bác sĩ
const updateDoctor = async (doctorID, updatedFields) => {
    const setFields = Object.keys(updatedFields)
        .map((key) => `d.${key} = $${key}`)
        .join(', ');

    const query = `
        MATCH (d:Doctor {DoctorID: $DoctorID})
        SET ${setFields}
        RETURN d
    `;

    const params = { DoctorID: doctorID, ...updatedFields };
    const result = await runQuery(query, params);
    return result.records.length > 0;
};

// Hàm xóa bác sĩ
const deleteDoctor = async (id) => {
    const query = `
        MATCH (d:Doctor {DoctorID: $DoctorID})
        DETACH DELETE d
    `;
    await runQuery(query, { DoctorID: id });
    return true;
};

// Hàm lấy tổng số bác sĩ
const getTotalDoctorsCount = async () => {
    const query = `
        MATCH (d:Doctor)
        RETURN count(d) AS totalCount
    `;
    const result = await runQuery(query);
    const totalCount = result.records[0].get('totalCount').toNumber(); // Chuyển sang kiểu số
    return totalCount;
};

// Hàm lấy danh sách bác sĩ với phân trang
const getDoctorsWithPagination = async (page, limit) => {
    const skip = (page - 1) * limit;

    const query = `
        MATCH (d:Doctor)
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, d.ClinicAddress AS ClinicAddress, 
               d.WorkingHours AS WorkingHours
        ORDER BY d.CreatedAt DESC
        SKIP toInteger($skip)
        LIMIT toInteger($limit)
    `;
    const params = { skip, limit };
    const result = await runQuery(query, params);

    const doctors = result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        ClinicAddress: record.get('ClinicAddress'),
        WorkingHours: record.get('WorkingHours'),
    }));

    return doctors;
};

// Tìm kiếm bác sĩ bằng tên
const searchDoctorsByName = async (searchName) => {
    const query = `
        MATCH (d:Doctor)
        WHERE toLower(d.Name) CONTAINS toLower($searchName)
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, d.ClinicAddress AS ClinicAddress, 
               d.WorkingHours AS WorkingHours
    `;
    const params = { searchName: searchName.toLowerCase() }; // Đảm bảo searchName cũng được chuyển thành chữ thường
    const result = await runQuery(query, params);
    return result.records.map((record) => ({
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        ClinicAddress: record.get('ClinicAddress'),
        WorkingHours: record.get('WorkingHours'),
    }));
};


// Lấy thông tin bác sĩ bằng id
const getDoctorById = async (id) => {
    const query = `
        MATCH (d:Doctor {DoctorID: $DoctorID})
        RETURN d.DoctorID AS DoctorID, d.Name AS Name, d.Specialty AS Specialty, 
               d.PhoneNumber AS PhoneNumber, d.ClinicAddress AS ClinicAddress, 
               d.WorkingHours AS WorkingHours
    `;
    const params = { DoctorID: id };
    const result = await runQuery(query, params);

    if (result.records.length === 0) {
        return []; // Trả về null nếu không tìm thấy bác sĩ
    }

    const record = result.records[0];
    return {
        DoctorID: record.get('DoctorID'),
        Name: record.get('Name'),
        Specialty: record.get('Specialty'),
        PhoneNumber: record.get('PhoneNumber'),
        ClinicAddress: record.get('ClinicAddress'),
        WorkingHours: record.get('WorkingHours')
    };
};

module.exports = {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsWithPagination,
    getTotalDoctorsCount,
    searchDoctorsByName,
    getDoctorById
};

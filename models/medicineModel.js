const { runQuery } = require('../config/neo4j');

// Thêm một loại thuốc mới
const createMedicine = async (MedicationID, Name, Dosage, Administration, SideEffects, Quantity = 0) => {
    const query = `
        CREATE (m:Medicine {
            MedicationID: $MedicationID,
            Name: $Name,
            Dosage: $Dosage,
            Administration: $Administration,
            SideEffects: $SideEffects,
            Quantity: $Quantity
        }) RETURN m
    `;
    const params = { MedicationID, Name, Dosage, Administration, SideEffects, Quantity };
    const result = await runQuery(query, params);
    return result.records[0].get('m').properties;
};

// Lấy danh sách tất cả các loại thuốc
const getAllMedicines = async () => {
    const query = 'MATCH (m:Medicine) RETURN m';
    const result = await runQuery(query);
    return result.records.map(record => record.get('m').properties);
};

// Tìm thuốc theo ID
const getMedicineByID = async (MedicationID) => {
    const query = 'MATCH (m:Medicine {MedicationID: $MedicationID}) RETURN m';
    const params = { MedicationID };
    const result = await runQuery(query, params);
    if (result.records.length === 0) return null;
    return result.records[0].get('m').properties;
};

// Cập nhật thông tin thuốc
const updateMedicine = async (updates) => {
    const {id, name, dosage, administration, sideEffects , quantity} = updates;
    const query = `
        MATCH (m:Medicine) WHERE id(m) = $id
        SET m += {Name: $name, Dosage: $dosage, Administration: $administration, SideEffects: $sideEffects, Quantity: $quantity}    
        RETURN m
    `;
    const params = { id: parseInt(id), name, dosage, administration, sideEffects, quantity };
    const result = await runQuery(query, params);
    return result.records[0].get('m').properties;
};

// Xóa thuốc theo ID
const deleteMedicine = async (MedicationID) => {
    const query = 'MATCH (m:Medicine {MedicationID: $MedicationID}) DELETE m RETURN COUNT(m) AS deletedCount';
    const params = { MedicationID };
    const result = await runQuery(query, params);
    return result.records[0].get('deletedCount').toInt() > 0;
};

module.exports = {
    createMedicine,
    getAllMedicines,
    getMedicineByID,
    updateMedicine,
    deleteMedicine
};
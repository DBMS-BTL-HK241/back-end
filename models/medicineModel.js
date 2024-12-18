const { runQuery } = require('../config/neo4j');

// Thêm một loại thuốc mới
const createMedicine = async (Name, Dosage, Administration, SideEffects, Quantity = 0) => {
    const query = `
        CREATE (m:Medicine {
            Name: $Name,
            Dosage: $Dosage,
            Administration: $Administration,
            SideEffects: $SideEffects,
            Quantity: $Quantity
        }) RETURN m
    `;
    const params = { Name, Dosage, Administration, SideEffects, Quantity };
    console.log(params);
    const result = await runQuery(query, params);
    return result.records[0].get('m').properties;
};

// Lấy danh sách tất cả các loại thuốc
const getAllMedicines = async () => {
    const query = `MATCH (m:Medicine) RETURN id(m), m.Name AS Name, m.Dosage AS Dosage, m.Administration AS Administration, m.SideEffects AS SideEffects, m.Quantity AS Quantity`;
    const result = await runQuery(query);

 
    return result.records.map(record => ({
        id: record.get('id(m)').toInt(),
        name: record.get('Name'),
        dosage: record.get('Dosage'),
        administration: record.get('Administration'),
        sideEffects: record.get('SideEffects'),
        quantity: record.get('Quantity')
    }));
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
const updateMedicine = async (MedicationID, updates) => {
    const { Name, Dosage, Administration, SideEffects , Quantity} = updates;
    console.log('updates', updates);
    const query = `
        MATCH (m:Medicine) WHERE id(m) = $MedicationID
        SET m += {Name: $Name, Dosage: $Dosage, Administration: $Administration, SideEffects: $SideEffects, Quantity: $Quantity}    
        RETURN m
    `;
    const params = { MedicationID, Name, Dosage, Administration, SideEffects , Quantity};
    const result = await runQuery(query, params);
    return result.records[0].get('m').properties;
};

// Xóa thuốc theo ID
const deleteMedicine = async (id) => {
    const query = 'MATCH (m:Medicine) WHERE id(m) = $id DELETE m RETURN COUNT(m) AS deletedCount';
    const params = { id: parseInt(id) };
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
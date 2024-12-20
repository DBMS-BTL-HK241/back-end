const { runQuery } = require('../config/neo4j');

// Thêm một loại thuốc mới
const createMedicine = async ( Name, Dosage, Administration, SideEffects, Quantity = 0, Price) => {
    const query = `
        CREATE (m:Medicine {
            name: $Name,
            dosage: $Dosage,
            administration: $Administration,
            sideEffects: $SideEffects,
            quantity: $Quantity,
            price: $Price
        }) RETURN m
    `;
    const params = { Name, Dosage, Administration, SideEffects, Quantity , Price};
    console.log('params', params);
    const result = await runQuery(query, params);
    return {
        id: result.records[0].get('m').identity.toInt(),
        name: result.records[0].get('m').properties.name,
        dosage: result.records[0].get('m').properties.dosage,
        administration: result.records[0].get('m').properties.administration,
        sideEffects: result.records[0].get('m').properties.sideEffects,
        quantity: result.records[0].get('m').properties.quantity,
        price: result.records[0].get('m').properties.price,
    };
};

// Lấy danh sách tất cả các loại thuốc
const getAllMedicines = async () => {
    const query = 'MATCH (m:Medicine) RETURN m';
    const result = await runQuery(query);
    return result.records.map(record => ({
        id: record.get('m').identity.toInt(),
        name: record.get('m').properties.name,
        dosage: record.get('m').properties.dosage,
        administration: record.get('m').properties.administration,
        sideEffects: record.get('m').properties.sideEffects,
        quantity: record.get('m').properties.quantity,
        price: record.get('m').properties.price,
    }));
};

// Tìm thuốc theo ID
const getMedicineByID = async (id) => {
    const query = 'MATCH (m:Medicine) WHERE id(m) = $id RETURN m';
    const params = { id: parseInt(id) };
    const result = await runQuery(query, params);
    if (result.records.length === 0) return null;
    return {
        id: result.records[0].get('m').identity.toInt(),
        name: result.records[0].get('m').properties.name,
        dosage: result.records[0].get('m').properties.dosage,
        administration: result.records[0].get('m').properties.administration,
        sideEffects: result.records[0].get('m').properties.sideEffects,
        quantity: result.records[0].get('m').properties.quantity,
        price: result.records[0].get('m').properties.price,
    };
};

// Cập nhật thông tin thuốc
const updateMedicine = async (updates) => {
    const {id, name, dosage, administration, sideEffects , quantity, price} = updates;
    console.log('updates', updates);
    console.log('id', id);
    const query = `
        MATCH (m:Medicine) WHERE id(m) = $id
        SET m += {name: $name, dosage: $dosage, administration: $administration, sideEffects: $sideEffects, quantity: $quantity, price: $price}    
        RETURN m
    `;
    const params = { id: parseInt(id), name, dosage, administration, sideEffects, quantity, price };
    const result = await runQuery(query, params);
    return {
        id: result.records[0].get('m').identity.toInt(),
        name: result.records[0].get('m').properties.name,
        dosage: result.records[0].get('m').properties.dosage,
        administration: result.records[0].get('m').properties.administration,
        sideEffects: result.records[0].get('m').properties.sideEffects,
        quantity: result.records[0].get('m').properties.quantity,
        price: result.records[0].get('m').properties.price,
    };
};

// Xóa thuốc theo ID
const deleteMedicine = async (id) => {
    const query = 'MATCH (m:Medicine)  WHERE id(m) = $id DELETE m RETURN COUNT(m) AS deletedCount';
    const params = { id };
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
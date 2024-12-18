const { session } = require('../config/neo4j');

// Function to create a new bill
const createBill = async (patientName, doctorName, amount, status, dateOfVisit, symptoms, disease, medicines) => {
    const result = await session.run(
        `CREATE (b:Bill {
            patientName: $patientName,
            doctorName: $doctorName,
            amount: $amount,
            status: $status,
            dateOfVisit: $dateOfVisit,
            symptoms: $symptoms,
            disease: $disease,
            medicines: $medicines
        }) 
        RETURN b`,
        { patientName, doctorName, amount, status, dateOfVisit, symptoms, disease, medicines }
    );
    return result.records[0].get('b').properties;
};

// Function to find a bill by its ID (or other unique identifiers)
const findBillById = async (billId) => {
    const result = await session.run(
        'MATCH (b:Bill {id: $billId}) RETURN b',
        { billId }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get('b').properties;
};

// Function to find all bills for a specific patient (optional additional function)
const findBillsByPatientName = async (patientName) => {
    const result = await session.run(
        'MATCH (b:Bill {patientName: $patientName}) RETURN b',
        { patientName }
    );
    return result.records.map(record => record.get('b').properties);
};

module.exports = { createBill, findBillById, findBillsByPatientName };

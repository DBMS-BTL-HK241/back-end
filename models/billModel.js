const { v4: uuidv4 } = require('uuid');
const { session } = require('../config/neo4j');

// Function to create a new bill
const createBill = async (patientName, phoneNumber, address, dateOfVisit, doctorName, specialization, symptoms, disease, medicines, amount, status) => {
    const id = uuidv4();
    const result = await session.run(
        `CREATE (b:Bill {
            id: $id,
            patientName: $patientName,
            phoneNumber: $phoneNumber,
            address: $address,
            dateOfVisit: $dateOfVisit,
            doctorName: $doctorName,
            specialization: $specialization,
            symptoms: $symptoms,
            disease: $disease,
            medicines: $medicines,
            amount: $amount,
            status: $status
        }) 
        RETURN b`,
        {id, patientName, phoneNumber, address, dateOfVisit, doctorName, specialization, symptoms, disease, medicines, amount, status}
    );
    return result.records[0].get('b').properties;
};

// Function to find all invoices
const findAllInvoices = async () => {
    const result = await session.run(
        'MATCH (b:Bill) RETURN b'
    );
    return result.records.map(record => record.get('b').properties);
};

// Function to update an invoice by ID
const findByIdAndUpdate = async (id, updatedData) => {
    const { patientName, phoneNumber, address, dateOfVisit, doctorName, specialization, symptoms, disease, medicines, amount, status } = updatedData;
    const result = await session.run(
        `MATCH (b:Bill {id: $id})
        SET b.patientName = $patientName,
            b.phoneNumber = $phoneNumber,
            b.address = $address,
            b.dateOfVisit = $dateOfVisit,
            b.doctorName = $doctorName,
            b.specialization = $specialization,
            b.symptoms = $symptoms,
            b.disease = $disease,
            b.medicines = $medicines,
            b.amount = $amount,
            b.status = $status
        RETURN b`,
        { id, patientName, phoneNumber, address, dateOfVisit, doctorName, specialization, symptoms, disease, medicines, amount, status }
    );

    if (result.records.length === 0) {
        throw new Error('Invoice not found');
    }
    return result.records[0].get('b').properties;
};

const getLastMonthRevenue = async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const formattedDate = oneMonthAgo.toISOString().split("T")[0]; // YYYY-MM-DD format

    const result = await session.run(
        `MATCH (b:Bill)
        WHERE b.dateOfVisit >= $formattedDate
        RETURN b.dateOfVisit AS date, b.amount AS amount`,
        { formattedDate }
    );

    return result.records.map(record => ({
        date: record.get('date'),
        amount: parseFloat(record.get('amount')),
    }));
};

// Function to delete all bills
const deleteAllBills = async () => {
    const result = await session.run(
        'MATCH (b:Bill) DETACH DELETE b'
    );
    return result.summary.counters.nodesDeleted; // Returns the number of deleted nodes
};

module.exports = { createBill, findAllInvoices, findByIdAndUpdate, getLastMonthRevenue, deleteAllBills };

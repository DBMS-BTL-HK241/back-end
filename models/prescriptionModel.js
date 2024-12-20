const { runQuery } = require('../config/neo4j');

// Create a new prescription
const createPrescription = async ({ doctorName, patientName, medicines }) => {
  const query = `
    CREATE (p:Prescription { 
      date: date(), 
      doctorName: $doctorName, 
      patientName: $patientName 
    })
    WITH p
    UNWIND $medicines AS med
    MATCH (m:Medicine {Name: med.name})
    MERGE (p)-[:CONTAINS {quantity: med.quantity, price: med.price}]->(m)
    RETURN p
  `;
  const params = { doctorName, patientName, medicines };
  const result = await runQuery(query, params);
  return result.records[0].get("p").properties;
};

// Get all prescriptions
const getAllPrescriptions = async () => {
  const query = `
    MATCH (p:Prescription)
    OPTIONAL MATCH (p)-[c:CONTAINS]->(m:Medicine)
    RETURN 
      id(p) AS prescriptionId,
      p.doctorName AS doctorName,
      p.patientName AS patientName,
      p.date AS date,
      COLLECT({
        medicineId: id(m),
        medicineName: m.Name,
        price: c.price,
        quantity: c.quantity
      }) AS medicines
  `;
  const result = await runQuery(query);

  return result.records.map(record => ({
    id: record.get("prescriptionId").low, // Lấy ID hóa đơn
    doctorName: record.get("doctorName"), // Tên bác sĩ
    patientName: record.get("patientName"), // Tên bệnh nhân
    date: record.get("date"), // Ngày lập hóa đơn
    medicines: record.get("medicines").map(medicine => ({
      medicineId: medicine.medicineId.low, // Lấy ID thuốc
      medicineName: medicine.medicineName, // Tên thuốc
      price: medicine.price || 0, // Giá thuốc
      quantity: medicine.quantity.low, // Số lượng
    })),
  }));
};

// Get a prescription by ID
const getPrescriptionById = async (id) => {
  const query = `
    MATCH (p:Prescription)
    WHERE id(p) = $id
    OPTIONAL MATCH (p)-[c:CONTAINS]->(m:Medicine)
    RETURN 
      p { 
        id: id(p), 
        doctorName: p.doctorName, 
        patientName: p.patientName, 
        date: p.date 
      } AS prescription,
      COLLECT(m { 
        id: id(m), 
        name: m.Name, 
        price: c.price, 
        quantity: c.quantity 
      }) AS medicines
  `;
  const params = { id };
  const result = await runQuery(query);

  if (result.records.length === 0) return null;

  const record = result.records[0];
  const prescription = record.get("prescription");
  const medicines = record.get("medicines");

  return {
    id: prescription.id.low,
    date: prescription.date,
    doctorName: prescription.doctorName,
    patientName: prescription.patientName,
    medicines: medicines.map(med => ({
      medicineId: med.id.low,
      medicineName: med.name,
      price: med.price || 0,
      quantity: med.quantity.low,
    })),
  };
};

// Update a prescription
const updatePrescription = async (id, updates) => {
  const query = `
    MATCH (p:Prescription)
    WHERE id(p) = $id
    SET p += $updates
    RETURN p
  `;
  const params = { id, updates };
  const result = await runQuery(query, params);
  if (result.records.length === 0) return null;

  return result.records[0].get("p").properties;
};

// Delete a prescription
const deletePrescription = async (id) => {
  const query = `
    MATCH (p:Prescription)
    WHERE id(p) = $id
    DETACH DELETE p
    RETURN COUNT(p) AS deletedCount
  `;
  const params = { id };
  const result = await runQuery(query, params);
  return result.records[0].get("deletedCount").toInt() > 0;
};

module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
};

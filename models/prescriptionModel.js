const driver = require("../config/db");

const getPrescriptionById = async (prescriptionId) => {
  const session = driver.session();

  try {
    const query = `
      MATCH (p:Prescription {id: $prescriptionId})
      OPTIONAL MATCH (doc:User)-[:PRESCRIBED]->(p)
      OPTIONAL MATCH (p)-[:FOR]->(pat:User)
      OPTIONAL MATCH (p)-[c:CONTAINS]->(m:Medicine)
      RETURN 
        p {.*, totalPrice: p.totalPrice } AS prescription,
        doc {id: doc.id, name: doc.name} AS doctor,
        pat {id: pat.id, name: pat.name} AS patient,
        COLLECT(m {id: m.id, name: m.name, price: c.price, quantity: c.quantity}) AS medicines
    `;
    const result = await session.run(query, { prescriptionId });

    if (result.records.length === 0) return null;

    const record = result.records[0];
    const prescription = record.get("prescription");
    const doctor = record.get("doctor");
    const patient = record.get("patient");
    const medicines = record.get("medicines");

    return {
      id: prescription.id,
      date: prescription.date,
      totalPrice: prescription.totalPrice,
      doctor,
      patient,
      medicines,
    };
  } catch (error) {
    throw new Error("Error fetching prescription: " + error.message);
  } finally {
    await session.close();
  }
};

module.exports = { getPrescriptionById };

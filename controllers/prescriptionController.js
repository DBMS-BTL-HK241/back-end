const {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} = require('../models/prescriptionModel');

// Fetch all prescriptions
const fetchAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await getAllPrescriptions();
    res.json(prescriptions); // Trả lại danh sách đơn thuốc
  } catch (error) {
    console.error("Error fetching all prescriptions:", error);
    res.status(500).json({ error: "Unable to fetch prescriptions." });
  }
};

// Fetch a specific prescription by ID
const fetchPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid prescription ID." });
    }

    const prescription = await getPrescriptionById(parseInt(id));
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found." });
    }
    res.json(prescription);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Unable to fetch prescription." });
  }
};

// Create a new prescription
const createPrescriptionHandler = async (req, res) => {
  try {
    const { doctorName, patientName, medicines } = req.body;

    if (!doctorName || !patientName || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const prescription = await createPrescription({
      doctorName,
      patientName,
      medicines,
    });
    res.status(201).json(prescription);
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Unable to create prescription." });
  }
};

// Update a prescription
const updatePrescriptionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid prescription ID." });
    }

    const updatedPrescription = await updatePrescription(parseInt(id), updates);
    if (!updatedPrescription) {
      return res.status(404).json({ error: "Prescription not found." });
    }
    res.json(updatedPrescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ error: "Unable to update prescription." });
  }
};

// Delete a prescription
const deletePrescriptionHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid prescription ID." });
    }

    const success = await deletePrescription(parseInt(id));
    if (!success) {
      return res.status(404).json({ error: "Prescription not found." });
    }
    res.json({ message: "Prescription deleted successfully." });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ error: "Unable to delete prescription." });
  }
};

module.exports = {
  fetchPrescription,
  createPrescriptionHandler,
  fetchAllPrescriptions,
  updatePrescriptionHandler,
  deletePrescriptionHandler,
};

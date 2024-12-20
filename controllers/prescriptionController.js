const {
    getPrescriptionById,
    createPrescription,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription,
  } = require("../models/prescriptionModel");
  
  const fetchPrescription = async (req, res) => {
    try {
      const { id } = req.params;
      const prescription = await getPrescriptionById(id);
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }
      res.json(prescription);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const createPrescriptionHandler = async (req, res) => {
    try {
      const prescription = await createPrescription(req.body);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const fetchAllPrescriptions = async (req, res) => {
    try {
      const prescriptions = await getAllPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const updatePrescriptionHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedPrescription = await updatePrescription(id, updates);
      res.json(updatedPrescription);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const deletePrescriptionHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deletePrescription(id);
      if (!success) {
        return res.status(404).json({ error: "Prescription not found" });
      }
      res.json({ message: "Prescription deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  module.exports = {
    fetchPrescription,
    createPrescriptionHandler,
    fetchAllPrescriptions,
    updatePrescriptionHandler,
    deletePrescriptionHandler,
  };
  
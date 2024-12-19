const express = require("express");
const {
  fetchPrescription,
  createPrescriptionHandler,
  fetchAllPrescriptions,
  updatePrescriptionHandler,
  deletePrescriptionHandler,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.get("/:id", fetchPrescription);
router.post("/", createPrescriptionHandler);
router.get("/", fetchAllPrescriptions);
router.put("/:id", updatePrescriptionHandler);
router.delete("/:id", deletePrescriptionHandler);

module.exports = router;

const medicineModel = require('../models/medicineModel');

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicineModel.getAllMedicines();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};

const getMedicineByID = async (req, res) => {
    const id  = req.params.id;
    try {
        const medicine = await medicineModel.getMedicineByID(id);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        // res.json(1);
        res.status(200).json({ message: 'ok', error });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicine', error });
    }
};

const addMedicine = async (req, res) => {
    const { name, dosage, administration, sideEffects, quantity } = req.body;
    try {
        const newMedicine = await medicineModel.createMedicine(name, dosage, administration, sideEffects, quantity);
        res.status(201).json({ message: 'Medicine successfully added', medicine: newMedicine });
    } catch (error) {
        res.status(500).json({ message: 'Error adding medicine', error });
    }
};

const updateMedicine = async (req, res) => {
    const updates = req.body;
    try {
        const updatedMedicine = await medicineModel.updateMedicine(updates);
        if (!updatedMedicine) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json({ message: 'Medicine successfully updated', medicine: updatedMedicine });
    } catch (error) {
        res.status(500).json({ message: 'Error updating medicine', error });
    }
};

const deleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await medicineModel.deleteMedicine(parseInt(id));
        if (!isDeleted) return res.status(404).json({ message: 'Medicine not found' });
        res.status(200).json({ message: 'Medicine successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};


module.exports = {
    getAllMedicines,
    getMedicineByID, 
    addMedicine,
    updateMedicine,
    deleteMedicine
}
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { session } = require("../config/neo4j");
const Bill = require("../models/billModel");

const createBill = async (req, res) => {
  const {
    patientName,
    phoneNumber,
    address,
    dateOfVisit,
    doctorName,
    specialization,
    symptoms,
    disease,
    medicines,
    amount,
    status,
  } = req.body;
  const newBill = await Bill.createBill(
    patientName,
    phoneNumber,
    address,
    dateOfVisit,
    doctorName,
    specialization,
    symptoms,
    disease,
    medicines,
    amount,
    status
  );
  res.status(201).json({ message: "Bill created", bill: newBill });
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Bill.findAllInvoices(); // Assuming you have a method in your model for this
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

const updateInvoice = async (req, res) => {
    console.log("IN");
    try {
    const { id } = req.params; // Get invoice ID from the URL
    const updatedData = req.body; // Get updated data from the request body

    // Example: Update invoice in the database
    const updatedInvoice = await Bill.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true, // Return the updated document
        //runValidators: true, // Run schema validators on the updated data
      }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res
      .status(200)
      .json({
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating invoice", error: error.message });
  }
};

module.exports = { createBill, getAllInvoices, updateInvoice };

const bcrypt = require("bcrypt");
const crypto = require("crypto");
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

const fetchRevenueData = async (req, res) => {
  try {
      const data = await Bill.getLastMonthRevenue();
      res.status(200).json({ message: "Revenue data: ", data: data });
  } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
  }
};

// New method to delete all bills
const deleteAllBills = async (req, res) => {
  console.log("Deleting all bills...");
  try {
    const deletedCount = await Bill.deleteAllBills(); // Call the deleteAllBills method from the Bill model
    if (deletedCount === 0) {
      return res.status(404).json({ message: "No bills found to delete" });
    }
    res.status(200).json({ message: `${deletedCount} bills deleted successfully` });
  } catch (error) {
    console.error("Error deleting bills:", error);
    res.status(500).json({ message: "Error deleting bills" });
  }
};

const createPaymentUrl = (req, res) => {
  const { amount, orderInfo, orderType, id } = req.body;

  // Validate input data
  if (!amount || !orderInfo || !orderType) {
    return res.status(400).json({ error: "Thiếu thông tin yêu cầu" });
  }

  // VNPay configuration details
  const vnp_TmnCode = "F2OQD2H7";
  const vnp_HashSecret = "X7UUBFW169ZGO5JTTUSF3UY4XDXM40EV";
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_ReturnUrl = "http://localhost:3000/payment-success";

  // Transaction date
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

  // Client's IP address
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Transaction reference ID
  const transactionRef = id || `ORD${Date.now()}`;

  // Assemble parameters
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount * 100, // VND (multiply by 100)
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: clientIp,
    vnp_Locale: "vn",
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_ReturnUrl,
    vnp_TxnRef: transactionRef, // Transaction reference
  };

  // Sort parameters alphabetically by key
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  // Create query string without vnp_SecureHash
  const querystring = new URLSearchParams(sortedParams).toString();

  // Generate the signature (HMAC-SHA512)
  const signData = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(querystring)
    .digest("hex");

  // Add the signature to the parameters
  const paymentUrl = `${vnp_Url}?${querystring}&vnp_SecureHash=${signData}`;

  // Return the payment URL to the frontend
  res.json({ paymentUrl });
};

const paymentSucceed = async (req, res) => {
  try {
      const { id } = req.params; // Extract the invoice ID from the URL
      const updatedInvoice = await Bill.markAsPaid(id); // Call the model method to update the status

      res.status(200).json({
          message: "Payment successful. Invoice status updated to 'Paid'.",
          invoice: updatedInvoice,
      });
  } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};


module.exports = { createBill, getAllInvoices, updateInvoice, fetchRevenueData, deleteAllBills, createPaymentUrl, paymentSucceed };

const excelService = require('../services/excelService');
const { memoryStore } = require('../config/db');

// 1. Download Patients List as Excel (.xlsx)
const exportPatients = async (req, res, next) => {
  try {
    const buffer = excelService.exportPatientsToBuffer(memoryStore.patients);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=HAMS_Registered_Patients_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

// 2. Download OPD Appointments & Token Register as Excel (.xlsx)
const exportOPD = async (req, res, next) => {
  try {
    const buffer = excelService.exportOPDToBuffer(memoryStore.appointments);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=HAMS_OPD_Token_Register_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

// 3. Download Revenue & Billing Ledger as Excel (.xlsx)
const exportBills = async (req, res, next) => {
  try {
    const buffer = excelService.exportBillsToBuffer(memoryStore.bills);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=HAMS_Revenue_Ledger_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

// 4. Download Lab Diagnostics Register as Excel (.xlsx)
const exportLabTests = async (req, res, next) => {
  try {
    const buffer = excelService.exportLabTestsToBuffer(memoryStore.labTests);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=HAMS_Lab_Diagnostics_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

// 5. Download Pharmacy Inventory Stock as Excel (.xlsx)
const exportPharmacy = async (req, res, next) => {
  try {
    const buffer = excelService.exportPharmacyToBuffer(memoryStore.medicines);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=HAMS_Pharmacy_Inventory_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  exportPatients,
  exportOPD,
  exportBills,
  exportLabTests,
  exportPharmacy
};

const { memoryStore, saveLocalStore } = require('../config/db');
const notificationService = require('../services/notificationService');

// Get all lab tests & Blood Bank status
const getLabDashboard = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        tests: memoryStore.labTests,
        bloodBank: memoryStore.bloodBank,
        pendingCount: memoryStore.labTests.filter(t => t.status !== 'Completed').length,
        criticalAlerts: memoryStore.labTests.filter(t => t.isCritical).length
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update test values & sign off report
const updateLabTestResult = async (req, res, next) => {
  try {
    const { testId, findings, status = 'Completed', isCritical = false, technician } = req.body;
    const test = memoryStore.labTests.find(t => t.id === testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test order not found.' });
    }

    test.findings = findings || test.findings;
    test.status = status;
    test.isCritical = Boolean(isCritical);
    test.technician = technician || 'Anand Kulkarni';
    test.verifiedBy = 'Dr. Sunita Kapoor, MD (Pathology)';
    test.reportUrl = `/uploads/lab_${test.id}.pdf`;
    test.updatedAt = new Date().toISOString();

    saveLocalStore();

    // Trigger Notification to patient
    const patient = memoryStore.patients.find(p => p.id === test.patientId) || { name: test.patientName, mobile: '9876543210' };
    notificationService.sendLabReportReadyAlert(patient, test);

    const io = req.app.get('socketio');
    if (io) {
      io.emit('lab:report_ready', { test });
    }

    res.json({
      success: true,
      message: 'Lab diagnostic report verified, signed, and ready for download.',
      data: test
    });
  } catch (err) {
    next(err);
  }
};

// Update Blood Bank Stock Units
const updateBloodBankStock = async (req, res, next) => {
  try {
    const { bloodGroup, unitsAvailable, status } = req.body;
    const item = memoryStore.bloodBank.find(b => b.bloodGroup === bloodGroup);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Blood group entry not found.' });
    }

    if (unitsAvailable !== undefined) item.unitsAvailable = Number(unitsAvailable);
    if (status) item.status = status;
    item.lastUpdated = 'Just now';

    saveLocalStore();

    res.json({
      success: true,
      message: `Blood Bank stock for ${bloodGroup} updated to ${item.unitsAvailable} units.`,
      data: item
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLabDashboard,
  updateLabTestResult,
  updateBloodBankStock
};

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const abhaController = require('../controllers/abhaController');
const patientController = require('../controllers/patientController');
const opdController = require('../controllers/opdController');
const doctorController = require('../controllers/doctorController');
const labController = require('../controllers/labController');
const pharmacyController = require('../controllers/pharmacyController');
const bedController = require('../controllers/bedController');
const billingController = require('../controllers/billingController');
const exportController = require('../controllers/exportController');
const analyticsController = require('../controllers/analyticsController');
const orsController = require('../controllers/orsController');

const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');

// --- 1. Authentication, Registration, Forgot/Reset Password & Admin Users List ---
router.post('/auth/login', authLimiter, authController.login);
router.post('/auth/demo-login', authController.quickDemoLogin);
router.post('/auth/register', authController.register);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/me', authenticate, authController.getMe);
router.get('/admin/users', authController.getAdminUsersList);

// --- 2. JSR Healthcare Hospital Directory & Booking ---
router.get('/ors/hospitals', orsController.getHospitals);
router.get('/ors/departments/:hospitalId', orsController.getDepartments);
router.get('/ors/slots', orsController.getAvailableSlots);
router.post('/ors/book', orsController.bookORSAppointment);
router.get('/ors/lab-reports', orsController.lookupLabReports);
router.get('/ors/blood-availability', orsController.searchBloodAvailability);
router.get('/ors/appointment-status', orsController.checkAppointmentStatus);

// --- 3. Ayushman ABHA Integrations (ABHA, HFR, HPR, Consent) ---
router.post('/abha/request-otp', abhaController.requestOtp);
router.post('/abha/verify-otp', abhaController.verifyAndCreateABHA);
router.get('/abha/hfr-search', abhaController.searchHFR);
router.get('/abha/hpr-search', abhaController.searchHPR);
router.get('/abha/consents', abhaController.getConsents);
router.post('/abha/consent-status', abhaController.updateConsentStatus);

// --- 4. Patients Registry ---
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.post('/patients', patientController.registerPatient);
router.put('/patients/:id', patientController.updatePatient);

// --- 5. OPD Queue & Token Desk ---
router.get('/opd/queue', opdController.getOPDQueue);
router.post('/opd/book', opdController.bookOPDToken);
router.post('/opd/advance', opdController.advanceToken);

// --- 6. Doctor Console & EHR / Prescriptions ---
router.get('/doctor/queue', doctorController.getDoctorQueue);
router.post('/doctor/ehr', doctorController.createEHR);

// --- 7. Pathology & Diagnostics Lab + Blood Bank ---
router.get('/lab/dashboard', labController.getLabDashboard);
router.post('/lab/result', labController.updateLabTestResult);
router.post('/lab/blood-bank', labController.updateBloodBankStock);

// --- 8. Pharmacy & Inventory ---
router.get('/pharmacy', pharmacyController.getPharmacyInventory);
router.post('/pharmacy/dispense', pharmacyController.dispenseMedicine);
router.post('/pharmacy/restock', pharmacyController.restockMedicine);

const aiCaseTakingController = require('../controllers/aiCaseTakingController');

// --- 9. Bed Management & ICU Grid ---
router.get('/beds', bedController.getBeds);
router.post('/beds/allocate', bedController.allocateBed);
router.post('/beds/discharge', bedController.dischargeBed);

// --- 10. Payments & Billing Ledger ---
router.get('/billing', billingController.getBills);
router.post('/billing/create', billingController.createBill);
router.post('/billing/init-payment', billingController.initPayment);
router.post('/billing/verify-payment', billingController.verifyPayment);

// --- 11. Excel (.xlsx) Reports Download Engine ---
router.get('/export/patients', exportController.exportPatients);
router.get('/export/opd', exportController.exportOPD);
router.get('/export/bills', exportController.exportBills);
router.get('/export/lab', exportController.exportLabTests);
router.get('/export/pharmacy', exportController.exportPharmacy);

// --- 12. Hospital Analytics & KPIs ---
router.get('/analytics', analyticsController.getAnalytics);

// --- 13. AI Conversational Case Taking & Emergency Triage Engine ---
router.post('/ai/conversation/start', aiCaseTakingController.startConversation);
router.post('/ai/conversation/respond', aiCaseTakingController.respondToQuestion);
router.post('/ai/triage/check-redflags', aiCaseTakingController.checkRedFlags);
router.post('/ai/copilot/chat', aiCaseTakingController.copilotChat);
router.post('/ai/validate-vitals', aiCaseTakingController.validateVitals);


// --- 14. AYUSH / Ayurveda Case Taking & Dashavidha Pariksha ---
router.post('/ai/ayush/assess', aiCaseTakingController.assessAyush);

// --- 15. Medical Document Scanner & AI OCR (Prescriptions, Lab, Interactions) ---
router.post('/ai/ocr/scan-document', aiCaseTakingController.scanDocumentOCR);

// --- 16. AI Clinical Summary (1-Page Doctor Draft & EHR Integration) ---
router.post('/ai/clinical-summary/generate', aiCaseTakingController.generateClinicalSummary);
router.post('/ai/clinical-summary/update', aiCaseTakingController.updateClinicalSummary);

// --- 17. Granular & Revocable Patient Consent (ABDM FHIR linkage) ---
router.post('/consent/manage', aiCaseTakingController.manageGranularConsent);

// --- 18. Patient Portal Consolidated Profile & History ---
router.get('/patient/portal-dashboard', aiCaseTakingController.getPatientDashboardData);

const triageController = require('../controllers/triageController');
const fhirController = require('../controllers/fhirController');
const { testSupabaseConnection } = require('../config/supabase');

// --- 19. Emergency & Priority Triage Console ---
router.get('/triage/alerts', triageController.getTriageAlerts);
router.post('/triage/alerts', triageController.createTriageAlert);
router.put('/triage/alerts/:id', triageController.updateTriageAlert);

// --- 20. ABDM FHIR R4 Bundle Export & Audit Logs ---
router.post('/fhir/export', fhirController.exportFHIRBundle);
router.get('/admin/audit-logs', fhirController.getAuditLogs);

// --- 21. Supabase / PostgreSQL Database Connection Status ---
router.get('/database/status', async (req, res) => {
  const status = await testSupabaseConnection();
  res.json({
    success: true,
    data: {
      supabase: status,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;

const abdmService = require('../services/abdmService');
const notificationService = require('../services/notificationService');
const { memoryStore, saveLocalStore } = require('../config/db');

// 1. Request Aadhaar or Mobile OTP for ABHA Creation
const requestOtp = async (req, res, next) => {
  try {
    const { identityValue, type = 'AADHAAR' } = req.body;
    if (!identityValue) {
      return res.status(400).json({ success: false, message: 'Aadhaar Number (12-digit) or Mobile Number is required.' });
    }

    const result = abdmService.generateOtp(identityValue, type);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 2. Verify OTP and Generate 14-digit ABHA ID & Card
const verifyAndCreateABHA = async (req, res, next) => {
  try {
    const { txnId, otp, profileData = {} } = req.body;
    if (!txnId || !otp) {
      return res.status(400).json({ success: false, message: 'Transaction ID and 6-digit OTP are required.' });
    }

    const abhaProfile = abdmService.verifyOtpAndGenerateABHA(txnId, otp, profileData);

    // Save or link to Patient record in memoryStore
    let patient = memoryStore.patients.find(p => p.mobile === abhaProfile.mobile || p.name.toLowerCase() === abhaProfile.name.toLowerCase());
    if (patient) {
      patient.abhaNumber = abhaProfile.abhaNumber;
      patient.abhaAddress = abhaProfile.abhaAddress;
    } else {
      patient = {
        id: `PAT-${Date.now()}`,
        name: abhaProfile.name,
        mobile: abhaProfile.mobile,
        email: abhaProfile.email,
        abhaNumber: abhaProfile.abhaNumber,
        abhaAddress: abhaProfile.abhaAddress,
        gender: abhaProfile.gender,
        dob: abhaProfile.dob,
        age: 32,
        bloodGroup: 'B+',
        address: abhaProfile.address,
        district: abhaProfile.district,
        state: abhaProfile.state,
        pincode: abhaProfile.pincode,
        allergies: [],
        chronicConditions: [],
        photoUrl: abhaProfile.photoUrl,
        createdAt: new Date().toISOString()
      };
      memoryStore.patients.push(patient);
    }

    saveLocalStore();

    // Trigger multi-channel SMS & WhatsApp notification
    notificationService.sendABHACreationAlert(abhaProfile);

    res.status(201).json({
      success: true,
      message: 'ABHA Health Card created successfully and verified with National Health Authority (NHA).',
      data: abhaProfile,
      patient
    });
  } catch (err) {
    next(err);
  }
};

// 3. Search HFR (Health Facility Registry)
const searchHFR = async (req, res, next) => {
  try {
    const { query } = req.query;
    const facilities = abdmService.searchHFR(query);
    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (err) {
    next(err);
  }
};

// 4. Search HPR (Healthcare Professionals Registry)
const searchHPR = async (req, res, next) => {
  try {
    const { query } = req.query;
    const doctors = abdmService.searchHPR(query);
    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (err) {
    next(err);
  }
};

// 5. ABDM Consent Manager - List Consents
const getConsents = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: memoryStore.consents
    });
  } catch (err) {
    next(err);
  }
};

// 6. ABDM Consent Manager - Create/Approve Consent Request
const updateConsentStatus = async (req, res, next) => {
  try {
    const { consentId, status } = req.body; // GRANTED, DENIED, REVOKED
    const consent = memoryStore.consents.find(c => c.id === consentId || c.consentRequestId === consentId);
    if (!consent) {
      return res.status(404).json({ success: false, message: 'ABDM Consent artifact not found.' });
    }

    consent.status = status;
    consent.updatedAt = new Date().toISOString();
    saveLocalStore();

    res.json({
      success: true,
      message: `Consent request ${consentId} has been updated to '${status}'.`,
      data: consent
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestOtp,
  verifyAndCreateABHA,
  searchHFR,
  searchHPR,
  getConsents,
  updateConsentStatus
};

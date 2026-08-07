const { memoryStore, saveLocalStore } = require('../config/db');

// List all patients
const getAllPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let list = [...memoryStore.patients];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        (p.abhaNumber && p.abhaNumber.includes(q)) ||
        (p.abhaAddress && p.abhaAddress.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

// Get single patient with medical timeline (EHRs, Lab reports, Bills, Appointments)
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = memoryStore.patients.find(p => p.id === id || p.abhaNumber === id || p.mobile === id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found in HAMS database.' });
    }

    const patientEHRs = memoryStore.ehrs.filter(e => e.patientId === patient.id || e.abhaNumber === patient.abhaNumber);
    const patientLabs = memoryStore.labTests.filter(l => l.patientId === patient.id || l.abhaNumber === patient.abhaNumber);
    const patientBills = memoryStore.bills.filter(b => b.patientId === patient.id || b.abhaNumber === patient.abhaNumber);
    const patientAppointments = memoryStore.appointments.filter(a => a.patientId === patient.id || a.abhaNumber === patient.abhaNumber);

    res.json({
      success: true,
      data: {
        patient,
        history: {
          ehrs: patientEHRs,
          labTests: patientLabs,
          bills: patientBills,
          appointments: patientAppointments
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// Register new patient
const registerPatient = async (req, res, next) => {
  try {
    const {
      name, mobile, email, gender, dob, age, bloodGroup,
      address, district, state, pincode, aadhaarLast4,
      emergencyContact, insuranceProvider, insurancePolicyNo, allergies, chronicConditions
    } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Patient Full Name and Mobile Number are required.' });
    }

    const newPatient = {
      id: `PAT-${1000 + memoryStore.patients.length + 1}`,
      name,
      mobile,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      gender: gender || 'Male',
      dob: dob || '1995-01-01',
      age: age ? Number(age) : 30,
      bloodGroup: bloodGroup || 'O+',
      abhaNumber: '',
      abhaAddress: '',
      aadhaarLast4: aadhaarLast4 || '0000',
      address: address || 'Civil Lines, Delhi',
      district: district || 'Central Delhi',
      state: state || 'Delhi',
      pincode: pincode || '110001',
      emergencyContact: emergencyContact || 'N/A',
      insuranceProvider: insuranceProvider || 'Ayushman Bharat PM-JAY',
      insurancePolicyNo: insurancePolicyNo || 'PMJAY-DEL-009182',
      allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : (chronicConditions ? [chronicConditions] : []),
      photoUrl: gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      createdAt: new Date().toISOString()
    };

    memoryStore.patients.unshift(newPatient);
    saveLocalStore();

    res.status(201).json({
      success: true,
      message: 'Patient registered in hospital database with Medical Record Number (MRN).',
      data: newPatient
    });
  } catch (err) {
    next(err);
  }
};

// Update patient
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = memoryStore.patients.find(p => p.id === id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    Object.assign(patient, req.body);
    patient.updatedAt = new Date().toISOString();
    saveLocalStore();

    res.json({
      success: true,
      message: 'Patient information updated successfully.',
      data: patient
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  registerPatient,
  updatePatient
};

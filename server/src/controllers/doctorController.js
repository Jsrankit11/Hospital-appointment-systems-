const { memoryStore, saveLocalStore } = require('../config/db');

// Get Doctor's Daily Consultation Queue
const getDoctorQueue = async (req, res, next) => {
  try {
    const doctorId = req.user ? req.user.id : req.query.doctorId;
    let appointments = [...memoryStore.appointments];

    if (doctorId && doctorId !== 'ALL') {
      appointments = appointments.filter(a => a.doctorId === doctorId || a.doctorName.toLowerCase().includes(req.user?.name?.toLowerCase() || ''));
    }

    res.json({
      success: true,
      data: {
        appointments,
        waitingCount: appointments.filter(a => a.status === 'Waiting').length,
        inConsultation: appointments.find(a => a.status === 'In-Consultation'),
        completedToday: appointments.filter(a => a.status === 'Completed').length
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create Electronic Health Record (EHR) & Prescription
const createEHR = async (req, res, next) => {
  try {
    const {
      patientId, patientName, abhaNumber, appointmentId,
      vitals = {}, symptoms, diagnosis, clinicalNotes, prescriptions = [],
      recommendedTests = [], followUpDate
    } = req.body;

    const doctorName = req.user ? req.user.name : 'Dr. Arvind Sharma';
    const doctorId = req.user ? req.user.id : 'USR-DOC-01';
    const department = req.user ? req.user.department : 'Cardiology';

    const newEHR = {
      id: `EHR-${Date.now()}`,
      patientId,
      patientName,
      abhaNumber: abhaNumber || '',
      doctorId,
      doctorName,
      department,
      date: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: vitals.bloodPressure || '120/80 mmHg',
        pulseRate: vitals.pulseRate || '78 bpm',
        spo2: vitals.spo2 || '99%',
        temperature: vitals.temperature || '98.6 °F',
        weight: vitals.weight || '70 kg',
        height: vitals.height || '172 cm',
        bmi: vitals.bmi || '23.6'
      },
      symptoms: symptoms || 'Routine Follow-up',
      diagnosis: diagnosis || 'General Health Examination',
      clinicalNotes: clinicalNotes || 'Patient examined. Vital signs stable. Advised medications and lifestyle modifications.',
      prescriptions,
      recommendedTests,
      followUpDate: followUpDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    memoryStore.ehrs.unshift(newEHR);

    // If there's an appointment associated, mark it Completed
    if (appointmentId) {
      const apt = memoryStore.appointments.find(a => a.id === appointmentId || a.tokenNumber === appointmentId);
      if (apt) {
        apt.status = 'Completed';
      }
    }

    // If recommended tests were ordered, automatically create lab orders
    if (recommendedTests && recommendedTests.length > 0) {
      recommendedTests.forEach(testName => {
        const labOrder = {
          id: `LAB-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          patientId,
          patientName,
          abhaNumber,
          testName,
          category: testName.toLowerCase().includes('blood') || testName.toLowerCase().includes('cbc') ? 'Hematology' : 'Biochemistry',
          doctorName,
          sampleType: 'Venous Blood / Serum',
          status: 'Sample Collection Pending',
          isCritical: false,
          findings: 'Sample under lab processing workflow.',
          reportUrl: '',
          downloadBadge: '/images/lab_report.gif',
          technician: 'Anand Kulkarni',
          createdAt: new Date().toISOString()
        };
        memoryStore.labTests.unshift(labOrder);
      });
    }

    saveLocalStore();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('opd:queue_updated', { queue: memoryStore.appointments });
      io.emit('ehr:created', { ehr: newEHR });
    }

    res.status(201).json({
      success: true,
      message: 'Electronic Health Record (EHR) & e-Prescription registered in ABDM repository.',
      data: newEHR
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDoctorQueue,
  createEHR
};

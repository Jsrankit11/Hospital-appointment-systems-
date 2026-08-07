const { memoryStore, saveLocalStore } = require('../config/db');
const notificationService = require('../services/notificationService');

// 1. Get Empanelled Hospitals by State / Query
const getHospitals = async (req, res, next) => {
  try {
    const { state, query } = req.query;
    let list = memoryStore.hospitals || [];

    if (state && state !== 'All') {
      list = list.filter(h => h.state.toLowerCase() === state.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.state.toLowerCase().includes(q));
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

// 2. Get Hospital Departments & Doctors
const getDepartments = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;
    const hospital = (memoryStore.hospitals || []).find(h => h.id === hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found in ORS directory.' });
    }

    res.json({
      success: true,
      hospital: hospital.name,
      departments: hospital.departments
    });
  } catch (err) {
    next(err);
  }
};

// 3. Get Available Date & Time Slots
const getAvailableSlots = async (req, res, next) => {
  try {
    const { hospitalId, department, date } = req.query;

    // Generate upcoming dates (next 14 days)
    const availableDates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Skip Sundays if applicable
      const isSunday = d.getDay() === 0;
      availableDates.push({
        date: d.toISOString().split('T')[0],
        display: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        availableSlotsCount: isSunday ? 0 : Math.floor(25 + Math.random() * 40),
        status: isSunday ? 'HOLIDAY' : 'AVAILABLE'
      });
    }

    const timeSlots = [
      { id: 'S1', time: '08:30 AM - 09:30 AM', available: 12, session: 'Morning OPD' },
      { id: 'S2', time: '09:30 AM - 10:30 AM', available: 18, session: 'Morning OPD' },
      { id: 'S3', time: '10:30 AM - 11:30 AM', available: 15, session: 'Morning OPD' },
      { id: 'S4', time: '11:30 AM - 12:30 PM', available: 8, session: 'Morning OPD' },
      { id: 'S5', time: '01:30 PM - 02:30 PM', available: 20, session: 'Afternoon OPD' },
      { id: 'S6', time: '02:30 PM - 03:30 PM', available: 14, session: 'Afternoon OPD' },
      { id: 'S7', time: '03:30 PM - 04:30 PM', available: 6, session: 'Evening Clinic' }
    ];

    res.json({
      success: true,
      availableDates,
      timeSlots
    });
  } catch (err) {
    next(err);
  }
};

// 4. Book Online ORS Appointment
const bookORSAppointment = async (req, res, next) => {
  try {
    const {
      patientName, mobile, email, gender, age, aadhaarLast4, abhaNumber,
      hospitalId, hospitalName, department, doctorName, appointmentDate, timeSlot,
      symptoms, address, state, district
    } = req.body;

    if (!patientName || !mobile || !department) {
      return res.status(400).json({ success: false, message: 'Patient Name, Mobile and Department are required.' });
    }

    const tokenNumber = (100 + memoryStore.appointments.length + 1).toString();
    const bookingRef = `ORS-${(hospitalId || 'AIIMS').split('-')[1] || 'DEL'}-2026-${tokenNumber}`;
    const barcode = `*${bookingRef}*`;

    // Ensure patient exists in registry
    let patient = memoryStore.patients.find(p => p.mobile === mobile || (abhaNumber && p.abhaNumber === abhaNumber));
    if (!patient) {
      patient = {
        id: `PAT-${1000 + memoryStore.patients.length + 1}`,
        name: patientName,
        mobile,
        email: email || `${patientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        abhaNumber: abhaNumber || '',
        abhaAddress: abhaNumber ? `${patientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm` : '',
        aadhaarLast4: aadhaarLast4 || '8821',
        gender: gender || 'Male',
        age: age ? Number(age) : 32,
        dob: '1994-01-01',
        bloodGroup: 'B+',
        address: address || 'Civil Lines, Delhi',
        district: district || 'New Delhi',
        state: state || 'Delhi',
        pincode: '110001',
        emergencyContact: `${mobile}`,
        insuranceProvider: 'PM-JAY Ayushman Card',
        allergies: [],
        chronicConditions: [],
        photoUrl: gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
        createdAt: new Date().toISOString()
      };
      memoryStore.patients.unshift(patient);
    }

    const newAppointment = {
      id: bookingRef,
      tokenNumber,
      patientId: patient.id,
      patientName,
      mobile,
      abhaNumber: abhaNumber || patient.abhaNumber || '',
      hospitalId: hospitalId || 'HOSP-AIIMS-DELHI',
      hospitalName: hospitalName || 'All India Institute of Medical Sciences (AIIMS New Delhi)',
      doctorId: 'USR-DOC-01',
      doctorName: doctorName || 'Dr. Arvind Sharma (Senior Consultant)',
      department,
      opdRoom: 'Room 104, CNC OPD Block',
      date: appointmentDate || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '09:30 AM - 10:30 AM (Morning Session)',
      type: 'Online Registration System (ORS) Booking',
      priority: 'Normal',
      status: 'Waiting',
      fee: 0, // Government hospital OPD is free
      paymentStatus: 'PAID',
      symptoms: symptoms || 'Routine Outpatient Health Consultation',
      barcode,
      qrData: `https://ors.gov.in/verify?id=${bookingRef}&pat=${encodeURIComponent(patientName)}&hosp=${encodeURIComponent(hospitalName || 'AIIMS')}`,
      createdAt: new Date().toISOString()
    };

    memoryStore.appointments.unshift(newAppointment);
    saveLocalStore();

    // Trigger SMS and WhatsApp alerts with SMS_NEW.png
    notificationService.sendOPDTokenAlert(patient, newAppointment);

    const io = req.app.get('socketio');
    if (io) {
      io.emit('opd:queue_updated', { queue: memoryStore.appointments });
      io.emit('ors:appointment_booked', { appointment: newAppointment });
    }

    res.status(201).json({
      success: true,
      message: `Online Registration Successful! Token #${tokenNumber} generated with booking ref: ${bookingRef}`,
      appointment: newAppointment,
      patient
    });
  } catch (err) {
    next(err);
  }
};

// 5. Lookup Lab Reports by Hospital / UHID / Mobile / CR Number
const lookupLabReports = async (req, res, next) => {
  try {
    const { hospitalId, uhid, mobile, crNumber } = req.query;
    let list = [...memoryStore.labTests];

    if (uhid) {
      list = list.filter(l => (l.uhid && l.uhid.toLowerCase().includes(uhid.toLowerCase())) || l.patientId.includes(uhid));
    }
    if (mobile) {
      list = list.filter(l => l.mobile === mobile);
    }
    if (crNumber) {
      list = list.filter(l => l.id.toLowerCase().includes(crNumber.toLowerCase()));
    }
    if (hospitalId && hospitalId !== 'All') {
      list = list.filter(l => l.hospitalName && l.hospitalName.toLowerCase().includes(hospitalId.toLowerCase()));
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

// 6. Search Blood Availability across Indian Hospitals
const searchBloodAvailability = async (req, res, next) => {
  try {
    const { state, district, bloodGroup, component } = req.query;
    let list = memoryStore.bloodBank || [];

    if (state && state !== 'All') {
      list = list.filter(b => b.state && b.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All') {
      list = list.filter(b => b.district && b.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (bloodGroup && bloodGroup !== 'All') {
      list = list.filter(b => b.bloodGroup === bloodGroup);
    }
    if (component && component !== 'All') {
      list = list.filter(b => b.component.toLowerCase().includes(component.toLowerCase()));
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

// 7. Check Appointment Status by Mobile or Booking Ref
const checkAppointmentStatus = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide Mobile Number or Booking Reference ID.' });
    }

    const q = query.toLowerCase();
    const found = memoryStore.appointments.filter(a => 
      a.id.toLowerCase().includes(q) || 
      (a.mobile && a.mobile.includes(q)) ||
      (a.abhaNumber && a.abhaNumber.includes(q)) ||
      a.patientName.toLowerCase().includes(q)
    );

    res.json({
      success: true,
      count: found.length,
      data: found
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHospitals,
  getDepartments,
  getAvailableSlots,
  bookORSAppointment,
  lookupLabReports,
  searchBloodAvailability,
  checkAppointmentStatus
};

const { memoryStore, saveLocalStore } = require('../config/db');
const notificationService = require('../services/notificationService');

// Get OPD Queue for today
const getOPDQueue = async (req, res, next) => {
  try {
    const { department, doctorId, status } = req.query;
    let list = [...memoryStore.appointments];

    if (department && department !== 'All') {
      list = list.filter(a => a.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (doctorId) {
      list = list.filter(a => a.doctorId === doctorId);
    }
    if (status && status !== 'All') {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
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

// Book new OPD Token
const bookOPDToken = async (req, res, next) => {
  try {
    const {
      patientId, patientName, abhaNumber, doctorId, doctorName, department,
      timeSlot, priority = 'Normal', symptoms, fee = 500
    } = req.body;

    if (!patientName || !department) {
      return res.status(400).json({ success: false, message: 'Patient Name and Department are required for OPD booking.' });
    }

    // Auto-resolve doctor if not passed
    let assignedDoctor = doctorName;
    let assignedDocId = doctorId;
    if (!assignedDoctor) {
      const doc = memoryStore.users.find(u => u.role === 'DOCTOR' && u.department.toLowerCase().includes(department.toLowerCase())) || memoryStore.users.find(u => u.role === 'DOCTOR');
      assignedDoctor = doc ? doc.name : 'Dr. Arvind Sharma';
      assignedDocId = doc ? doc.id : 'USR-DOC-01';
    }

    const nextTokenNum = (100 + memoryStore.appointments.length + 1).toString();
    const newAppointment = {
      id: `APT-${Date.now()}`,
      tokenNumber: nextTokenNum,
      patientId: patientId || `PAT-${Date.now()}`,
      patientName,
      abhaNumber: abhaNumber || '',
      doctorId: assignedDocId,
      doctorName: assignedDoctor,
      department,
      opdRoom: 'Room 104, Block A',
      date: new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || 'Current Session (Live OPD)',
      type: 'General OPD Consultation',
      priority,
      status: 'Waiting', // Waiting, In-Consultation, Completed, Cancelled
      fee: Number(fee),
      paymentStatus: 'PAID',
      symptoms: symptoms || 'General Medical Consultation',
      createdAt: new Date().toISOString()
    };

    memoryStore.appointments.unshift(newAppointment);

    // Also auto-generate bill
    const newBill = {
      id: `BILL-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${1000 + memoryStore.bills.length + 1}`,
      patientId: newAppointment.patientId,
      patientName: newAppointment.patientName,
      abhaNumber: newAppointment.abhaNumber,
      serviceType: `OPD Consultation Token #${nextTokenNum} (${department})`,
      items: [
        { name: `${assignedDoctor} Consultation Fee`, amount: Number(fee) }
      ],
      totalAmount: Number(fee),
      discount: 0,
      tax: 0,
      netAmount: Number(fee),
      paymentMethod: 'UPI',
      transactionId: `UPI-OPD-${Date.now()}`,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };
    memoryStore.bills.unshift(newBill);

    saveLocalStore();

    // Trigger Notification
    const patientObj = memoryStore.patients.find(p => p.id === newAppointment.patientId) || { name: patientName, mobile: '9876543210' };
    notificationService.sendOPDTokenAlert(patientObj, newAppointment);

    // Emit live socket event if io is present
    const io = req.app.get('socketio');
    if (io) {
      io.emit('opd:queue_updated', { queue: memoryStore.appointments });
      io.emit('opd:token_booked', { appointment: newAppointment });
    }

    res.status(201).json({
      success: true,
      message: `OPD Token #${nextTokenNum} booked successfully. Patient added to live queue.`,
      data: newAppointment,
      bill: newBill
    });
  } catch (err) {
    next(err);
  }
};

// Call next token / Update status
const advanceToken = async (req, res, next) => {
  try {
    const { appointmentId, status } = req.body; // In-Consultation, Completed, Cancelled
    const apt = memoryStore.appointments.find(a => a.id === appointmentId || a.tokenNumber === appointmentId);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment token not found.' });
    }

    apt.status = status;
    apt.updatedAt = new Date().toISOString();
    saveLocalStore();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('opd:token_called', { appointment: apt, status });
      io.emit('opd:queue_updated', { queue: memoryStore.appointments });
    }

    res.json({
      success: true,
      message: `Token #${apt.tokenNumber} is now marked as '${status}'.`,
      data: apt
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOPDQueue,
  bookOPDToken,
  advanceToken
};

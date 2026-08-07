const { memoryStore, saveLocalStore } = require('../config/db');

// Get all beds & live occupancy summary
const getBeds = async (req, res, next) => {
  try {
    const { ward, status } = req.query;
    let list = [...memoryStore.beds];

    if (ward && ward !== 'All') {
      list = list.filter(b => b.ward.toLowerCase().includes(ward.toLowerCase()));
    }
    if (status && status !== 'All') {
      list = list.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }

    const total = memoryStore.beds.length;
    const occupied = memoryStore.beds.filter(b => b.status === 'Occupied').length;
    const available = memoryStore.beds.filter(b => b.status === 'Available').length;
    const icuTotal = memoryStore.beds.filter(b => b.ward.includes('ICU')).length;
    const icuOccupied = memoryStore.beds.filter(b => b.ward.includes('ICU') && b.status === 'Occupied').length;

    res.json({
      success: true,
      stats: {
        total,
        occupied,
        available,
        occupancyRate: Math.round((occupied / (total || 1)) * 100),
        icuTotal,
        icuOccupied
      },
      data: list
    });
  } catch (err) {
    next(err);
  }
};

// Allocate bed to patient (ICU / Emergency / General)
const allocateBed = async (req, res, next) => {
  try {
    const { bedId, patientId, patientName } = req.body;
    const bed = memoryStore.beds.find(b => b.id === bedId || b.bedNumber === bedId);
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Selected hospital bed not found.' });
    }

    if (bed.status === 'Occupied') {
      return res.status(400).json({ success: false, message: `Bed ${bed.bedNumber} is already occupied by another patient.` });
    }

    bed.status = 'Occupied';
    bed.patientId = patientId || `PAT-${Date.now()}`;
    bed.patientName = patientName;
    bed.allocatedAt = new Date().toISOString();

    saveLocalStore();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('bed:status_changed', { bed, action: 'ALLOCATED' });
    }

    res.json({
      success: true,
      message: `Bed ${bed.bedNumber} in ${bed.ward} allocated to ${patientName} successfully.`,
      data: bed
    });
  } catch (err) {
    next(err);
  }
};

// Discharge patient from bed
const dischargeBed = async (req, res, next) => {
  try {
    const { bedId } = req.body;
    const bed = memoryStore.beds.find(b => b.id === bedId || b.bedNumber === bedId);
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Hospital bed not found.' });
    }

    const previousPatient = bed.patientName;
    bed.status = 'Available';
    bed.patientId = null;
    bed.patientName = null;
    bed.dischargedAt = new Date().toISOString();

    saveLocalStore();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('bed:status_changed', { bed, action: 'DISCHARGED' });
    }

    res.json({
      success: true,
      message: `Patient ${previousPatient} discharged. Bed ${bed.bedNumber} is now sanitized and available.`,
      data: bed
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBeds,
  allocateBed,
  dischargeBed
};

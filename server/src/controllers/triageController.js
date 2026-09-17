const { memoryStore, saveLocalStore } = require('../config/db');
const { supabaseDb } = require('../config/supabase');

// Ensure collection exists
if (!memoryStore.triageAlerts) {
  memoryStore.triageAlerts = [
    {
      id: 'TRG-101',
      alertId: 'ALT-101',
      patientId: 'PAT-1002',
      patientName: 'Vikram Malhotra',
      age: 52,
      gender: 'Male',
      severity: 'CODE_RED',
      category: 'CARDIOVASCULAR',
      alertTitle: '🚨 CRITICAL CARDIAC RED FLAG',
      triggerSymptom: 'Sudden retrosternal chest pain radiating to left jaw with profuse cold sweating',
      clinicalInstruction: 'Immediate STAT 12-lead ECG, Troponin-I, and emergency physician evaluation required. Bypass OPD queue.',
      status: 'TRIGGERED',
      reportedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      tokenNumber: 'E-01'
    },
    {
      id: 'TRG-102',
      alertId: 'ALT-102',
      patientId: 'PAT-1003',
      patientName: 'Sunita Devi',
      age: 48,
      gender: 'Female',
      severity: 'CODE_YELLOW',
      category: 'INFECTIOUS',
      alertTitle: '⚠️ POTENTIAL CNS INFECTION / MENINGISM',
      triggerSymptom: 'High continuous fever (103°F) for 4 days with severe neck stiffness and photophobia',
      clinicalInstruction: 'Urgent lumbar puncture and infectious disease consultation indicated.',
      status: 'ACKNOWLEDGED',
      reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      acknowledgedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      tokenNumber: 'E-02'
    }
  ];
}

// 1. Get All Triage Alerts
const getTriageAlerts = async (req, res) => {
  try {
    const alerts = memoryStore.triageAlerts || [];
    return res.status(200).json({
      success: true,
      data: {
        totalAlerts: alerts.length,
        criticalRed: alerts.filter(a => a.severity === 'CODE_RED' && a.status !== 'RESOLVED').length,
        urgentYellow: alerts.filter(a => a.severity === 'CODE_YELLOW' && a.status !== 'RESOLVED').length,
        alerts
      }
    });
  } catch (err) {
    console.error('Get triage alerts error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Acknowledge / Update Triage Alert
const updateTriageAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'ACKNOWLEDGED', actionNotes = '', routedTo = 'Emergency Resuscitation Bay' } = req.body;

    const alert = (memoryStore.triageAlerts || []).find(a => a.id === id || a.alertId === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Triage alert not found' });
    }

    alert.status = status;
    alert.actionNotes = actionNotes;
    alert.routedTo = routedTo;
    if (status === 'ACKNOWLEDGED') alert.acknowledgedAt = new Date().toISOString();
    if (status === 'RESOLVED') alert.resolvedAt = new Date().toISOString();

    saveLocalStore();

    // Audit log
    await supabaseDb.logAudit({
      userName: req.user?.name || 'Triage Officer',
      role: 'TRIAGE_STAFF',
      action: `TRIAGE_ALERT_${status}`,
      patientRef: alert.patientId,
      details: `Alert ${alert.alertId} updated to ${status}. Routed to: ${routedTo}`
    });

    return res.status(200).json({
      success: true,
      message: `Triage alert status updated to ${status}`,
      data: alert
    });
  } catch (err) {
    console.error('Update triage alert error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Create Manual Triage Alert
const createTriageAlert = async (req, res) => {
  try {
    const alertData = req.body;
    const saved = await supabaseDb.saveTriageAlert(alertData);
    return res.status(201).json({
      success: true,
      message: 'Priority Triage Alert successfully broadcasted',
      data: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getTriageAlerts,
  updateTriageAlert,
  createTriageAlert
};

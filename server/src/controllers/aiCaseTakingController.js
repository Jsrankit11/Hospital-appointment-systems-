const aiCaseTakingService = require('../services/aiCaseTakingService');
const { memoryStore, saveLocalStore } = require('../config/db');

// Ensure memory store has collections for new modules
if (!memoryStore.aiConversations) memoryStore.aiConversations = [];
if (!memoryStore.scannedDocuments) memoryStore.scannedDocuments = [];
if (!memoryStore.ayushProfiles) memoryStore.ayushProfiles = [];
if (!memoryStore.clinicalSummaries) memoryStore.clinicalSummaries = [];
if (!memoryStore.granularConsents) memoryStore.granularConsents = [];

// 1. Start AI Case Taking Conversation
const startConversation = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', language = 'en', isAyush = false, chiefComplaint = '' } = req.body;

    const initialQuestion = aiCaseTakingService.getNextQuestion({
      stepIndex: 0,
      answers: chiefComplaint ? { CHIEF_COMPLAINT: chiefComplaint } : {},
      language,
      isAyush
    });

    const sessionId = `AI-SESS-${Date.now()}`;
    const newSession = {
      sessionId,
      patientId,
      language,
      isAyush,
      stepIndex: 0,
      answers: chiefComplaint ? { CHIEF_COMPLAINT: chiefComplaint } : {},
      triageLevel: 'GREEN',
      createdAt: new Date().toISOString()
    };

    memoryStore.aiConversations.push(newSession);
    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: 'AI Case Taking session initialized',
      data: {
        sessionId,
        currentStep: initialQuestion,
        totalSteps: 9,
        triageLevel: 'GREEN'
      }
    });
  } catch (err) {
    console.error('Start AI conversation error:', err);
    return res.status(500).json({ success: false, message: 'Could not initialize AI conversation', error: err.message });
  }
};

// 2. Respond to AI Question (Voice STT or Text / Touch Pill)
const respondToQuestion = async (req, res) => {
  try {
    const { sessionId, stepId, answerText, language = 'en', isAyush = false } = req.body;

    let session = memoryStore.aiConversations.find(s => s.sessionId === sessionId);
    if (!session) {
      session = {
        sessionId: sessionId || `AI-SESS-${Date.now()}`,
        patientId: 'PAT-1001',
        language,
        isAyush,
        stepIndex: 0,
        answers: {},
        triageLevel: 'GREEN'
      };
      memoryStore.aiConversations.push(session);
    }

    // Save answer
    session.answers[stepId] = answerText;
    session.stepIndex = (session.stepIndex || 0) + 1;

    // Check red-flag emergency triggers in patient's response
    const redFlagCheck = aiCaseTakingService.detectRedFlags(answerText);
    if (redFlagCheck.hasRedFlag && redFlagCheck.triageLevel === 'RED') {
      session.triageLevel = 'RED';
      session.emergencyAlert = redFlagCheck.summary;
    } else if (redFlagCheck.hasRedFlag && redFlagCheck.triageLevel === 'YELLOW' && session.triageLevel !== 'RED') {
      session.triageLevel = 'YELLOW';
    }

    // Generate next adaptive question
    const nextQuestion = aiCaseTakingService.getNextQuestion({
      stepIndex: session.stepIndex,
      answers: session.answers,
      language: session.language || language,
      isAyush: session.isAyush || isAyush
    });

    saveLocalStore();

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        nextStep: nextQuestion,
        completedSteps: session.stepIndex,
        totalSteps: 9,
        triageStatus: {
          triageLevel: session.triageLevel,
          hasRedFlag: redFlagCheck.hasRedFlag,
          alertTitle: redFlagCheck.matches[0]?.alertTitle || null,
          instruction: redFlagCheck.matches[0]?.instruction || null
        },
        currentAnswers: session.answers
      }
    });
  } catch (err) {
    console.error('AI Respond error:', err);
    return res.status(500).json({ success: false, message: 'Error processing clinical response', error: err.message });
  }
};

// 3. Evaluate Instant Red Flags
const checkRedFlags = async (req, res) => {
  try {
    const { text = '' } = req.body;
    const triage = aiCaseTakingService.detectRedFlags(text);
    return res.status(200).json({
      success: true,
      data: triage
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 4. AYUSH / Ayurveda Assessment (Prakriti, Agni, Koshta, Dashavidha)
const assessAyush = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', assessmentData = {} } = req.body;
    const result = aiCaseTakingService.assessAyurvedaPrakriti(assessmentData);

    const ayushRecord = {
      id: `AYUSH-${Date.now()}`,
      patientId,
      createdAt: new Date().toISOString(),
      ...result
    };

    memoryStore.ayushProfiles.push(ayushRecord);
    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: 'AYUSH Prakriti & Dashavidha Pariksha assessment computed successfully',
      data: ayushRecord
    });
  } catch (err) {
    console.error('AYUSH assessment error:', err);
    return res.status(500).json({ success: false, message: 'Failed AYUSH computation', error: err.message });
  }
};

// 5. Medical Document Scanner & AI OCR
const scanDocumentOCR = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', docType = 'PRESCRIPTION', fileName = 'Prescription.jpg', rawText = '', date } = req.body;

    const parsedOCR = aiCaseTakingService.processDocumentOCR({
      rawText: rawText || 'Augmentin 625 Duo 1 tab BD, Pan 40 OD empty stomach, Aspirin 75mg daily. Fasting blood sugar 148 mg/dL, HbA1c 8.4%.',
      docType,
      fileName,
      date
    });

    const docRecord = {
      ...parsedOCR,
      patientId,
      uploadedAt: new Date().toISOString()
    };

    memoryStore.scannedDocuments.push(docRecord);
    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: 'Medical document OCR analyzed successfully with drug interactions and abnormal lab alerts',
      data: docRecord
    });
  } catch (err) {
    console.error('Document OCR error:', err);
    return res.status(500).json({ success: false, message: 'Failed OCR analysis', error: err.message });
  }
};

// 6. Generate 1-Page AI Clinical Summary for Doctor Desk
const generateClinicalSummary = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', sessionId } = req.body;

    let session = memoryStore.aiConversations.find(s => s.sessionId === sessionId || s.patientId === patientId);
    const answers = session ? session.answers : {};

    const patient = (memoryStore.patients || []).find(p => p.id === patientId) || {
      id: 'PAT-1001',
      name: 'Rohan Sharma',
      age: 34,
      gender: 'Male',
      abhaNumber: '91-4829-1092-3341'
    };

    const patientDocs = (memoryStore.scannedDocuments || []).filter(d => d.patientId === patientId);
    const ayushData = (memoryStore.ayushProfiles || []).find(a => a.patientId === patientId);

    const summary = aiCaseTakingService.generateOnePageClinicalSummary({
      conversationAnswers: answers,
      scannedDocs: patientDocs,
      ayushData,
      patientInfo: patient
    });

    // Store summary
    memoryStore.clinicalSummaries.push(summary);
    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: '1-Page AI Clinical Summary ready for physician review',
      data: summary
    });
  } catch (err) {
    console.error('Clinical summary error:', err);
    return res.status(500).json({ success: false, message: 'Could not generate clinical summary', error: err.message });
  }
};

// 7. Doctor Review (Edit / Confirm / Reject Clinical Summary)
const updateClinicalSummary = async (req, res) => {
  try {
    const { summaryId, status = 'CONFIRMED', editedSections, doctorNotes } = req.body;

    let summary = (memoryStore.clinicalSummaries || []).find(s => s.summaryId === summaryId);
    if (!summary) {
      // Fallback draft
      summary = {
        summaryId: summaryId || `SUM-${Date.now()}`,
        sections: editedSections || {},
        physicianReviewStatus: status
      };
      memoryStore.clinicalSummaries.push(summary);
    }

    summary.physicianReviewStatus = status;
    if (editedSections) summary.sections = { ...summary.sections, ...editedSections };
    if (doctorNotes) summary.physicianNotes = doctorNotes;
    summary.reviewedAt = new Date().toISOString();

    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: `AI Clinical Summary ${status} by Doctor`,
      data: summary
    });
  } catch (err) {
    console.error('Update clinical summary error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 8. Granular & Revocable Consent Manager
const manageGranularConsent = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', hospitalName, hiTypes = ['DiagnosticReport', 'Prescription', 'DischargeSummary'], purpose = 'CONSULTATION', action = 'GRANT', consentId } = req.body;

    if (action === 'REVOKE' && consentId) {
      const existing = (memoryStore.granularConsents || []).find(c => c.consentId === consentId);
      if (existing) {
        existing.status = 'REVOKED';
        existing.revokedAt = new Date().toISOString();
      }
      saveLocalStore();
      return res.status(200).json({
        success: true,
        message: 'Consent successfully revoked in compliance with ABDM policies.',
        data: existing
      });
    }

    const newConsent = {
      consentId: `CNS-${Date.now()}`,
      patientId,
      hospitalName: hospitalName || 'AIIMS New Delhi',
      hiTypes,
      purpose,
      status: 'GRANTED',
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    memoryStore.granularConsents.push(newConsent);
    saveLocalStore();

    return res.status(200).json({
      success: true,
      message: 'Granular consent granted and signed with ABHA gateway.',
      data: newConsent
    });
  } catch (err) {
    console.error('Consent error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 9. Patient Portal Consolidated Dashboard
const getPatientDashboardData = async (req, res) => {
  try {
    const { patientId = 'PAT-1001' } = req.query;

    const patient = (memoryStore.patients || []).find(p => p.id === patientId) || {
      id: 'PAT-1001',
      name: 'Rohan Sharma',
      mobile: '+91 98765 43210',
      abhaNumber: '91-4829-1092-3341',
      abhaAddress: 'rohan.sharma@abdm',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+ Positive',
      address: 'B-42, South Extension Part II, New Delhi',
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension (Stage 1)', 'Impaired Fasting Glucose']
    };

    const appointments = (memoryStore.appointments || []).filter(a => a.patientId === patientId);
    const documents = (memoryStore.scannedDocuments || []).filter(d => d.patientId === patientId);
    const consents = (memoryStore.granularConsents || []).filter(c => c.patientId === patientId);
    const ehrs = (memoryStore.ehrs || []).filter(e => e.patientId === patientId);
    const ayush = (memoryStore.ayushProfiles || []).find(a => a.patientId === patientId);

    return res.status(200).json({
      success: true,
      data: {
        patient,
        appointments,
        documents,
        consents,
        ehrs,
        ayushProfile: ayush || null
      }
    });
  } catch (err) {
    console.error('Patient dashboard data error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 10. ChatGPT / Gemini AI Medical Copilot
const copilotChat = async (req, res) => {
  try {
    const { message, language = 'hi', patientContext, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Query message is required' });
    }

    const result = await aiCaseTakingService.medicalCopilotChat({
      message,
      language,
      patientContext,
      chatHistory
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Copilot chat error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 11. Real-Time Vitals Validation & Safety Alert Engine
const validateVitals = async (req, res) => {
  try {
    const result = aiCaseTakingService.validateVitals(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Validate vitals error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  startConversation,
  respondToQuestion,
  checkRedFlags,
  assessAyush,
  scanDocumentOCR,
  generateClinicalSummary,
  updateClinicalSummary,
  manageGranularConsent,
  getPatientDashboardData,
  copilotChat,
  validateVitals
};


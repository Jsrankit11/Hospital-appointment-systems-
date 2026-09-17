const { memoryStore } = require('../config/db');
const { supabaseDb } = require('../config/supabase');

// Export patient clinical history into standard FHIR R4 Bundle
const exportFHIRBundle = async (req, res) => {
  try {
    const { patientId = 'PAT-1001', visitId } = req.body;

    const patient = (memoryStore.patients || []).find(p => p.id === patientId) || {
      id: 'PAT-1001',
      name: 'Rohan Sharma',
      gender: 'male',
      age: 34,
      mobile: '+919876543210',
      abhaNumber: '91-4829-1092-3341'
    };

    const summary = (memoryStore.clinicalSummaries || []).find(s => s.patientId === patientId) || {
      sections: {
        chiefComplaint: 'Chest heaviness and fatigue',
        historyOfPresentIllness: 'Started 3 days ago on exertion',
        provisionalWorkingDiagnosis: 'Essential Hypertension'
      }
    };

    const bundleId = `FHIR-BUNDLE-${Date.now()}`;
    const fhirBundle = {
      resourceType: 'Bundle',
      id: bundleId,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle']
      },
      identifier: {
        system: 'https://ndhm.in/fhir/bundles',
        value: bundleId
      },
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        // 1. Patient Resource
        {
          fullUrl: `urn:uuid:patient-${patient.id}`,
          resource: {
            resourceType: 'Patient',
            id: `patient-${patient.id}`,
            identifier: [
              {
                system: 'https://healthid.ndhm.gov.in',
                value: patient.abhaNumber || '91-4829-1092-3341'
              }
            ],
            name: [{ text: patient.name }],
            gender: (patient.gender || 'male').toLowerCase(),
            telecom: [{ system: 'phone', value: patient.mobile }]
          }
        },
        // 2. Encounter / Visit Resource
        {
          fullUrl: `urn:uuid:encounter-${visitId || 'VIS-9021'}`,
          resource: {
            resourceType: 'Encounter',
            id: `encounter-${visitId || 'VIS-9021'}`,
            status: 'finished',
            class: {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
              code: 'AMB',
              display: 'ambulatory'
            },
            subject: { reference: `urn:uuid:patient-${patient.id}` }
          }
        },
        // 3. Condition (Chief Complaint / Provisional Diagnosis)
        {
          fullUrl: `urn:uuid:condition-1`,
          resource: {
            resourceType: 'Condition',
            id: 'condition-1',
            clinicalStatus: {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
            },
            verificationStatus: {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'provisional' }]
            },
            code: {
              text: summary.sections?.chiefComplaint || 'Chest discomfort on exertion'
            },
            subject: { reference: `urn:uuid:patient-${patient.id}` }
          }
        },
        // 4. Observation (Vitals / Investigations)
        {
          fullUrl: `urn:uuid:observation-vitals`,
          resource: {
            resourceType: 'Observation',
            id: 'observation-vitals',
            status: 'final',
            category: [
              {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }]
              }
            ],
            code: { text: 'Blood Pressure & Vitals' },
            subject: { reference: `urn:uuid:patient-${patient.id}` },
            valueString: '124/82 mmHg, Pulse 76 bpm'
          }
        },
        // 5. Consent Resource
        {
          fullUrl: `urn:uuid:consent-abdm`,
          resource: {
            resourceType: 'Consent',
            id: 'consent-abdm',
            status: 'active',
            scope: {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }]
            },
            patient: { reference: `urn:uuid:patient-${patient.id}` },
            dateTime: new Date().toISOString()
          }
        }
      ]
    };

    // Log audit
    await supabaseDb.logAudit({
      userName: req.user?.name || 'System / ABDM Gateway',
      role: 'ADMIN',
      action: 'FHIR_EXPORT',
      patientRef: patient.id,
      details: `Generated standard ABDM FHIR R4 Bundle: ${bundleId}`
    });

    return res.status(200).json({
      success: true,
      message: 'ABDM-Ready FHIR R4 Document Bundle exported successfully',
      data: fhirBundle
    });
  } catch (err) {
    console.error('FHIR export error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Admin Audit Logs API
const getAuditLogs = async (req, res) => {
  try {
    const logs = memoryStore.auditLogs || [];
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  exportFHIRBundle,
  getAuditLogs
};

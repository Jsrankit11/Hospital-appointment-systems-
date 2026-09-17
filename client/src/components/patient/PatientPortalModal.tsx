import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  User, ShieldCheck, QrCode, Lock, KeyRound, FileText, CheckCircle2,
  AlertCircle, ChevronRight, X, Clock, Calendar, Heart, ShieldAlert,
  Trash2, Plus, Building2, Globe
} from 'lucide-react';
import { GranularConsentItem, Patient } from '../../types';

interface PatientPortalModalProps {
  onClose: () => void;
  language?: 'en' | 'hi';
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({
  onClose,
  language = 'en'
}) => {
  const { addToast } = useNotification();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CONSENT' | 'HISTORY'>('PROFILE');
  const [loading, setLoading] = useState(false);

  const [patient, setPatient] = useState<Patient | null>({
    id: 'PAT-1001',
    name: 'Rohan Sharma',
    mobile: '+91 98765 43210',
    email: 'rohan.sharma@gmail.com',
    abhaNumber: '91-4829-1092-3341',
    abhaAddress: 'rohan.sharma@abdm',
    aadhaarLast4: '8839',
    gender: 'Male',
    age: 34,
    dob: '1992-04-18',
    bloodGroup: 'B+ Positive',
    address: 'B-42, South Extension Part II',
    district: 'South Delhi',
    state: 'Delhi',
    pincode: '110049',
    emergencyContact: '+91 98111 22334 (Spouse)',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Stage 1 Essential Hypertension', 'Impaired Fasting Glucose'],
    createdAt: '2026-01-15'
  });

  const [consents, setConsents] = useState<GranularConsentItem[]>([
    {
      consentId: 'CNS-901',
      patientId: 'PAT-1001',
      hospitalName: 'AIIMS New Delhi (Cardiology OPD)',
      hiTypes: ['DiagnosticReport', 'Prescription', 'DischargeSummary'],
      purpose: 'CARE_MANAGEMENT',
      status: 'GRANTED',
      grantedAt: '2026-08-20',
      expiresAt: '2026-11-20'
    },
    {
      consentId: 'CNS-902',
      patientId: 'PAT-1001',
      hospitalName: 'Max Super Speciality Hospital Saket',
      hiTypes: ['DiagnosticReport'],
      purpose: 'INVESTIGATION_REVIEW',
      status: 'GRANTED',
      grantedAt: '2026-07-10',
      expiresAt: '2026-10-10'
    }
  ]);

  // Grant New Consent Modal Form State
  const [newHospital, setNewHospital] = useState('Fortis Memorial Research Institute');
  const [selectedHiTypes, setSelectedHiTypes] = useState<string[]>(['Prescription', 'DiagnosticReport']);

  const handleRevokeConsent = async (consentId: string) => {
    try {
      const res = await API.post('/consent/manage', {
        action: 'REVOKE',
        consentId
      });

      if (res.data.success) {
        setConsents(consents.map(c => c.consentId === consentId ? { ...c, status: 'REVOKED' } : c));
        addToast('success', 'Consent Revoked', 'Consent successfully revoked in compliance with ABDM policies.');
      }
    } catch (err) {
      setConsents(consents.map(c => c.consentId === consentId ? { ...c, status: 'REVOKED' } : c));
      addToast('success', 'Consent Revoked', 'Consent access terminated.');
    }
  };

  const handleGrantNewConsent = async () => {
    try {
      const res = await API.post('/consent/manage', {
        patientId: 'PAT-1001',
        hospitalName: newHospital,
        hiTypes: selectedHiTypes,
        purpose: 'CONSULTATION',
        action: 'GRANT'
      });

      if (res.data.success) {
        setConsents([res.data.data, ...consents]);
        addToast('success', 'Consent Granted & Signed', `ABHA Consent Artifact generated for ${newHospital}.`);
      }
    } catch (err) {
      const dummy: GranularConsentItem = {
        consentId: `CNS-${Date.now()}`,
        patientId: 'PAT-1001',
        hospitalName: newHospital,
        hiTypes: selectedHiTypes,
        purpose: 'CONSULTATION',
        status: 'GRANTED',
        grantedAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setConsents([dummy, ...consents]);
      addToast('success', 'Consent Granted & Signed', `ABHA Consent Artifact generated for ${newHospital}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-600/15 via-emerald-500/10 to-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? 'मरीज स्वास्थ्य खाता एवं सहमति केंद्र' : 'Patient Health Portal & ABHA Consent Center'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                  ABDM L3 Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? '14-अंकीय आभा आईडी, आधार सत्यापन एवं प्रतिसंहरणीय सहमति प्रबंधन' : '14-Digit ABHA ID, Aadhaar e-KYC & Granular Revocable Consents'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {[
            { id: 'PROFILE', label: isHindi ? '1. मरीज प्रोफाइल' : '1. Citizen Profile & ABHA', icon: User },
            { id: 'CONSENT', label: isHindi ? '2. सहमति प्रबंधन (Consent)' : '2. ABDM Consent Manager', icon: Lock },
            { id: 'HISTORY', label: isHindi ? '3. चिकित्सा इतिहास' : '3. Medical History', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-500/10 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Profile & ABHA Card */}
          {activeTab === 'PROFILE' && patient && (
            <div className="space-y-6">
              
              {/* Digital ABHA Card Representation */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-700 via-emerald-800 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-400/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                      NATIONAL HEALTH AUTHORITY • AYUSHMAN BHARAT
                    </span>
                    <h3 className="text-2xl font-black">{patient.name}</h3>
                    <p className="font-mono text-sm tracking-wider text-emerald-100 font-bold">
                      ABHA: {patient.abhaNumber}
                    </p>
                    <p className="text-xs text-emerald-200">
                      ABHA Address: <strong className="text-white">{patient.abhaAddress}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl shadow-lg flex-shrink-0 self-start sm:self-auto">
                    <div className="w-24 h-24 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      <QrCode className="w-16 h-16 text-white" />
                    </div>
                    <span className="block text-[9px] text-center font-bold text-slate-600 mt-1">SCAN FOR OPD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/20 mt-4 text-xs">
                  <div>
                    <span className="text-emerald-300 text-[10px] block">DOB / Age</span>
                    <strong>{patient.dob} ({patient.age}Y)</strong>
                  </div>
                  <div>
                    <span className="text-emerald-300 text-[10px] block">Gender</span>
                    <strong>{patient.gender}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-300 text-[10px] block">Blood Group</span>
                    <strong>{patient.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-300 text-[10px] block">Aadhaar e-KYC</span>
                    <strong className="text-emerald-200">Verified (XXXX-{patient.aadhaarLast4})</strong>
                  </div>
                </div>
              </div>

              {/* Vitals & Health Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-teal-600 uppercase text-[10px] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Documented Allergies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies?.map((all, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                        {all}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-teal-600 uppercase text-[10px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Chronic Conditions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {patient.chronicConditions?.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ABDM Granular & Revocable Consent Manager */}
          {activeTab === 'CONSENT' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/30 text-xs text-teal-800 dark:text-teal-300">
                <strong>{isHindi ? 'प्रतिसंहरणीय सहमति सुरक्षा:' : 'Granular & Revocable Consent Policy:'}</strong>{' '}
                {isHindi
                  ? 'मरीज किसी भी समय किसी भी अस्पताल के लिए अपनी डायग्नोस्टिक रिपोर्ट या पर्चे साझा करने की अनुमति को 1-क्लिक में रद्द (Revoke) कर सकता है।'
                  : 'Patients maintain complete sovereignty over their longitudinal health records. Grant or revoke record access at any time per hospital and data category.'}
              </div>

              {/* Active Consents List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Consent Authorizations ({consents.length})
                </h4>

                {consents.map((c) => (
                  <div
                    key={c.consentId}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      c.status === 'REVOKED'
                        ? 'bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-teal-500/30 shadow-md'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-500" />
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">{c.hospitalName}</h5>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          c.status === 'GRANTED' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.hiTypes.map((hi, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            {hi}
                          </span>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Granted: {c.grantedAt} • Valid Until: {c.expiresAt}
                      </p>
                    </div>

                    {c.status === 'GRANTED' ? (
                      <button
                        onClick={() => handleRevokeConsent(c.consentId)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke Consent</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 self-start sm:self-auto">Access Revoked</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grant New Consent Drawer */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-500" />
                  Grant New Health Record Authorization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Hospital / Healthcare Facility</label>
                    <input
                      type="text"
                      value={newHospital}
                      onChange={e => setNewHospital(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Allowed Data Categories (HI Types)</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Prescription', 'DiagnosticReport', 'DischargeSummary', 'OPDNotes'].map(hi => (
                        <button
                          key={hi}
                          type="button"
                          onClick={() => {
                            if (selectedHiTypes.includes(hi)) {
                              setSelectedHiTypes(selectedHiTypes.filter(x => x !== hi));
                            } else {
                              setSelectedHiTypes([...selectedHiTypes, hi]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            selectedHiTypes.includes(hi)
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {hi}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGrantNewConsent}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition"
                >
                  Generate & Sign ABHA Consent
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: Longitudinal Medical History */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    date: '2026-08-28',
                    hospital: 'AIIMS New Delhi',
                    dept: 'Cardiology OPD',
                    doctor: 'Dr. Arvind Sharma',
                    diagnosis: 'Stage 1 Hypertension, advised low-sodium diet and Telmisartan 40mg.'
                  },
                  {
                    date: '2026-05-14',
                    hospital: 'AIIMS New Delhi',
                    dept: 'Internal Medicine',
                    doctor: 'Dr. Priya Patel',
                    diagnosis: 'Seasonal allergic bronchitis & mild asthenia. Completed 5-day course.'
                  }
                ].map((h, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-teal-600 font-bold">{h.date}</span>
                      <span className="font-bold text-slate-500">{h.hospital} ({h.dept})</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">Attending: {h.doctor}</p>
                    <p className="text-slate-600 dark:text-slate-300">{h.diagnosis}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

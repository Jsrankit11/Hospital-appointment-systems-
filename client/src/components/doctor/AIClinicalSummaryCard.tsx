import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  CheckCircle2, AlertTriangle, ShieldAlert, Edit3,
  FileCheck, XCircle, RefreshCw, Printer, Stethoscope, Activity,
  ChevronDown, ChevronUp, Pill, FlaskConical, Flower2
} from 'lucide-react';
import { AIClinicalSummary, Appointment } from '../../types';

interface AIClinicalSummaryCardProps {
  currentAppointment: Appointment | null;
  onApplyToPrescription?: (clinicalDraft: any) => void;
}

export const AIClinicalSummaryCard: React.FC<AIClinicalSummaryCardProps> = ({
  currentAppointment,
  onApplyToPrescription
}) => {
  const { addToast } = useNotification();
  const [summary, setSummary] = useState<AIClinicalSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Editable Form State
  const [editedCC, setEditedCC] = useState('');
  const [editedHPI, setEditedHPI] = useState('');
  const [editedPast, setEditedPast] = useState('');
  const [editedMeds, setEditedMeds] = useState('');
  const [editedROS, setEditedROS] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');

  // Fetch or generate clinical summary for the active appointment
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await API.post('/ai/clinical-summary/generate', {
        patientId: currentAppointment?.patientId || 'PAT-1001'
      });

      if (res.data.success) {
        const data: AIClinicalSummary = res.data.data;
        setSummary(data);
        setEditedCC(data.sections.chiefComplaint);
        setEditedHPI(data.sections.historyOfPresentIllness);
        setEditedPast(data.sections.pastMedicalSurgicalHistory);
        setEditedMeds(data.sections.medicationsAndAllergies);
        setEditedROS(data.sections.reviewOfSystems);
      }
    } catch (err) {
      console.error('Fetch summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [currentAppointment]);

  const handleConfirmAndApply = async () => {
    if (!summary) return;

    try {
      const res = await API.post('/ai/clinical-summary/update', {
        summaryId: summary.summaryId,
        status: 'CONFIRMED',
        editedSections: {
          chiefComplaint: editedCC,
          historyOfPresentIllness: editedHPI,
          pastMedicalSurgicalHistory: editedPast,
          medicationsAndAllergies: editedMeds,
          reviewOfSystems: editedROS
        },
        doctorNotes
      });

      if (res.data.success) {
        setSummary(res.data.data);
        setIsEditing(false);
        addToast('success', 'AI Summary Confirmed', 'Transferred verified clinical intake into EHR writer.');

        if (onApplyToPrescription) {
          onApplyToPrescription({
            symptoms: editedCC,
            clinicalNotes: `HPI: ${editedHPI}\nPast: ${editedPast}\nAllergies/Meds: ${editedMeds}\nROS: ${editedROS}`,
            diagnosis: summary.provisionalWorkingDiagnosis
          });
        }
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    }
  };

  const handleRejectSummary = async () => {
    if (!summary) return;
    try {
      await API.post('/ai/clinical-summary/update', {
        summaryId: summary.summaryId,
        status: 'REJECTED',
        doctorNotes: 'Physician elected manual clinical note taking.'
      });
      setSummary({ ...summary, physicianReviewStatus: 'REJECTED' });
      addToast('info', 'AI Draft Dismissed', 'Manual clinical entry active.');
    } catch (err) {
      console.error(err);
    }
  };

  if (!summary && !loading) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/40 shadow-xl overflow-hidden mb-6 transition-all">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-600/15 via-emerald-500/10 to-blue-500/10 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                AI 1-Page Clinical Summary & Pre-Consultation Intake
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                summary?.triageLevel === 'RED'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : summary?.triageLevel === 'YELLOW'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}>
                TRIAGE: {summary?.triageLevel || 'GREEN'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                STATUS: {summary?.physicianReviewStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated from Patient Voice Case Taking + Scanned Prescriptions OCR • Physician-Editable Draft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Red Flag Alert Header */}
      {summary?.triageLevel === 'RED' && (
        <div className="px-6 py-3 bg-rose-600 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <span className="font-bold text-xs uppercase tracking-wide">
              {summary.redFlagAlerts[0]?.alertTitle || 'Critical Triage Emergency Alert Detected During Patient Intake'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white text-rose-600 px-2.5 py-0.5 rounded-full uppercase">
            HIGH PRIORITY
          </span>
        </div>
      )}

      {/* Expanded Clinical Summary Content */}
      {isExpanded && summary && (
        <div className="p-6 space-y-6">
          
          {/* Main 2-Column Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Chief Complaint */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
                  1. Chief Complaint (CC)
                </span>
                <span className="text-[10px] text-slate-400">Voice Ingestion</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={editedCC}
                  onChange={e => setEditedCC(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              ) : (
                <p className="font-bold text-slate-900 dark:text-white">{summary.sections.chiefComplaint}</p>
              )}
            </div>

            {/* History of Present Illness */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
                  2. History of Present Illness (HPI)
                </span>
                <span className="text-[10px] text-slate-400">Dynamic Reasoning</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={editedHPI}
                  onChange={e => setEditedHPI(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              ) : (
                <p className="text-slate-800 dark:text-slate-200">{summary.sections.historyOfPresentIllness}</p>
              )}
            </div>

            {/* Past Medical / Surgical */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
                3. Past Medical & Surgical History
              </span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={editedPast}
                  onChange={e => setEditedPast(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              ) : (
                <p className="text-slate-800 dark:text-slate-200">{summary.sections.pastMedicalSurgicalHistory}</p>
              )}
            </div>

            {/* Current Medications & Drug Allergies */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
                4. Active Medications & Known Allergies
              </span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={editedMeds}
                  onChange={e => setEditedMeds(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              ) : (
                <p className="text-slate-800 dark:text-slate-200">{summary.sections.medicationsAndAllergies}</p>
              )}
            </div>

          </div>

          {/* Scanned Lab Investigations & Abnormal Flags */}
          {summary.sections.investigationsAndLabFindings && summary.sections.investigationsAndLabFindings.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-500" />
                Previous Investigations & Abnormal Lab Findings (from Scanned OCR Records)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {summary.sections.investigationsAndLabFindings.map((lab, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      lab.isAbnormal
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block truncate">{lab.test}</span>
                      <span className="text-[10px] text-slate-400">Ref: {lab.refRange}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-xs">{lab.value}</strong>
                      {lab.isAbnormal && (
                        <span className="block text-[9px] font-black uppercase text-amber-600">HIGH</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AYUSH Constitutional Overlay if Available */}
          {summary.sections.ayushConstitutionalProfile && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] flex items-center gap-1.5">
                <Flower2 className="w-4 h-4" />
                AYUSH / Ayurveda Dosha Profile Attached
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Primary Prakriti: {summary.sections.ayushConstitutionalProfile.primaryPrakriti} (V:{summary.sections.ayushConstitutionalProfile.doshaDistribution.vata}% / P:{summary.sections.ayushConstitutionalProfile.doshaDistribution.pitta}% / K:{summary.sections.ayushConstitutionalProfile.doshaDistribution.kapha}%)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Agni: {summary.sections.ayushConstitutionalProfile.dashavidhaSummary.agni} • Koshta: {summary.sections.ayushConstitutionalProfile.dashavidhaSummary.koshta}
              </p>
            </div>
          )}

          {/* Doctor Decision & Signature Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-500" />
                <span>{isEditing ? 'Save Changes' : 'Edit Sections'}</span>
              </button>

              <button
                onClick={handleRejectSummary}
                className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition"
              >
                Dismiss Draft
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmAndApply}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirm & Inject Into Consultation EHR</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

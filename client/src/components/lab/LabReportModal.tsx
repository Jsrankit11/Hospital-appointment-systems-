import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { FlaskConical, Download, CheckCircle, AlertTriangle, X, Printer, ShieldCheck } from 'lucide-react';
import { LabTest } from '../../types';

interface LabReportModalProps {
  labTest: LabTest | null;
  onClose: () => void;
  onUpdated: (updated: LabTest) => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({ labTest, onClose, onUpdated }) => {
  const { addToast } = useNotification();
  const [findings, setFindings] = useState(labTest?.findings || 'Hemoglobin: 14.2 g/dL, TLC: 6,800/uL, Platelets: 2.6 Lakhs/uL. Normal morphology.');
  const [isCritical, setIsCritical] = useState(labTest?.isCritical || false);
  const [technician, setTechnician] = useState('Anand Kulkarni');
  const [loading, setLoading] = useState(false);

  if (!labTest) return null;

  const handleSignReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/lab/result', {
        testId: labTest.id,
        findings,
        isCritical,
        status: 'Completed',
        technician
      });

      if (res.data.success) {
        addToast('success', 'Diagnostic Report Signed', `Report for ${labTest.testName} signed by Pathologist & uploaded to ABDM.`);
        onUpdated(res.data.data);
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
        
        {/* Header with lab_report.gif badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/images/lab_report.gif"
                alt="Lab Report"
                className="h-10 w-10 object-contain rounded-xl"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pathology Diagnostic Report & Sign-off
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient: <strong className="text-teal-600 dark:text-teal-400">{labTest.patientName}</strong> • {labTest.testName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Laboratory Slip */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs mb-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">AIIMS Central Diagnostic Labs</p>
              <p className="text-[10px] text-slate-500">NABL Accredited & ABDM M2 Gateway Provider</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-slate-600 dark:text-slate-400">Order ID: {labTest.id}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Status: {labTest.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">Sample Type</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{labTest.sampleType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Category</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{labTest.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Prescribed By</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{labTest.doctorName}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignReport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pathology Test Observations & Parameter Values
            </label>
            <textarea
              rows={4}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reporting Technician
              </label>
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Mark as Critical Panic Value
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="w-4 h-4" /> Print PDF Slip
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Signing...' : 'Sign & Transmit Report'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

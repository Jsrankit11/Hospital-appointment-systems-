import React from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, Check, XCircle, X, Building2, Calendar, FileText } from 'lucide-react';
import { ABDMConsent } from '../../types';

interface ABDMConsentModalProps {
  consents: ABDMConsent[];
  onClose: () => void;
  onUpdated: () => void;
}

export const ABDMConsentModal: React.FC<ABDMConsentModalProps> = ({ consents, onClose, onUpdated }) => {
  const { addToast } = useNotification();

  const handleAction = async (consentId: string, status: 'GRANTED' | 'DENIED' | 'REVOKED') => {
    try {
      const res = await API.post('/abha/consent-status', { consentId, status });
      if (res.data.success) {
        addToast('info', 'Consent Status Updated', `Consent ${consentId} marked as ${status}.`);
        onUpdated();
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.response?.data?.message || 'Server error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ABDM Consent Manager (HIP / HIU Exchange)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grant or revoke secure FHIR health records sharing with external hospitals.
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

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {consents.map((c) => {
            const isGranted = c.status === 'GRANTED';
            const isDenied = c.status === 'DENIED';

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Requesting Health Information User (HIU)
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {c.requesterHospital}
                    </h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
                      Purpose: {c.purpose}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isGranted ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40' :
                    isDenied ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40' :
                    'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Patient ABHA Number</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{c.abhaNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Validity Period</span>
                    <span className="text-slate-700 dark:text-slate-300">{c.dateFrom} to {c.dateTo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {!isGranted && (
                    <button
                      onClick={() => handleAction(c.id, 'GRANTED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-600/30"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Consent
                    </button>
                  )}
                  {isGranted && (
                    <button
                      onClick={() => handleAction(c.id, 'REVOKED')}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Revoke Access
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

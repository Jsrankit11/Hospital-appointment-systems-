import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { BedDouble, HeartPulse, Wind, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Bed } from '../../types';

interface BedAllocationModalProps {
  bed: Bed | null;
  onClose: () => void;
  onUpdated: (updatedBed: Bed) => void;
}

export const BedAllocationModal: React.FC<BedAllocationModalProps> = ({ bed, onClose, onUpdated }) => {
  const { addToast } = useNotification();
  const [patientName, setPatientName] = useState('Deepak Sharma (Emergency Admitted)');
  const [patientId, setPatientId] = useState('PAT-1004');
  const [loading, setLoading] = useState(false);

  if (!bed) return null;

  const isOccupied = bed.status === 'Occupied';

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isOccupied) {
        // Discharge flow
        const res = await API.post('/beds/discharge', { bedId: bed.id });
        if (res.data.success) {
          addToast('success', 'Bed Sanitized & Available', `Bed ${bed.bedNumber} is now freed.`);
          onUpdated(res.data.data);
        }
      } else {
        // Allocate flow
        const res = await API.post('/beds/allocate', {
          bedId: bed.id,
          patientId,
          patientName
        });
        if (res.data.success) {
          addToast('success', `Bed ${bed.bedNumber} Allocated`, `Assigned to ${patientName} in ${bed.ward}.`);
          onUpdated(res.data.data);
        }
      }
    } catch (err: any) {
      addToast('error', 'Operation Failed', err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isOccupied ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-teal-500/10 text-teal-500 border border-teal-500/30'
            }`}>
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isOccupied ? 'Discharge / Transfer Patient' : 'Admit Patient to Bed'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bed #{bed.bedNumber} • {bed.ward}
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

        <form onSubmit={handleAction} className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Bed Category:</span>
              <span className="font-bold text-slate-900 dark:text-white">{bed.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Ward Tariff:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">₹{bed.dailyRate} / Day</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {bed.oxygenSupport && (
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold flex items-center gap-1">
                  <Wind className="w-3 h-3" /> Oxygen Line
                </span>
              )}
              {bed.ventilator && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center gap-1">
                  <HeartPulse className="w-3 h-3" /> Ventilator Unit
                </span>
              )}
            </div>
          </div>

          {!isOccupied ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admitting Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-xs">
              <p className="font-bold text-amber-800 dark:text-amber-300">Currently Occupied By</p>
              <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">{bed.patientName || 'Admitted Patient'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Discharging will automatically update the hospital occupancy dashboard.</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition ${
                isOccupied
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/30'
              }`}
            >
              {loading ? 'Processing...' : isOccupied ? 'Discharge Patient' : 'Confirm Bed Admission'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

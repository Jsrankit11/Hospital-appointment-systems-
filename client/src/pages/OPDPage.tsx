import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Users, Plus, Stethoscope, Clock, ShieldCheck, ArrowRight, ArrowDown } from 'lucide-react';
import { Appointment } from '../types';
import { OPDRegistrationModal } from '../components/opd/OPDRegistrationModal';
import { LiveTokenDisplay } from '../components/opd/LiveTokenDisplay';

export const OPDPage: React.FC = () => {
  const { addToast } = useNotification();
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [department, setDepartment] = useState('All');
  const [showRegModal, setShowRegModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await API.get(`/opd/queue?department=${department}`);
      if (res.data.success) {
        setQueue(res.data.data);
      }
    } catch (err) {
      console.error('Fetch OPD queue error:', err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [department]);

  const handleCallToken = async (appointmentId: string, status: string) => {
    try {
      const res = await API.post('/opd/advance', { appointmentId, status });
      if (res.data.success) {
        addToast('info', 'Queue Advanced', `Token status updated to ${status}.`);
        fetchQueue();
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.response?.data?.message || 'Error advancing token.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Central OPD & Live Token Reception Desk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time outpatient queuing, token broadcasts, and physician room allocation.
          </p>
        </div>

        <button
          onClick={() => setShowRegModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book OPD Token</span>
        </button>
      </div>

      {/* Live Token TV Display */}
      <LiveTokenDisplay
        queue={queue}
        onCallToken={handleCallToken}
      />

      {/* Queue Filter & Register Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Daily OPD Token Registry ({queue.length} Records)
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Department:</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Specialty OPDs</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Token #</th>
                <th className="pb-3">Patient Name</th>
                <th className="pb-3">Department & Doctor</th>
                <th className="pb-3">Slot / Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {queue.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                    #{apt.tokenNumber}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {apt.patientName}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {apt.department} <br />
                    <span className="text-[10px] text-slate-400">{apt.doctorName}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.priority === 'Emergency' ? 'bg-red-500/20 text-red-500' :
                      apt.priority === 'Urgent' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {apt.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                      apt.status === 'In-Consultation' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 animate-pulse' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {apt.status === 'Waiting' && (
                      <button
                        onClick={() => handleCallToken(apt.id, 'In-Consultation')}
                        className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] shadow-sm transition"
                      >
                        Call Token
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRegModal && (
        <OPDRegistrationModal
          onClose={() => setShowRegModal(false)}
          onRegistered={() => {
            setShowRegModal(false);
            fetchQueue();
          }}
        />
      )}

    </div>
  );
};

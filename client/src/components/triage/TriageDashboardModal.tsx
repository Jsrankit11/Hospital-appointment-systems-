import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Clock, Activity,
  HeartPulse, ArrowRight, UserCheck, Stethoscope, RefreshCw, X,
  Radio, PhoneCall, Bed, Check
} from 'lucide-react';

interface TriageDashboardModalProps {
  onClose: () => void;
}

export const TriageDashboardModal: React.FC<TriageDashboardModalProps> = ({ onClose }) => {
  const { addToast } = useNotification();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [criticalRedCount, setCriticalRedCount] = useState(0);
  const [urgentYellowCount, setUrgentYellowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CODE_RED' | 'CODE_YELLOW'>('ALL');

  const fetchTriageAlerts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/triage/alerts');
      if (res.data.success) {
        setAlerts(res.data.data.alerts);
        setCriticalRedCount(res.data.data.criticalRed);
        setUrgentYellowCount(res.data.data.urgentYellow);
      }
    } catch (err) {
      console.error('Fetch triage alerts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageAlerts();
    const interval = setInterval(fetchTriageAlerts, 10000); // 10s polling
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (alertId: string, status: string, routedTo?: string) => {
    try {
      const res = await API.put(`/triage/alerts/${alertId}`, {
        status,
        actionNotes: `Staff action applied: ${status}`,
        routedTo: routedTo || 'Emergency Resuscitation Bay'
      });

      if (res.data.success) {
        addToast('success', `Alert ${status}`, `Patient status updated on hospital dispatch roster.`);
        fetchTriageAlerts();
      }
    } catch (err: any) {
      addToast('error', 'Update failed', err.message);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">Emergency & Priority Triage Console</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-rose-700 uppercase">
                  LIVE OPD STREAM
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Real-time Red-Flag surveillance from MediKiosk patient intakes across all hospital departments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTriageAlerts}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Refresh Alerts"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METRICS & FILTER BAR */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
              <Radio className="w-4 h-4 animate-ping text-rose-500" />
              <span>{criticalRedCount} Critical Red Flags</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{urgentYellowCount} Urgent Alerts</span>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1 rounded-lg transition text-[11px] ${filterSeverity === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('CODE_RED')}
              className={`px-3 py-1 rounded-lg transition text-[11px] ${filterSeverity === 'CODE_RED' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Code Red ({criticalRedCount})
            </button>
            <button
              onClick={() => setFilterSeverity('CODE_YELLOW')}
              className={`px-3 py-1 rounded-lg transition text-[11px] ${filterSeverity === 'CODE_YELLOW' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Code Yellow ({urgentYellowCount})
            </button>
          </div>
        </div>

        {/* ALERTS QUEUE */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">All Clear</h4>
              <p className="text-xs text-slate-500">No active emergency red-flag triggers in queue.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isRed = alert.severity === 'CODE_RED';
              const isAcknowledged = alert.status === 'ACKNOWLEDGED';
              const isResolved = alert.status === 'RESOLVED';

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-3xl border-2 transition shadow-md space-y-3 ${
                    isRed
                      ? 'border-rose-500/60 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border-amber-500/60 bg-amber-50/40 dark:bg-amber-950/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs text-white ${
                        isRed ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
                      }`}>
                        {alert.tokenNumber || 'E-01'}
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {alert.patientName || 'Emergency Patient'} (Age {alert.age || 52}, {alert.gender || 'Male'})
                        </h4>
                        <span className="text-[10px] text-slate-400">ID: {alert.patientId} • Category: {alert.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isResolved ? 'bg-emerald-500/20 text-emerald-600' :
                        isAcknowledged ? 'bg-blue-500/20 text-blue-600' :
                        isRed ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'
                      }`}>
                        STATUS: {alert.status}
                      </span>
                    </div>
                  </div>

                  {/* Trigger Details */}
                  <div className="space-y-1 text-xs">
                    <strong className="text-slate-900 dark:text-white block font-extrabold">
                      {alert.alertTitle}
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Reported Symptom:</strong> {alert.triggerSymptom}
                    </p>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                      <strong>Clinical Action Plan:</strong> {alert.clinicalInstruction}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reported: {new Date(alert.reportedAt || alert.createdAt || Date.now()).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.status === 'TRIGGERED' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Acknowledge Alert
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'ROUTED_TO_EMERGENCY', 'Emergency Trauma OT')}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <Bed className="w-3.5 h-3.5" />
                        <span>Send to Emergency Bay</span>
                      </button>

                      {alert.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

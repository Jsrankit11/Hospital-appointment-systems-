import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FlaskConical, Heart, AlertTriangle, ShieldCheck, Download, Plus } from 'lucide-react';
import { LabTest, BloodStock } from '../types';
import { LabReportModal } from '../components/lab/LabReportModal';
import { BloodBankModal } from '../components/lab/BloodBankModal';

export const LabPage: React.FC = () => {
  const { addToast } = useNotification();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [bloodBank, setBloodBank] = useState<BloodStock[]>([]);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [showBloodBankModal, setShowBloodBankModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get('/lab/dashboard');
      if (res.data.success) {
        setTests(res.data.data.tests);
        setBloodBank(res.data.data.bloodBank);
      }
    } catch (err) {
      console.error('Fetch lab dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Central Pathology, Diagnostics & Blood Bank
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            NABL Accredited Automated Analyzers & ABDM Health Records Provider (HIP).
          </p>
        </div>

        <button
          onClick={() => setShowBloodBankModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition self-start sm:self-auto"
        >
          <img
            src="/images/blood_drop.gif"
            alt="Blood Bank"
            className="w-4 h-4 object-contain inline"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span>Manage Blood Bank Reserves</span>
        </button>
      </div>

      {/* Blood Bank Quick Strip with blood_drop.gif */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Blood Bank Stock
            </h3>
          </div>
          <span className="text-[11px] text-rose-400 font-semibold">Emergency Trauma Line Ready</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {bloodBank.map((b) => (
            <div
              key={b.bloodGroup}
              onClick={() => setShowBloodBankModal(true)}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-rose-500 transition cursor-pointer text-center"
            >
              <span className="text-sm font-black text-rose-400 block">{b.bloodGroup}</span>
              <span className="text-[11px] font-bold text-slate-200">{b.unitsAvailable} Units</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Diagnostic Tests Orders Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Diagnostic Orders & Result Sign-off Desk ({tests.length} Orders)
          </h3>
          <span className="text-xs text-slate-500">Automated Lab Workflows</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Patient & ABHA</th>
                <th className="pb-3">Diagnostic Test</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Prescribed By</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                    {t.id}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {t.patientName} <br />
                    <span className="text-[10px] text-slate-400 font-mono">{t.abhaNumber || 'No ABHA'}</span>
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {t.testName}
                    {t.isCritical && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500 text-white uppercase">
                        Panic Value
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{t.category}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{t.doctorName}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                      'bg-amber-500/20 text-amber-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedLabTest(t)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold transition shadow-sm"
                    >
                      {t.status === 'Completed' ? 'View / Print Report' : 'Enter Values'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLabTest && (
        <LabReportModal
          labTest={selectedLabTest}
          onClose={() => setSelectedLabTest(null)}
          onUpdated={() => {
            setSelectedLabTest(null);
            fetchDashboard();
          }}
        />
      )}

      {showBloodBankModal && (
        <BloodBankModal
          bloodBank={bloodBank}
          onClose={() => setShowBloodBankModal(false)}
          onUpdated={() => {
            setShowBloodBankModal(false);
            fetchDashboard();
          }}
        />
      )}

    </div>
  );
};

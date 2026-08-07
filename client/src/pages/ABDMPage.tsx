import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { ShieldCheck, Building2, Stethoscope, FileText, CheckCircle2, Search, Plus, Sparkles } from 'lucide-react';
import { ABDMConsent } from '../types';
import { ABHACreatorModal } from '../components/abha/ABHACreatorModal';
import { ABDMConsentModal } from '../components/consent/ABDMConsentModal';

export const ABDMPage: React.FC = () => {
  const { addToast } = useNotification();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [consents, setConsents] = useState<ABDMConsent[]>([]);
  const [hfrSearch, setHfrSearch] = useState('');
  const [hprSearch, setHprSearch] = useState('');
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const fetchABDMData = async () => {
    try {
      const [hfrRes, hprRes, consentRes] = await Promise.all([
        API.get(`/abha/hfr-search?query=${encodeURIComponent(hfrSearch)}`),
        API.get(`/abha/hpr-search?query=${encodeURIComponent(hprSearch)}`),
        API.get('/abha/consents')
      ]);

      if (hfrRes.data.success) setFacilities(hfrRes.data.data);
      if (hprRes.data.success) setDoctors(hprRes.data.data);
      if (consentRes.data.success) setConsents(consentRes.data.data);
    } catch (err) {
      console.error('Fetch ABDM error:', err);
    }
  };

  useEffect(() => {
    fetchABDMData();
  }, [hfrSearch, hprSearch]);

  return (
    <div className="space-y-6">
      
      {/* ABDM Official Emblem Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
                M1 • M2 • M3 CERTIFIED
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Ayushman Bharat Digital Mission (ABDM) Integration
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              National Health Authority (NHA) certified infrastructure powering ABHA Citizen IDs, HFR Facility Registry, and HPR Professional verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setShowCreatorModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enroll ABHA Number</span>
          </button>
          <button
            onClick={() => setShowConsentModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Consent Manager ({consents.length})</span>
          </button>
        </div>
      </div>

      {/* Grid: HFR (Left) & HPR (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HFR Registry Search */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Health Facility Registry (HFR)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">MoHFW Verified</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={hfrSearch}
              onChange={(e) => setHfrSearch(e.target.value)}
              placeholder="Search Hospital Name, Facility ID or State..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2.5">
            {facilities.map((f) => (
              <div
                key={f.hfrId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">{f.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{f.hfrId}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {f.type} • {f.district}, {f.state}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>HIP: <strong className="font-mono">{f.hipId}</strong></span>
                  <span>•</span>
                  <span>HIU: <strong className="font-mono">{f.hiuId}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HPR Registry Search */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Healthcare Professionals Registry (HPR)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">NMC / State Councils</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={hprSearch}
              onChange={(e) => setHprSearch(e.target.value)}
              placeholder="Search Doctor by Name, HPR ID or Specialty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-2.5">
            {doctors.map((d) => (
              <div
                key={d.hprId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">{d.name}</h4>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">{d.hprId}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {d.specialty} • {d.registrationNo}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Medical Practitioner</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showCreatorModal && (
        <ABHACreatorModal
          onClose={() => setShowCreatorModal(false)}
          onCreated={() => {
            setShowCreatorModal(false);
            fetchABDMData();
          }}
        />
      )}

      {showConsentModal && (
        <ABDMConsentModal
          consents={consents}
          onClose={() => setShowConsentModal(false)}
          onUpdated={() => {
            fetchABDMData();
          }}
        />
      )}

    </div>
  );
};

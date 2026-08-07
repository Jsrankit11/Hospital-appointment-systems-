import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  Users, Search, Plus, ShieldCheck, CreditCard,
  FileText, Activity, Heart, Clock, Download, ChevronRight
} from 'lucide-react';
import { Patient } from '../types';
import { ABHACardModal } from '../components/abha/ABHACardModal';
import { ABHACreatorModal } from '../components/abha/ABHACreatorModal';

export const PatientsPage: React.FC = () => {
  const { addToast } = useNotification();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientHistory, setPatientHistory] = useState<any | null>(null);
  const [activeCardModal, setActiveCardModal] = useState<Patient | null>(null);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async (query = '') => {
    setLoading(true);
    try {
      const res = await API.get(`/patients?search=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setPatients(res.data.data);
        if (res.data.data.length > 0 && !selectedPatient) {
          fetchPatientTimeline(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Fetch patients error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientTimeline = async (patientId: string) => {
    try {
      const res = await API.get(`/patients/${patientId}`);
      if (res.data.success) {
        setSelectedPatient(res.data.data.patient);
        setPatientHistory(res.data.data.history);
      }
    } catch (err) {
      console.error('Fetch timeline error:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Patient Registry & Medical Passports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified citizen records compliant with Ayushman Bharat Digital Mission (ABDM).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCreatorModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enroll ABHA Citizen</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Directory Left, Passport Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Patient List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === '') fetchPatients('');
              }}
              placeholder="Search by Name, ABHA ID or Mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </form>

          {/* Cards List */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {patients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const hasABHA = Boolean(p.abhaNumber);

              return (
                <div
                  key={p.id}
                  onClick={() => fetchPatientTimeline(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photoUrl || (p.gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg')}
                        alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-teal-500/20"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {p.gender} • {p.age || 32} Yrs • <span className="font-bold text-rose-500">{p.bloodGroup || 'O+'}</span>
                        </p>
                      </div>
                    </div>

                    {hasABHA ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCardModal(p);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30"
                        title="View Official ABHA Digital ID Card"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>ABHA</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">No ABHA</span>
                    )}
                  </div>

                  {hasABHA && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{p.abhaNumber}</span>
                      <span className="text-slate-400">{p.mobile}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Patient Health Passport Timeline (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPatient ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPatient.photoUrl || (selectedPatient.gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg')}
                    alt={selectedPatient.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </h3>
                      {selectedPatient.abhaNumber && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          ABHA Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      ID: {selectedPatient.id} • {selectedPatient.address}, {selectedPatient.district}
                    </p>
                  </div>
                </div>

                {selectedPatient.abhaNumber && (
                  <button
                    onClick={() => setActiveCardModal(selectedPatient)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>View ABHA Card</span>
                  </button>
                )}
              </div>

              {/* Patient Key Medical Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Blood Group</span>
                  <span className="font-black text-sm text-rose-500">{selectedPatient.bloodGroup || 'O+'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Insurance</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate block">
                    {selectedPatient.insuranceProvider || 'PM-JAY'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2">
                  <span className="text-[10px] text-slate-400 block">Emergency Contact</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate block">
                    {selectedPatient.emergencyContact}
                  </span>
                </div>
              </div>

              {/* Electronic Health Records (EHR) Feed */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-500" />
                  <span>Clinical Consultations & Prescriptions</span>
                </h4>

                <div className="space-y-3">
                  {patientHistory?.ehrs?.map((ehr: any) => (
                    <div
                      key={ehr.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {ehr.diagnosis}
                          </span>
                          <p className="text-[11px] text-slate-500">{ehr.doctorName} • {ehr.department}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{ehr.date}</span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {ehr.clinicalNotes}
                      </p>

                      {/* Prescriptions */}
                      {ehr.prescriptions?.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Prescribed Medications (Rx)
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ehr.prescriptions.map((rx: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-semibold border border-teal-500/30"
                              >
                                💊 {rx.medicine} ({rx.dosage})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {(!patientHistory?.ehrs || patientHistory.ehrs.length === 0) && (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No clinical EHR consultations recorded yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              Select a patient from the registry to view their complete ABDM Health Passport.
            </div>
          )}
        </div>

      </div>

      {/* ABHA Plastic Card Modal */}
      {activeCardModal && (
        <ABHACardModal
          patient={activeCardModal}
          onClose={() => setActiveCardModal(null)}
        />
      )}

      {/* ABHA Creator Modal */}
      {showCreatorModal && (
        <ABHACreatorModal
          onClose={() => setShowCreatorModal(false)}
          onCreated={(newPatient) => {
            setShowCreatorModal(false);
            fetchPatients();
          }}
        />
      )}

    </div>
  );
};

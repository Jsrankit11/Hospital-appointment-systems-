import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, UserCheck, Clock, CheckCircle2, FileText, Activity } from 'lucide-react';
import { Appointment, EHR } from '../types';
import { DoctorConsultationDesk } from '../components/doctor/DoctorConsultationDesk';

export const DoctorPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [recentEHRs, setRecentEHRs] = useState<EHR[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctorQueue = async () => {
    setLoading(true);
    try {
      const res = await API.get('/doctor/queue');
      if (res.data.success) {
        setAppointments(res.data.data.appointments);
        if (res.data.data.appointments.length > 0 && !selectedAppointment) {
          const current = res.data.data.inConsultation || res.data.data.appointments[0];
          setSelectedAppointment(current);
        }
      }
    } catch (err) {
      console.error('Fetch doctor queue error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctor Clinical Desk & EHR Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Consultation roster for <strong className="text-teal-600 dark:text-teal-400">{user?.name || 'Dr. Arvind Sharma'}</strong> ({user?.department || 'Cardiology'})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Consultation Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assigned OPD Patients ({appointments.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {appointments.map((apt) => {
              const isSelected = selectedAppointment?.id === apt.id;
              const isConsulting = apt.status === 'In-Consultation';

              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold flex items-center justify-center text-xs border border-teal-500/20">
                        #{apt.tokenNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {apt.patientName}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{apt.type}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      isConsulting ? 'bg-teal-500 text-white animate-pulse' :
                      apt.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  {apt.symptoms && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800 truncate">
                      {apt.symptoms}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Consultation Desk & EHR Writer (8 cols) */}
        <div className="lg:col-span-8">
          <DoctorConsultationDesk
            currentAppointment={selectedAppointment}
            onSavedEHR={(newEHR) => {
              setRecentEHRs([newEHR, ...recentEHRs]);
              fetchDoctorQueue();
            }}
          />
        </div>

      </div>

    </div>
  );
};

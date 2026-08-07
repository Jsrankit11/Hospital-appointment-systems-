import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { emergencyActive, emergencyData, dismissEmergency } = useNotification();

  if (!emergencyActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-600 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl shadow-red-900/60 relative overflow-hidden animate-pulse-slow">
        {/* Top Warning Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500 animate-bounce">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-widest">
                CRITICAL BROADCAST
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {emergencyData?.code || 'CODE BLUE'} ACTIVATED
              </h3>
            </div>
          </div>
          <button
            onClick={dismissEmergency}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-red-950/40 border border-red-800/60">
          <p className="text-xs uppercase tracking-wider font-semibold text-red-400">Target Location</p>
          <p className="text-lg font-bold text-white mt-0.5">{emergencyData?.location || 'ICU Block B, 2nd Floor'}</p>
          <p className="text-sm text-slate-300 mt-2">{emergencyData?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Rapid Response Team</p>
              <p className="text-xs font-bold text-white">Ext: 2222 (Priority)</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Crash Cart Ready</p>
              <p className="text-xs font-bold text-white">Defibrillator Unit B</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={dismissEmergency}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg shadow-red-700/40 text-center"
          >
            Acknowledge & Dispatch Team
          </button>
        </div>
      </div>
    </div>
  );
};

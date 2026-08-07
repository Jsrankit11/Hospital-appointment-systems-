import React from 'react';
import { Appointment } from '../../types';
import { Volume2, Users, Clock, Stethoscope, ArrowRight } from 'lucide-react';

interface LiveTokenDisplayProps {
  queue: Appointment[];
  onCallToken: (appointmentId: string, status: string) => void;
}

export const LiveTokenDisplay: React.FC<LiveTokenDisplayProps> = ({ queue, onCallToken }) => {
  const currentToken = queue.find(a => a.status === 'In-Consultation');
  const waitingTokens = queue.filter(a => a.status === 'Waiting');

  return (
    <div className="rounded-3xl bg-slate-900 border-2 border-teal-500/40 text-white p-6 shadow-2xl overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-lg font-black tracking-wide text-white uppercase">
            Live OPD Calling Board
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
          <Volume2 className="w-4 h-4 animate-bounce" /> Audio Announcements Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* CURRENT SERVING TOKEN (Big TV Display) */}
        <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-teal-900/60 to-emerald-950/80 border-2 border-emerald-400 p-6 text-center flex flex-col justify-between shadow-xl shadow-teal-950/50">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 uppercase tracking-widest">
              Now Serving
            </span>
            <div className="my-6">
              <span className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                {currentToken ? `#${currentToken.tokenNumber}` : 'READY'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-teal-500/30 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-300">Patient Name</span>
              <p className="text-base font-bold text-white truncate">{currentToken?.patientName || 'Waiting next in line'}</p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-teal-300 block">Consulting Doctor</span>
                <span className="font-semibold text-slate-200">{currentToken?.doctorName || 'Dr. On Duty'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-teal-300 block">Room</span>
                <span className="font-bold text-emerald-400">{currentToken?.opdRoom || 'Room 104'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING TOKENS LIST */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Waiting Queue ({waitingTokens.length} Patients)
              </span>
              <span className="text-[11px] text-slate-500">Estimated wait: ~10 mins per token</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {waitingTokens.map((apt, idx) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 font-mono font-bold flex items-center justify-center text-base border border-slate-700">
                      #{apt.tokenNumber}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{apt.patientName}</p>
                      <p className="text-xs text-slate-400">{apt.department} • {apt.doctorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.priority === 'Emergency' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      apt.priority === 'Urgent' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {apt.priority}
                    </span>

                    <button
                      onClick={() => onCallToken(apt.id, 'In-Consultation')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-teal-600/30"
                    >
                      <span>Call Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {waitingTokens.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  All OPD patients have been consulted for this session.
                </div>
              )}
            </div>
          </div>

          {currentToken && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => onCallToken(currentToken.id, 'Completed')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
              >
                Complete Consultation & Issue e-Prescription
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

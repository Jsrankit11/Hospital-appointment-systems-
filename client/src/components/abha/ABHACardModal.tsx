import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Download, Printer, X, Sparkles, UserCheck } from 'lucide-react';
import { Patient } from '../../types';

interface ABHACardModalProps {
  patient: Patient | null;
  onClose: () => void;
}

export const ABHACardModal: React.FC<ABHACardModalProps> = ({ patient, onClose }) => {
  if (!patient) return null;

  const abhaNumber = patient.abhaNumber || '91-4829-1092-3341';
  const abhaAddress = patient.abhaAddress || `${patient.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@abdm`;
  const qrString = `https://ndhm.gov.in/abha?num=${abhaNumber}&phr=${abhaAddress}&name=${encodeURIComponent(patient.name)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Official ABHA Digital Health Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- OFFICIAL ABHA PLASTIC CARD LAYOUT --- */}
        <div 
          id="official-abha-card"
          className="print-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-emerald-500/40 text-white p-6 shadow-2xl"
        >
          {/* Top Tricolor Strip & National Emblem Simulator */}
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-400/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                  Government of India • MoHFW
                </p>
                <h4 className="text-sm font-extrabold tracking-wide text-white">
                  Ayushman Bharat Digital Mission (ABDM)
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
              ABHA Active
            </span>
          </div>

          {/* Body with Photo, Info & QR */}
          <div className="grid grid-cols-3 gap-4 items-center">
            
            {/* Citizen Photo */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-24 h-28 rounded-xl overflow-hidden ring-2 ring-emerald-500/50 bg-slate-800 shadow-md">
                <img
                  src={patient.photoUrl || (patient.gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg')}
                  alt={patient.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[9px] text-emerald-400 font-semibold mt-1">KYC VERIFIED</p>
            </div>

            {/* ABHA Details */}
            <div className="col-span-2 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Citizen Name</span>
                <span className="font-black text-sm text-white">{patient.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-medium">14-Digit ABHA Number</span>
                <span className="font-mono font-black text-emerald-400 tracking-wider text-sm bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  {abhaNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div>
                  <span className="text-[9px] text-slate-400 block">ABHA Address (PHR)</span>
                  <span className="font-semibold text-slate-200 truncate block text-[11px]">{abhaAddress}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Gender / Age</span>
                  <span className="font-semibold text-slate-200 text-[11px]">{patient.gender} • {patient.age || 32} Yrs</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 block">Blood Group</span>
                  <span className="font-bold text-rose-400 text-[11px]">{patient.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Mobile No.</span>
                  <span className="font-mono text-slate-200 text-[11px]">{patient.mobile}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Footer with QR and Barcode */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-lg shadow-sm">
                <QRCodeSVG value={qrString} size={52} />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                <p className="font-semibold text-slate-300">Scan at Hospital Kiosk</p>
                <p>Instant Paperless OPD Registration</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500">National Health Authority</p>
              <p className="text-[10px] font-bold text-emerald-400">pmjay.gov.in</p>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            Print Card
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition"
          >
            <Download className="w-4 h-4" />
            Download Digital Card
          </button>
        </div>

      </div>
    </div>
  );
};

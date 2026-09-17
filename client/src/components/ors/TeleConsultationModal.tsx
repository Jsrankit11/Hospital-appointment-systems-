import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, ShieldCheck, X, Sparkles, QrCode, FileText } from 'lucide-react';

interface TeleConsultationModalProps {
  onClose: () => void;
  language: 'en' | 'hi';
  doctor?: {
    name?: string;
    department?: string;
    hospital?: string;
    qualification?: string;
    image?: string;
  };
}

export const TeleConsultationModal: React.FC<TeleConsultationModalProps> = ({
  onClose,
  language,
  doctor
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showQRPass, setShowQRPass] = useState(false);

  const currentDoc = {
    name: doctor?.name || 'Dr. Arvind Sharma (Senior Consultant)',
    department: doctor?.department || 'Cardiology & General Medicine',
    hospital: doctor?.hospital || "King George's Medical University (KGMU Lucknow)",
    qualification: doctor?.qualification || 'MBBS, MD, DM (Cardiology)',
    image: doctor?.image || '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {language === 'en' ? 'e-Sanjeevani Govt Teleconsultation Room' : 'ई-संजीवनी राष्ट्रीय टेलीपरामर्श कक्ष'}
              </h3>
              <p className="text-xs text-slate-400">
                Live with: <strong className="text-teal-400">{currentDoc.name}</strong> • {currentDoc.hospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQRPass(!showQRPass)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQRPass ? 'Hide QR' : 'Scan QR Pass'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optional QR Pass Drawer */}
        {showQRPass && (
          <div className="mb-4 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
            <img
              src="/images/qr_code_scan.png"
              alt="Scan QR Code"
              className="w-20 h-20 object-contain rounded-xl border border-emerald-400 bg-white p-1 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/scan_qr_code.png';
              }}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-wide">
                Scan QR Code For Live Teleconsult Slip & Prescriptions
              </h5>
              <p className="text-[11px] text-slate-300">
                Scan this code with any smartphone camera or ABDM app to link this active video session with your Ayushman Health Locker.
              </p>
            </div>
          </div>
        )}

        {/* Video Simulation Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
          {isVideoOn ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-24 h-24 rounded-2xl border-4 border-teal-500 overflow-hidden shadow-xl">
                <img
                  src={currentDoc.image}
                  alt={currentDoc.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">{currentDoc.name}</h4>
                <p className="text-xs text-slate-300">{currentDoc.department} • {currentDoc.qualification}</p>
                <p className="text-xs text-teal-400 flex items-center justify-center gap-1.5 mt-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Govt Encrypted Call Active • {currentDoc.hospital}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
              <VideoOff className="w-8 h-8" />
              <span>Camera Paused</span>
            </div>
          )}

          {/* Citizen Self-View Inset In Corner */}
          <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl bg-slate-800 border-2 border-teal-500 overflow-hidden shadow-lg flex items-center justify-center">
            <img
              src="/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg"
              alt="Citizen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Floating Call Controls */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              isMicOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer ${
              isVideoOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Teleconsult</span>
          </button>
        </div>

      </div>
    </div>
  );
};

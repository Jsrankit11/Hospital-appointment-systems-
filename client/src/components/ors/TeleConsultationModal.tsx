import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, ShieldCheck, X, Sparkles } from 'lucide-react';

interface TeleConsultationModalProps {
  onClose: () => void;
  language: 'en' | 'hi';
}

export const TeleConsultationModal: React.FC<TeleConsultationModalProps> = ({ onClose, language }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {language === 'en' ? 'National Teleconsultation Room (e-Sanjeevani)' : 'राष्ट्रीय टेलीपरामर्श कक्ष (ई-संजीवनी)'}
              </h3>
              <p className="text-xs text-slate-400">
                Connected with: <strong className="text-teal-400">Dr. Arvind Sharma (MD, DM Cardiology)</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Simulation Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
          {isVideoOn ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-20 h-20 rounded-full border-4 border-teal-500 overflow-hidden shadow-lg">
                <img
                  src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Dr. Arvind Sharma (Cardiologist)</h4>
                <p className="text-xs text-teal-400 flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Consult Active • AIIMS New Delhi</span>
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
            className={`p-3.5 rounded-2xl border transition ${
              isMicOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3.5 rounded-2xl border transition ${
              isVideoOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Teleconsult</span>
          </button>
        </div>

      </div>
    </div>
  );
};

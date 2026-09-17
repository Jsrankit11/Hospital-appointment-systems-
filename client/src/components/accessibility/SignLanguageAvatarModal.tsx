import React, { useState } from 'react';
import {
  HandMetal, X, Play, Pause, RotateCcw, Volume2,
  CheckCircle2, HeartPulse, Stethoscope, Building2, Pill
} from 'lucide-react';

interface SignLanguageAvatarModalProps {
  onClose: () => void;
  language?: 'en' | 'hi';
}

export const SignLanguageAvatarModal: React.FC<SignLanguageAvatarModalProps> = ({
  onClose,
  language = 'en'
}) => {
  const isHindi = language === 'hi';
  const [isPlaying, setIsPlaying] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    title: string;
    hindiTitle: string;
    gestureDesc: string;
    captionHindi: string;
    captionEnglish: string;
    icon: any;
  }>({
    id: 'CHEST_PAIN',
    title: 'Emergency: Chest Pain / Heart',
    hindiTitle: 'आपातकाल: सीने में दर्द / हृदय',
    gestureDesc: 'Avatar places right fist over central chest, pumps slightly, and waves two fingers upward to signal emergency priority triage.',
    captionHindi: 'यदि आपको सीने में तेज दर्द या सांस लेने में भारीपन है, तुरंत आपातकालीन कक्ष में जाएं।',
    captionEnglish: 'If you have acute chest pain or breathlessness, proceed directly to the Emergency Room.',
    icon: HeartPulse
  });

  const topics = [
    {
      id: 'CHEST_PAIN',
      title: 'Emergency: Chest Pain / Heart',
      hindiTitle: 'आपातकाल: सीने में दर्द',
      gestureDesc: 'Right fist pressed to chest with urgent circular motion.',
      captionHindi: 'यदि आपको सीने में तेज दर्द है, तुरंत इमरजेंसी डेस्क पर जाएं।',
      captionEnglish: 'Acute chest pain requires immediate emergency evaluation.',
      icon: HeartPulse
    },
    {
      id: 'OPD_TOKEN',
      title: 'OPD Registration & Token Desk',
      hindiTitle: 'ओपीडी पर्ची एवं टोकन',
      gestureDesc: 'Both hands holding virtual ticket, points toward registration counter.',
      captionHindi: 'ऑनलाइन टोकन नंबर प्राप्त करें और अपने डॉक्टर रूम के बाहर प्रतीक्षा करें।',
      captionEnglish: 'Obtain your digital token number and wait outside the designated OPD room.',
      icon: Building2
    },
    {
      id: 'DOCTOR_CONSULT',
      title: 'Doctor Consultation & Pulse Check',
      hindiTitle: 'डॉक्टर परामर्श एवं नाड़ी जांच',
      gestureDesc: 'Index and middle finger touch left wrist to indicate pulse and stethoscope check.',
      captionHindi: 'डॉक्टर आपके लक्षणों की जांच करेंगे और आवश्यक दवाएं लिखेंगे।',
      captionEnglish: 'The physician will examine your pulse, vitals, and issue e-prescriptions.',
      icon: Stethoscope
    },
    {
      id: 'PHARMACY',
      title: 'Pharmacy & Medicine Dispensing',
      hindiTitle: 'दवा वितरण केंद्र (फार्मेसी)',
      gestureDesc: 'Left palm flat, right thumb and index mimic placing medicine pill in palm.',
      captionHindi: 'पर्चा दिखाकर फार्मेसी काउंटर से नि:शुल्क या रियायती दवाएं प्राप्त करें।',
      captionEnglish: 'Collect prescribed medications at the hospital pharmacy counter.',
      icon: Pill
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-600/15 via-indigo-500/10 to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? 'सांकेतिक भाषा वीडियो अवतार (ISL)' : 'Sign Language Visual Healthcare Avatar (ISL)'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Universal Inclusion
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'श्रवण एवं वाक् दिव्यांग नागरिकों के लिए सांकेतिक मार्गदर्शन' : 'Visual gesture assistance for hearing & speech impaired patients'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Animated Avatar Screen Container */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-purple-500/30 overflow-hidden p-6 text-white shadow-2xl flex flex-col items-center justify-center min-h-[260px]">
            
            {/* Visual Animated Avatar Silhouette / Canvas */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600/30 to-teal-500/30 border-2 border-purple-400/40 flex items-center justify-center shadow-inner mb-4">
              <div className="w-28 h-28 rounded-full bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-purple-400/20 border border-purple-400/40 flex items-center justify-center mb-1 animate-bounce">
                  <HandMetal className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-300">ISL AVATAR</span>
              </div>
              
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping" />
              )}
            </div>

            {/* Gesture description banner */}
            <div className="max-w-md text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 uppercase tracking-wide inline-block">
                {isHindi ? selectedTopic.hindiTitle : selectedTopic.title}
              </span>
              <p className="text-xs text-slate-300 font-medium">{selectedTopic.gestureDesc}</p>
            </div>

            {/* Live Subtitles & Captions Bar */}
            <div className="mt-4 w-full p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-center space-y-1">
              <p className="text-xs sm:text-sm font-bold text-yellow-300">
                "{isHindi ? selectedTopic.captionHindi : selectedTopic.captionEnglish}"
              </p>
              <p className="text-[10px] text-slate-400">
                {isHindi ? selectedTopic.captionEnglish : selectedTopic.captionHindi}
              </p>
            </div>

          </div>

          {/* Gesture Topic Selectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isHindi ? 'सामान्य अस्पताल संकेत विषय' : 'Standard Healthcare Sign Demonstrations'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTopic.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {isHindi ? t.hindiTitle : t.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 truncate">{t.captionEnglish}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

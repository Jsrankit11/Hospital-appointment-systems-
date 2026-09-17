import React, { useState } from 'react';
import {
  Volume2, VolumeX, Eye, ZoomIn, ZoomOut,
  Accessibility, Languages, X, HelpCircle, HandMetal
} from 'lucide-react';

interface AccessibilityControlsProps {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  screenReaderActive: boolean;
  setScreenReaderActive: (val: boolean) => void;
  onOpenSignLanguageAvatar: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
  screenReaderActive,
  setScreenReaderActive,
  onOpenSignLanguageAvatar
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const speakHelper = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'hi-IN';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Expanded Accessibility Menu */}
      {isOpen && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500 shadow-2xl space-y-3 w-72 animate-fadeIn text-xs">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-teal-500" />
              <strong className="text-slate-900 dark:text-white">Universal Accessibility (सुगम्यता)</strong>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            
            {/* High Contrast Mode */}
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                if (screenReaderActive) speakHelper(highContrast ? 'उच्च कंट्रास्ट बंद किया गया' : 'उच्च कंट्रास्ट चालू किया गया');
              }}
              className={`w-full p-2.5 rounded-xl font-bold border flex items-center justify-between transition ${
                highContrast
                  ? 'bg-amber-400 text-black border-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                High Contrast (उच्च कंट्रास्ट)
              </span>
              <span className="text-[10px] uppercase font-black">{highContrast ? 'ON' : 'OFF'}</span>
            </button>

            {/* Large Font Size */}
            <button
              onClick={() => {
                setLargeText(!largeText);
                if (screenReaderActive) speakHelper(largeText ? 'सामान्य अक्षर आकार' : 'बड़ा अक्षर आकार चालू किया गया');
              }}
              className={`w-full p-2.5 rounded-xl font-bold border flex items-center justify-between transition ${
                largeText
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Large Text (बड़ा फ़ॉन्ट)
              </span>
              <span className="text-[10px] uppercase font-black">{largeText ? 'LARGE' : 'NORMAL'}</span>
            </button>

            {/* Audio Voice Narrator */}
            <button
              onClick={() => {
                setScreenReaderActive(!screenReaderActive);
                speakHelper(!screenReaderActive ? 'आवाज द्वारा स्क्रीन निर्देश चालू किए गए' : 'स्क्रीन निर्देश बंद किए गए');
              }}
              className={`w-full p-2.5 rounded-xl font-bold border flex items-center justify-between transition ${
                screenReaderActive
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                {screenReaderActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Voice Narrator (आवाज सहायक)
              </span>
              <span className="text-[10px] uppercase font-black">{screenReaderActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* Sign Language Visual Avatar */}
            <button
              onClick={() => {
                onOpenSignLanguageAvatar();
                setIsOpen(false);
              }}
              className="w-full p-2.5 rounded-xl font-bold border bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md"
            >
              <span className="flex items-center gap-2">
                <HandMetal className="w-4 h-4" />
                Sign Language Avatar (सांकेतिक भाषा)
              </span>
              <span className="text-[9px] uppercase font-black bg-white/20 px-2 py-0.5 rounded">NEW</span>
            </button>

          </div>

        </div>
      )}

      {/* Floating Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Universal Accessibility Settings"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-teal-500/30 border-2 border-white dark:border-slate-900 transition"
      >
        <Accessibility className="w-7 h-7" />
      </button>

    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ShieldCheck, Phone, Globe, Moon, Sun, AlertCircle,
  Sparkles, Building2, UserCircle, LogIn, LogOut, KeyRound, HeartPulse
} from 'lucide-react';

interface JSRHeaderProps {
  onToggleConsole: () => void;
  isConsoleView: boolean;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  onOpenBooking: () => void;
  onOpenLab: () => void;
  onOpenBlood: () => void;
  onOpenPayment: () => void;
  onOpenABHA: () => void;
  onOpenAuthModal: () => void;
}

export const JSRHeader: React.FC<JSRHeaderProps> = ({
  onToggleConsole,
  isConsoleView,
  language,
  setLanguage,
  onOpenBooking,
  onOpenLab,
  onOpenBlood,
  onOpenPayment,
  onOpenABHA,
  onOpenAuthModal
}) => {
  const { user, logout } = useAuth();
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      
      {/* --- 1. TOP BRAND & ACCESSIBILITY BAR --- */}
      <div className="bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: JSR Branding */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">JSR Healthcare Portal</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-semibold">
              Designed & Developed by Ankit Chaudhary
            </span>
          </div>

          {/* Right: Helplines, Dark Mode, Text Size & Language Switch */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-bold">
              <Phone className="w-3 h-3" />
              <span>24/7 Helpline: 1800-11-4477</span>
            </div>

            {/* Dark Mode Switch */}
            <ThemeToggle />

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* --- 2. MAIN JSR PORTAL HEADER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: JSR Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-lg shadow-teal-900/30">
            JSR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                JSR Healthcare
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Hospital Portal
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'All-India Hospital Appointments, Diagnostics & Digital Records' : 'अखिल भारतीय अस्पताल नियुक्तियाँ, डायग्नोस्टिक्स एवं डिजिटल रिकॉर्ड'}
            </p>
          </div>
        </div>

        {/* Right: Citizen Login / Profile & Switch to Hospital Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {user ? (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[130px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Login / Register' : 'लॉगिन / पंजीकरण'}</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <span>{language === 'en' ? 'Book OPD' : 'ओपीडी बुक करें'}</span>
          </button>

          <button
            onClick={onToggleConsole}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            <Building2 className="w-4 h-4 text-teal-500" />
            <span className="hidden md:inline">
              {isConsoleView ? 'Back to Portal' : 'Hospital Admin Desk'}
            </span>
            <span className="md:hidden">
              {isConsoleView ? 'Portal' : 'Admin'}
            </span>
          </button>
        </div>

      </div>

      {/* --- 3. LIVE TICKER STRIP --- */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white py-1.5 px-4 text-xs font-semibold overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-black uppercase tracking-wider">
              JSR LIVE
            </span>
          </div>
          <div className="marquee flex-1 truncate text-xs text-emerald-100">
            {language === 'en'
              ? '✨ JSR Healthcare Portal by Ankit Chaudhary: Instant online OPD booking, real-time lab reports, and blood availability across 500+ apex Indian hospitals.'
              : '✨ जेएसआर हेल्थकेयर पोर्टल (अंकित चौधरी द्वारा निर्मित): 500+ प्रमुख अस्पतालों में त्वरित ऑनलाइन ओपीडी, लैब रिपोर्ट और रक्त उपलब्धता।'}
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[11px] shrink-0 text-emerald-200">
            <span>28 States & UTs</span> • <span>Instant UPI QR & Tax Invoice</span>
          </div>
        </div>
      </div>

    </header>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ShieldCheck, Phone, Globe, Moon, Sun, AlertCircle,
  Sparkles, Building2, UserCircle, LogIn, LogOut, KeyRound, HeartPulse,
  Calendar, CheckCircle2, UserCheck
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

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      
      {/* --- 1. TOP BRAND & ACCESSIBILITY BAR --- */}
      <div className="bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: JSR Branding */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">JSR Healthcare Portal</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-emerald-400 font-semibold">
              Designed & Developed by Ankit Chaudhary
            </span>
          </div>

          {/* Right: Helplines, Dark Mode & Language */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-1 text-emerald-400 font-bold">
              <Phone className="w-3 h-3" />
              <span>1800-11-4477</span>
            </div>

            {/* Dark Mode Switch */}
            <ThemeToggle />

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px]"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* --- 2. MAIN HEADER (DESKTOP & TABLET) --- */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* Left: JSR Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center font-black text-base sm:text-xl shadow-lg shadow-teal-900/20 shrink-0">
            JSR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                JSR Healthcare
              </h1>
              <span className="hidden xs:inline px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Hospital Portal
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none">
              {language === 'en' ? 'All-India Hospital Appointments & Digital Health' : 'अखिल भारतीय अस्पताल नियुक्तियाँ एवं डिजिटल स्वास्थ्य'}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Prominent on all screens) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* User Session Badge */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-2 sm:px-3 py-1 rounded-2xl">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[110px]">
                  {user.name}
                </p>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition border border-slate-700 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">{language === 'en' ? 'Login / Register' : 'लॉगिन / पंजीकरण'}</span>
              <span className="xs:hidden">Login</span>
            </button>
          )}

          {/* Book OPD Button */}
          <button
            onClick={onOpenBooking}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Book OPD' : 'ओपीडी बुक'}</span>
          </button>

          {/* Prominent Hospital Admin Desk Button */}
          <button
            onClick={onToggleConsole}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition border shadow-md shrink-0 ${
              isConsoleView
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white border-teal-400/40 shadow-teal-700/30 hover:scale-105'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>
              {isConsoleView
                ? (language === 'en' ? '← Citizen Portal' : '← नागरिक पोर्टल')
                : (language === 'en' ? '🏥 Hospital Admin Desk' : '🏥 अस्पताल एडमिन')}
            </span>
          </button>

        </div>

      </div>

      {/* --- 3. MOBILE QUICK NAVIGATION STRIP (Always visible on mobile) --- */}
      <div className="sm:hidden bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 px-3 py-2 flex items-center justify-between gap-2">
        <button
          onClick={onOpenBooking}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-sm"
        >
          <Calendar className="w-3 h-3" />
          <span>Book OPD</span>
        </button>

        <button
          onClick={onOpenAuthModal}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[11px] font-bold shadow-sm"
        >
          <LogIn className="w-3 h-3 text-amber-400" />
          <span>{user ? 'My Profile' : 'Login / Register'}</span>
        </button>

        <button
          onClick={onToggleConsole}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-teal-600 text-white text-[11px] font-bold shadow-sm"
        >
          <Building2 className="w-3 h-3" />
          <span>{isConsoleView ? 'Portal' : 'Admin'}</span>
        </button>
      </div>

      {/* --- 4. LIVE TICKER STRIP --- */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white py-1 px-3 text-[11px] font-semibold overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-black uppercase tracking-wider">
              LIVE
            </span>
          </div>
          <div className="marquee flex-1 truncate text-[11px] text-emerald-100">
            {language === 'en'
              ? '✨ JSR Healthcare by Ankit Chaudhary: Instant online OPD booking, real-time lab reports, and blood availability across 500+ apex Indian hospitals.'
              : '✨ जेएसआर हेल्थकेयर (अंकित चौधरी द्वारा निर्मित): 500+ प्रमुख अस्पतालों में त्वरित ऑनलाइन ओपीडी, लैब रिपोर्ट और रक्त उपलब्धता।'}
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[10px] shrink-0 text-emerald-200">
            <span>28 States & UTs</span> • <span>Dynamic UPI QR Ready</span>
          </div>
        </div>
      </div>

    </header>
  );
};

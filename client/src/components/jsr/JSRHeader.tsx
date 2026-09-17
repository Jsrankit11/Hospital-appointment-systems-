import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ShieldCheck, Phone, Globe, Moon, Sun, AlertCircle,
  Mic, Building2, UserCircle, LogIn, LogOut, KeyRound, HeartPulse,
  Calendar, CheckCircle2, UserCheck, Sparkles, Search, ChevronDown, Activity
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
  onOpenAuthModal?: () => void;
  onOpenAICaseTaking?: () => void;
  onOpenPatientPortal?: () => void;
  onOpenMediKiosk?: () => void;
  onOpenTriage?: () => void;
  onOpenKioskMode?: () => void;
  onOpenGeminiCopilot?: () => void;
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
  onOpenAuthModal,
  onOpenAICaseTaking,
  onOpenPatientPortal,
  onOpenMediKiosk,
  onOpenTriage,
  onOpenKioskMode,
  onOpenGeminiCopilot
}) => {

  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors no-print">
      
      {/* Top Bar for Mobile & Accessibility */}
      <div className="bg-emerald-900 text-slate-200 text-[11px] font-medium border-b border-emerald-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-300">🇮🇳 India's Smart Healthcare Platform</span>
            <span className="text-emerald-500">•</span>
            <span className="text-slate-300">Ministry of Ayush & ABDM Integrated</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-emerald-300">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>National Toll-Free: 1800-11-4477</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Tagline */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                JSR Healthcare
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {language === 'en' ? 'Care Today, Healthier Tomorrow' : 'आज देखभाल, स्वस्थ कल'}
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-emerald-600 dark:text-emerald-400 font-bold transition hover:text-emerald-700"
          >
            Home
          </button>
          
          <button 
            onClick={onOpenBooking}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Services
          </button>

          <button 
            onClick={onOpenGeminiCopilot || onOpenAICaseTaking}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1"
          >
            <span>AI Doctor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </button>

          <button 
            onClick={onOpenMediKiosk || onOpenAICaseTaking}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Medikiosk
          </button>

          <button 
            onClick={onOpenBooking}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            Hospitals
          </button>

          <button 
            onClick={onOpenPatientPortal || onOpenABHA}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            About
          </button>
        </nav>

        {/* Right: Search, Language Switch & Login/Register */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={onOpenBooking}
            title="Search Hospital or Doctor"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Login / Register Pill Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[80px]">
                {user.name}
              </span>
              <button onClick={logout} title="Logout" className="text-slate-400 hover:text-rose-500 ml-1">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Login / Register' : 'लॉगिन / रजिस्टर'}</span>
            </button>
          )}

          {/* Prominent Hospital Admin Desk Button */}
          <button
            onClick={onToggleConsole}
            title={isConsoleView ? 'Switch to Portal View' : 'Switch to Hospital Console'}
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden lg:block"
          >
            <Building2 className="w-4 h-4" />
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
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[12px] font-black shadow-lg border-2 ring-2 ring-offset-1 ${
            isConsoleView
              ? 'bg-amber-500 text-slate-950 border-amber-400 ring-amber-500/30'
              : 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-red-500/50 ring-red-500/40 animate-pulse'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isConsoleView ? 'Citizen Portal' : 'Admin Desk'}</span>
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

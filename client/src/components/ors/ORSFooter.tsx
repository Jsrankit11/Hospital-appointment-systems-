import React from 'react';
import { HeartPulse, Globe, Linkedin, Youtube, Twitter, Instagram } from 'lucide-react';

interface ORSFooterProps {
  language: 'en' | 'hi';
}

export const ORSFooter: React.FC<ORSFooterProps> = ({ language }) => {
  return (
    <footer className="mt-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Main Footer Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">JSR Healthcare</h4>
            <p className="text-[10px] text-emerald-400 font-semibold">
              {language === 'en' ? 'Care Today, Healthier Tomorrow' : 'आज देखभाल, स्वस्थ कल'}
            </p>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs font-semibold text-slate-300">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-emerald-400 transition">
            Home
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="hover:text-emerald-400 transition">
            Services
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="hover:text-emerald-400 transition">
            Hospitals
          </button>
          <span className="text-slate-700">•</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-emerald-400 transition">
            About
          </button>
          <span className="text-slate-700">•</span>
          <a href="mailto:support@jsrhealthcare.gov.in" className="hover:text-emerald-400 transition">
            Contact
          </a>
        </div>

        {/* Right: Social Media & National Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition" title="LinkedIn"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-400 transition" title="YouTube"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-400 transition" title="Twitter"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-400 transition" title="Instagram"><Instagram className="w-4 h-4" /></a>
          </div>
          <span className="text-[11px] font-bold text-slate-300">
            Building a Healthier India Together 🇮🇳
          </span>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-900 py-3 bg-slate-950 text-center text-[10px] text-slate-500">
        <p>© 2026 JSR Healthcare Portal. Designed & Developed by Ankit Chaudhary & JSR Team. Smart India Hackathon.</p>
      </div>

    </footer>
  );
};

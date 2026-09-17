import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

interface ORSFooterProps {
  language: 'en' | 'hi';
}

export const ORSFooter: React.FC<ORSFooterProps> = ({ language }) => {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      
      {/* Top Links Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-sm">
            <img
              src="/images/ORS1.png"
              alt="ORS"
              className="h-8 w-auto object-contain rounded"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <span>ORS Portal</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {language === 'en'
              ? 'Online Registration System (ORS) is a framework to link various hospitals across the country for Aadhaar-based online registration and appointment system.'
              : 'ऑनलाइन पंजीकरण प्रणाली (ओआरएस) देश भर के विभिन्न अस्पतालों को आधार-आधारित ऑनलाइन पंजीकरण एवं अपॉइंटमेंट प्रणाली से जोड़ने वाला ढांचा है।'}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            National Portals
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Ayushman Bharat Digital Mission (ABDM)</a></li>
            <li><a href="https://nha.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">National Health Authority (NHA)</a></li>
            <li><a href="https://mohfw.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Ministry of Health & Family Welfare</a></li>
            <li><a href="https://eraktkosh.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">e-RaktKosh Blood Bank Registry</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Citizen Services
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><span>Book OPD Appointment</span></li>
            <li><span>Download Lab Diagnostic Reports</span></li>
            <li><span>Check Blood Bank Stock</span></li>
            <li><span>Online Hospital Fee Payment</span></li>
            <li><span>e-Sanjeevani Tele-Consultation</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Helpdesk & Toll Free
          </h4>
          <div className="space-y-2 text-[11px]">
            <p className="text-white font-bold">Toll Free: 1800-11-4477</p>
            <p className="text-emerald-400 font-bold">Health Helpline: 1075</p>
            <p className="text-slate-500">Center for Development of Advanced Computing (C-DAC) & NIC</p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-slate-800/80 py-4 bg-slate-950 text-slate-500 text-[10px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Online Registration System (ORS). Designed and Developed by National Informatics Centre (NIC), Government of India.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Accessibility Statement</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

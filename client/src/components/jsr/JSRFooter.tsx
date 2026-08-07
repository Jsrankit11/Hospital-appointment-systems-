import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

interface JSRFooterProps {
  language: 'en' | 'hi';
}

export const JSRFooter: React.FC<JSRFooterProps> = ({ language }) => {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs no-print">
      
      {/* Top Links Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-sm">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xs">
              JSR
            </div>
            <span>JSR Healthcare Portal</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {language === 'en'
              ? 'Complete healthcare management system for real-time OPD bookings, diagnostic reports, blood bank availability, and GST-compliant invoicing across 500+ Indian hospitals.'
              : '500+ अस्पतालों में वास्तविक समय ओपीडी बुकिंग, लैब रिपोर्ट, ब्लड बैंक स्टॉक और डिजिटल भुगतान की संपूर्ण स्वास्थ्य प्रबंधन प्रणाली।'}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Quick Portals
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><span>All-India OPD Registration</span></li>
            <li><span>Pathology & Lab Diagnostics</span></li>
            <li><span>Live Blood Bank Reserves</span></li>
            <li><span>Dynamic UPI Payment Gateway</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Hospital Networks
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><span>AIIMS New Delhi, Rishikesh, Bhopal</span></li>
            <li><span>KEM & Tata Memorial Mumbai</span></li>
            <li><span>NIMHANS & Narayana Bengaluru</span></li>
            <li><span>CMC Vellore & KGMU Lucknow</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
            Contact & Developer
          </h4>
          <div className="space-y-2 text-[11px]">
            <p className="text-white font-bold">24/7 Helpline: 1800-11-4477</p>
            <p className="text-emerald-400 font-bold">Email: ankitchaudhary8081039@gmail.com</p>
            <p className="text-slate-400">Created by: <strong>Ankit Chaudhary</strong></p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-slate-800/80 py-4 bg-slate-950 text-slate-500 text-[10px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 JSR Healthcare Portal. Designed & Developed by <strong>Ankit Chaudhary</strong>. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

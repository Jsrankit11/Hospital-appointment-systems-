import React from 'react';
import {
  LayoutDashboard, CreditCard, Users, Stethoscope,
  FlaskConical, Pill, BedDouble, Receipt, ShieldCheck,
  FileSpreadsheet, Sparkles, X, HeartPulse, ChevronRight, KeyRound, UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'users', label: 'Users & Passwords DB', icon: KeyRound, badge: 'Saved' },
    { id: 'abha', label: 'ABHA Health ID', icon: CreditCard, badge: 'ABDM' },
    { id: 'opd', label: 'OPD & Token Queue', icon: Users, badge: 'Tokens' },
    { id: 'doctor', label: 'Doctor Desk & EHR', icon: Stethoscope, badge: 'Rx' },
    { id: 'lab', label: 'Pathology & Labs', icon: FlaskConical, badge: 'Blood' },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, badge: 'POS' },
    { id: 'beds', label: 'ICU & Bed Matrix', icon: BedDouble, badge: 'Grid' },
    { id: 'billing', label: 'Billing & UPI Pay', icon: Receipt, badge: 'GST' },
    { id: 'patients', label: 'Patient Master Roster', icon: UserCheck, badge: 'EHR' },
    { id: 'abdm', label: 'ABDM Consent Manager', icon: ShieldCheck, badge: 'HIP/HIU' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-40 w-64 md:w-60 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xs text-slate-400 uppercase tracking-wider">HAMS Navigation</span>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Excel Download Quick Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <a
            href="/api/export/patients"
            download
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export Roster (.xlsx)</span>
            </div>
            <img src="/images/97795-download-green.gif" alt="Download" className="w-4 h-4 object-contain" />
          </a>
        </div>
      </aside>
    </>
  );
};

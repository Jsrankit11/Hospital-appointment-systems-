import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';
import {
  ShieldCheck, AlertOctagon, UserCircle, LogOut, ChevronDown,
  Menu, X, Check, Activity, Bell, Sparkles, Building2
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeTab, setActiveTab }) => {
  const { user, quickSwitchRole, logout } = useAuth();
  const { triggerEmergencyCodeBlue, addToast } = useNotification();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const roles: { key: UserRole; label: string; desc: string; icon: string }[] = [
    { key: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Hospital Overview, Analytics & Governance', icon: '👑' },
    { key: 'DOCTOR', label: 'Doctor Console', desc: 'OPD Queue, Vitals, Rx & Lab Orders', icon: '🩺' },
    { key: 'RECEPTIONIST', label: 'Reception & OPD', desc: 'Fast Registration & Token Desk', icon: '📋' },
    { key: 'LAB_TECHNICIAN', label: 'Lab & Diagnostics', desc: 'Pathology, Blood Bank & Reports', icon: '🔬' },
    { key: 'PHARMACIST', label: 'Pharmacy & POS', desc: 'Drug Inventory & Prescription Dispensing', icon: '💊' },
    { key: 'PATIENT', label: 'Patient Portal', desc: 'ABHA Health Card & Medical Timeline', icon: '👤' },
  ];

  const handleRoleSelect = async (role: UserRole) => {
    await quickSwitchRole(role);
    setRoleDropdownOpen(false);
    addToast('info', 'Role Switched', `Logged in as ${role.replace('_', ' ')}`);
  };

  const toggleDarkMode = () => {
    const nextDark = !dark;
    setDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src="/images/ORS1.png"
                  alt="HAMS ORS Logo"
                  className="h-10 sm:h-12 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    HAMS<span className="text-teal-500">.</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> ABDM M1-M3
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Hospital & Healthcare Management System
                </p>
              </div>
            </div>
          </div>

          {/* Right: Emergency Code Blue, Role Switcher, Notifications, Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Quick Emergency Code Blue Trigger */}
            <button
              onClick={() => triggerEmergencyCodeBlue('Emergency Triage, Ward A')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm"
              title="Broadcast Emergency Code Blue to all wards"
            >
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline">Code Blue</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Current Role</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {user?.role ? user.role.replace('_', ' ') : 'SUPER ADMIN'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Switch Role Persona</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant multi-role simulation without re-login</p>
                  </div>
                  <div className="space-y-1">
                    {roles.map((r) => {
                      const isCurrent = user?.role === r.key;
                      return (
                        <button
                          key={r.key}
                          onClick={() => handleRoleSelect(r.key)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isCurrent
                              ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-bold ${isCurrent ? 'text-teal-700 dark:text-teal-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                {r.label}
                              </p>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-teal-500" />}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user?.avatar || '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg'}
                alt={user?.name || 'User Profile'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-teal-500/30"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {user?.name || 'Dr. Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {user?.badge || 'Medical Director'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

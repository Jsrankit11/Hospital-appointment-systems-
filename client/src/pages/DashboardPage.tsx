import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Users, Stethoscope, BedDouble, Receipt, FlaskConical,
  Pill, ShieldCheck, ArrowUpRight, TrendingUp, AlertTriangle,
  Clock, Activity, Plus
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid
} from 'recharts';
import { HospitalStats } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenABHA: () => void;
  onOpenOPD: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenABHA, onOpenOPD }) => {
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
          setDepartmentStats(res.data.departmentStats);
          setWeeklyTrend(res.data.weeklyTrend);
          setNotifications(res.data.recentNotifications);
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
    };

    fetchAnalytics();
  }, []);

  const statCards = [
    {
      title: 'Total Registered Patients',
      value: stats?.totalPatients || 124,
      change: '+14% today',
      icon: Users,
      color: 'from-teal-500 to-emerald-600',
      actionTab: 'patients'
    },
    {
      title: 'Active OPD Tokens',
      value: stats?.totalOPD || 42,
      sub: `${stats?.waitingOPD || 6} in waiting room`,
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-600',
      actionTab: 'opd'
    },
    {
      title: 'Bed Occupancy Rate',
      value: `${stats?.bedOccupancyRate || 68}%`,
      sub: `${stats?.occupiedBeds || 6} / ${stats?.totalBeds || 9} Beds occupied`,
      icon: BedDouble,
      color: 'from-amber-500 to-orange-600',
      actionTab: 'beds'
    },
    {
      title: 'Daily Hospital Revenue',
      value: `₹${(stats?.totalRevenue || 45300).toLocaleString('en-IN')}`,
      change: 'UPI & Gateways',
      icon: Receipt,
      color: 'from-emerald-500 to-teal-700',
      actionTab: 'billing'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              ABDM Certified Platform
            </span>
            <span className="text-xs text-slate-400 font-mono">Gateway Uptime: 99.98%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AIIMS Central Hospital Executive Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time control center integrating ABHA digital identities, live OPD queues, ICU bed matrices, and electronic medical records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={onOpenABHA}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Generate ABHA ID</span>
          </button>
          <button
            onClick={onOpenOPD}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New OPD Token</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(c.actionTab)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{c.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {c.value}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.sub || c.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly OPD & Admissions Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Weekly OPD & Emergency Footfall Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Patient admissions vs outpatient registrations</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-teal-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> OPD Walk-in
              </span>
              <span className="flex items-center gap-1 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Emergency
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="opd" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorOpd)" />
                <Area type="monotone" dataKey="emergency" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorEmg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Department Performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Patient volume & revenue share</p>

            <div className="space-y-3">
              {departmentStats.map((d, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{d.name}</span>
                    <span className="text-teal-600 dark:text-teal-400">₹{d.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (d.patients / 50) * 100)}%`,
                        backgroundColor: d.color || '#14b8a6'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">ABHA Adoption</span>
            <span className="font-bold text-emerald-500">{stats?.abhaAdoptionRate || 85}% linked</span>
          </div>
        </div>

      </div>

      {/* Multi-Channel Alerts Activity Stream */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Multi-Channel Dispatch Ledger (SMS, WhatsApp, ABDM Notifications)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Real-Time Event Stream</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {notifications.slice(0, 6).map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase">
                  {n.channel}
                </span>
                <span className="text-[10px] text-slate-400">{n.status}</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white truncate">{n.subject}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2 leading-relaxed">{n.message}</p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="col-span-3 text-center py-6 text-slate-500 text-xs">
              Dispatches for patient OTPs, OPD tokens, and lab releases will stream here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

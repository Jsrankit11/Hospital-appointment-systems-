import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { BedDouble, HeartPulse, Wind, Users, Activity, Plus } from 'lucide-react';
import { Bed } from '../types';
import { BedAllocationModal } from '../components/bed/BedAllocationModal';

export const BedsPage: React.FC = () => {
  const { addToast } = useNotification();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [wardFilter, setWardFilter] = useState('All');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBeds = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/beds?ward=${wardFilter}`);
      if (res.data.success) {
        setBeds(res.data.data);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Fetch beds error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, [wardFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ICU & Ward Bed Occupancy Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time critical care ventilator units, trauma triage, and general patient ward tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
          >
            <option value="All">All Hospital Wards</option>
            <option value="ICU">Critical Care ICU</option>
            <option value="Emergency">Emergency Trauma</option>
            <option value="General">General Wards</option>
            <option value="Pediatric">Pediatric Ward</option>
          </select>
        </div>
      </div>

      {/* Bed Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Hospital Beds</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats?.total || 9}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-teal-500">Available Beds</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{stats?.available || 5}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-rose-500">Occupied Units</span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats?.occupied || 4}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-500">ICU Occupancy Rate</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{stats?.occupancyRate || 68}%</p>
        </div>
      </div>

      {/* Interactive Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {beds.map((b) => {
          const isOccupied = b.status === 'Occupied';

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBed(b)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isOccupied
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 shadow-md shadow-rose-900/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isOccupied ? 'bg-rose-500 text-white' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    }`}>
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {b.bedNumber}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.ward}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isOccupied ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{b.type}</span>
                  </div>
                  {isOccupied && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patient:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[160px]">{b.patientName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    {b.oxygenSupport && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold flex items-center gap-1">
                        <Wind className="w-3 h-3" /> Oxygen
                      </span>
                    )}
                    {b.ventilator && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center gap-1">
                        <HeartPulse className="w-3 h-3" /> Ventilator
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">₹{b.dailyRate} / Day</span>
                <span className="text-[11px] font-bold text-slate-500 hover:text-teal-600">
                  {isOccupied ? 'Discharge Bed →' : 'Admit Patient →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBed && (
        <BedAllocationModal
          bed={selectedBed}
          onClose={() => setSelectedBed(null)}
          onUpdated={() => {
            setSelectedBed(null);
            fetchBeds();
          }}
        />
      )}

    </div>
  );
};

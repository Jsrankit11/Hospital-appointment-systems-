import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Droplet, Search, Phone, MapPin, Building2, X, CheckCircle2 } from 'lucide-react';
import { BloodStock } from '../../types';

interface BloodAvailabilityPortalProps {
  onClose: () => void;
  language: 'en' | 'hi';
}

export const BloodAvailabilityPortal: React.FC<BloodAvailabilityPortalProps> = ({ onClose, language }) => {
  const { addToast } = useNotification();
  const [bloodList, setBloodList] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchBloodStock = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ors/blood-availability?state=${selectedState}&bloodGroup=${selectedGroup}&component=${selectedComponent}`);
      if (res.data.success) {
        setBloodList(res.data.data);
      }
    } catch (err) {
      console.error('Fetch blood availability error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodStock();
  }, [selectedState, selectedGroup, selectedComponent]);

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header with blood_drop.gif */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/blood_drop.gif"
              alt="Blood Availability"
              className="h-10 w-10 object-contain rounded-xl"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'Live Blood Bank Availability Portal' : 'लाइव रक्त बैंक उपलब्धता पोर्टल'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                National Blood Transfusion Council (NBTC) & e-RaktKosh Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-4 mb-6">
          {/* Blood Group Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {bloodGroups.map((g) => {
              const isSelected = selectedGroup === g;

              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGroup(g)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {g === 'All' ? 'All Blood Groups' : g}
                </button>
              );
            })}
          </div>

          {/* State and Component Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Filter State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="All">All States across India</option>
                <option value="Delhi">Delhi (National Capital)</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Component
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="All">All Components (Whole Blood, RBC, Plasma, Platelets)</option>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Packed RBC">Packed RBC</option>
                <option value="Platelets">Platelets</option>
                <option value="Plasma">Fresh Frozen Plasma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blood Stock Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bloodList.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 shadow-sm hover:border-rose-500 transition-all"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                    {item.bloodGroup}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300">
                    {item.unitsAvailable} Units Available
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {item.hospital}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{item.district}, {item.state}</span>
                </p>
                <p className="text-[10px] text-slate-400">Component: {item.component}</p>
              </div>

              <div className="text-right shrink-0">
                <a
                  href={`tel:${item.contact || '011-26588500'}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] shadow-sm transition"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Emergency</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {bloodList.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs">
            No blood stock found matching the chosen criteria.
          </div>
        )}

      </div>
    </div>
  );
};

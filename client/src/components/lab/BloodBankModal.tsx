import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Minus, X, AlertCircle } from 'lucide-react';
import { BloodStock } from '../../types';

interface BloodBankModalProps {
  bloodBank: BloodStock[];
  onClose: () => void;
  onUpdated: (updatedItem: BloodStock) => void;
}

export const BloodBankModal: React.FC<BloodBankModalProps> = ({ bloodBank, onClose, onUpdated }) => {
  const { addToast } = useNotification();
  const [selectedGroup, setSelectedGroup] = useState<string>('O-');
  const [units, setUnits] = useState<number>(2);

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/lab/blood-bank', {
        bloodGroup: selectedGroup,
        unitsAvailable: units,
        status: units < 5 ? (units <= 2 ? 'CRITICAL LOW' : 'Low Stock Alert') : 'Adequate'
      });

      if (res.data.success) {
        addToast('success', 'Blood Bank Inventory Synchronized', `Units for ${selectedGroup} updated to ${units} units.`);
        onUpdated(res.data.data);
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.response?.data?.message || 'Server error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header with blood_drop.gif */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/images/blood_drop.gif"
                alt="Blood Bank"
                className="h-10 w-10 object-contain rounded-xl"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hospital Blood Bank Inventory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Whole Blood, Packed RBC & Plasma Reserves</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Blood Group Stock Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {bloodBank.map((item) => {
            const isSelected = selectedGroup === item.bloodGroup;
            const isCritical = item.unitsAvailable <= 3;

            return (
              <button
                key={item.bloodGroup}
                type="button"
                onClick={() => {
                  setSelectedGroup(item.bloodGroup);
                  setUnits(item.unitsAvailable);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-lg font-black text-rose-600 dark:text-rose-400 block">{item.bloodGroup}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.unitsAvailable} Units</span>
                {isCritical && (
                  <span className="text-[9px] font-bold text-rose-500 block uppercase animate-pulse">Low</span>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleUpdateStock} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adjust Stock Units for <span className="font-bold text-rose-600">{selectedGroup}</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUnits(Math.max(0, units - 1))}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setUnits(units + 1)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition"
            >
              Save Blood Reserve
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

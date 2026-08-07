import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Pill, ShoppingBag, AlertTriangle, Plus, Search, CheckCircle } from 'lucide-react';
import { Medicine } from '../types';
import { PharmacyPOSModal } from '../components/pharmacy/PharmacyPOSModal';

export const PharmacyPage: React.FC = () => {
  const { addToast } = useNotification();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [showPOSModal, setShowPOSModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = async (query = '') => {
    setLoading(true);
    try {
      const res = await API.get(`/pharmacy?search=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setMedicines(res.data.data);
      }
    } catch (err) {
      console.error('Fetch medicines error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines(search);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Jan Aushadhi & Central Hospital Pharmacy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time stock tracking, prescription POS dispensing, and batch expiry monitoring.
          </p>
        </div>

        <button
          onClick={() => setShowPOSModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Dispense e-Prescription</span>
        </button>
      </div>

      {/* Search & Stock Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === '') fetchMedicines('');
              }}
              placeholder="Search by drug name, code or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Drug Code</th>
                <th className="pb-3">Medicine & Salt Formulation</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Batch & Expiry</th>
                <th className="pb-3">Unit Price (INR)</th>
                <th className="pb-3">Stock Units</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {medicines.map((m) => {
                const isLow = m.stockQuantity < 25;

                return (
                  <tr key={m.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {m.code}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {m.name} <br />
                      <span className="text-[10px] text-slate-400">{m.manufacturer}</span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{m.category}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {m.batchNumber} • <span className="font-semibold">{m.expiryDate}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      ₹{m.price.toFixed(2)}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white font-mono">
                      {m.stockQuantity}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLow
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isLow ? 'LOW STOCK' : 'AVAILABLE'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPOSModal && (
        <PharmacyPOSModal
          medicines={medicines}
          onClose={() => setShowPOSModal(false)}
          onDispensed={() => {
            setShowPOSModal(false);
            fetchMedicines();
          }}
        />
      )}

    </div>
  );
};

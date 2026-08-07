import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Pill, ShoppingBag, X, AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { Medicine } from '../../types';

interface PharmacyPOSModalProps {
  medicines: Medicine[];
  onClose: () => void;
  onDispensed: (updatedMed: Medicine) => void;
}

export const PharmacyPOSModal: React.FC<PharmacyPOSModalProps> = ({ medicines, onClose, onDispensed }) => {
  const { addToast } = useNotification();
  const [selectedCode, setSelectedCode] = useState(medicines[0]?.code || 'MED-101');
  const [quantity, setQuantity] = useState(1);
  const [patientName, setPatientName] = useState('Rohan Sharma (OPD-101)');
  const [loading, setLoading] = useState(false);

  const selectedMed = medicines.find(m => m.code === selectedCode);

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    setLoading(true);
    try {
      const res = await API.post('/pharmacy/dispense', {
        code: selectedMed.code,
        quantity,
        patientName
      });

      if (res.data.success) {
        addToast('success', 'Medicine Dispensed', `Dispensed ${quantity} unit(s) of ${selectedMed.name} to ${patientName}`);
        onDispensed(res.data.data);
      }
    } catch (err: any) {
      addToast('error', 'Dispensing Error', err.response?.data?.message || 'Insufficient stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pharmacy POS & Drug Dispenser
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jan Aushadhi & Central Hospital Dispensary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDispense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Prescription Drug
            </label>
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium"
            >
              {medicines.map(m => (
                <option key={m.code} value={m.code}>
                  {m.name} — Stock: {m.stockQuantity} (₹{m.price})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dispense Quantity
              </label>
              <input
                type="number"
                min={1}
                max={selectedMed?.stockQuantity || 100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Patient / Token Ref
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {selectedMed && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Price:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{selectedMed.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Calculated:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                  ₹{(selectedMed.price * quantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch & Expiry:</span>
                <span className="text-slate-400">{selectedMed.batchNumber} • Exp {selectedMed.expiryDate}</span>
              </div>
            </div>
          )}

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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {loading ? 'Dispensing...' : 'Dispense & Update Stock'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

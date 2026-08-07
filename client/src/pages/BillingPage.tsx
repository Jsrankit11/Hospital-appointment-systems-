import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Receipt, QrCode, CreditCard, ShieldCheck, Download, Plus, CheckCircle } from 'lucide-react';
import { Bill } from '../types';
import { PaymentModal } from '../components/billing/PaymentModal';

export const BillingPage: React.FC = () => {
  const { addToast } = useNotification();
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await API.get('/billing');
      if (res.data.success) {
        setBills(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Fetch bills error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Billing & Digital Payments Desk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time Dynamic UPI QR, Razorpay, and Stripe settlement reconciliation.
          </p>
        </div>
      </div>

      {/* Revenue Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Invoices</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary?.totalBills || 12}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-500">Collected Revenue</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(summary?.totalRevenue || 5800).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-500">Pending Amount</span>
          <p className="text-2xl font-black text-amber-500 mt-1">
            ₹{(summary?.pendingAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-teal-500">Paid Invoices</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{summary?.paidCount || 12}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Revenue Ledger & Payment Receipts ({bills.length} Invoices)
          </h3>
          <span className="text-xs text-slate-500">Automatic GST Calculation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Patient Name</th>
                <th className="pb-3">Hospital Service</th>
                <th className="pb-3">Pay Mode</th>
                <th className="pb-3">Amount (INR)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                    {b.invoiceNumber}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {b.patientName} <br />
                    <span className="text-[10px] text-slate-400 font-mono">{b.transactionId}</span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{b.serviceType}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    ₹{b.netAmount || b.totalAmount}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedBill(b)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold transition shadow-sm"
                    >
                      {b.status === 'PAID' ? 'Print Tax Invoice' : 'Collect Payment'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBill && (
        <PaymentModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          onPaid={() => {
            setSelectedBill(null);
            fetchBills();
          }}
        />
      )}

    </div>
  );
};

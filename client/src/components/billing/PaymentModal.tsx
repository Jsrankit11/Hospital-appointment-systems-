import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
  CreditCard, QrCode, Banknote, Building, ShieldCheck,
  CheckCircle2, X, Download, Printer, Loader2, Sparkles, Receipt
} from 'lucide-react';
import { Bill } from '../../types';

interface PaymentModalProps {
  bill?: Bill | null;
  onClose: () => void;
  onPaid?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ bill, onClose, onPaid }) => {
  const { addToast } = useNotification();

  const [patientName, setPatientName] = useState(bill?.patientName || 'Rohan Sharma');
  const [serviceType, setServiceType] = useState(bill?.serviceType || 'Central Pathology & Blood Diagnostics');
  const [amount, setAmount] = useState<number>(bill?.netAmount || bill?.totalAmount || 350);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD' | 'CASH' | 'NETBANKING'>('UPI');

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8819 9021 4418');
  const [cardHolder, setCardHolder] = useState(bill?.patientName || 'Rohan Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCVV, setCardCVV] = useState('882');

  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInstantPay = () => {
    setLoading(true);
    setTimeout(() => {
      const txn = paymentMode === 'UPI' ? `UPI-JSR-${Date.now().toString().slice(-8)}` :
                  paymentMode === 'CARD' ? `CARD-AUTH-${Date.now().toString().slice(-8)}` :
                  paymentMode === 'CASH' ? `CASH-REC-${Date.now().toString().slice(-8)}` :
                  `NETB-HDFC-${Date.now().toString().slice(-8)}`;

      const rec = `JSR-INV-2026-${Date.now().toString().slice(-6)}`;
      setTransactionId(txn);
      setReceiptNumber(rec);
      setIsPaid(true);
      setLoading(false);
      addToast('success', 'Payment Settled', `Hospital invoice of ₹${amount} successfully generated via ${paymentMode}!`);
      if (onPaid) onPaid();
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  const upiPayload = `upi://pay?pa=jsr.hospital@hdfcbank&pn=JSR%20Healthcare&am=${amount}&cu=INR&tn=${encodeURIComponent(serviceType)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              JSR
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Instant Hospital Payment & Invoicing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                UPI QR • Debit / Credit Card • Cash Counter • Net Banking
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

        {!isPaid ? (
          /* Payment Setup Form (Hidden on Print) */
          <div className="space-y-5 no-print">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (INR ₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hospital Service / Treatment
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>

            {/* Payment Method 4 Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('UPI')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMode === 'UPI'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-500" />
                  <span>Dynamic QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('CARD')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMode === 'CARD'
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-teal-500" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMode === 'CASH'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-amber-500" />
                  <span>Cash Counter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('NETBANKING')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMode === 'NETBANKING'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-purple-500" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Dynamic UPI Mode */}
            {paymentMode === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <QRCodeSVG value={upiPayload} size={150} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Scan with any UPI App to Pay ₹{amount}
                  </p>
                  <p className="text-[11px] text-slate-400">Google Pay • PhonePe • Paytm • BHIM UPI</p>
                </div>
              </div>
            )}

            {/* Debit Card Mode */}
            {paymentMode === 'CARD' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Debit / Credit Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8819 9021 4418"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/29"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash at Hospital Counter */}
            {paymentMode === 'CASH' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-amber-500" />
                  <span>Hospital Cash Counter Collection</span>
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Generate instant cash collection voucher and deposit ₹{amount} at Billing Counter #3.
                </p>
              </div>
            )}

            {/* Net Banking */}
            {paymentMode === 'NETBANKING' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Bank
                </label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Punjab National Bank (PNB)</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleInstantPay}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Settle & Generate Tax Invoice (₹${amount})`}
            </button>
          </div>
        ) : (
          /* --- OFFICIAL CLEAN PRINTABLE GST TAX INVOICE (Prints ONLY this voucher) --- */
          <div className="space-y-6">
            
            {/* Top Success Banner (Hidden on Print) */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1 no-print">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-black text-emerald-900 dark:text-emerald-300">
                Payment Settled & Invoice Generated!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                Transaction ID: <strong>{transactionId}</strong>
              </p>
            </div>

            {/* --- CLEAN VOUCHER TO PRINT --- */}
            <div
              id="official-hospital-invoice"
              className="print-card p-6 rounded-3xl bg-white text-black border-2 border-black space-y-4 text-xs shadow-md"
            >
              {/* Invoice Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div>
                  <h4 className="font-black text-base text-black uppercase tracking-wide">
                    JSR Healthcare Multi-Speciality Hospital
                  </h4>
                  <p className="text-[10px] text-black font-semibold">
                    GSTIN: 07AAACJ8821K1Z4 • CIN: U85110DL2026PTC099124
                  </p>
                  <p className="text-[10px] text-black">
                    Central Healthcare & Diagnostics Block • Helpline: 1800-11-4477
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-black">Tax Invoice #:</span>
                  <p className="font-mono font-black text-sm text-black">{receiptNumber}</p>
                  <p className="text-[10px] text-black font-mono">{new Date().toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-black block font-semibold">Patient Name:</span>
                  <span className="font-bold text-sm text-black">{patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-black block font-semibold">Payment Mode:</span>
                  <span className="font-bold text-black uppercase">{paymentMode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black block font-semibold">Payment Status:</span>
                  <span className="font-mono font-black text-xs text-black uppercase">PAID & SETTLED</span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="pt-2 border-t border-black">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-black text-[10px] font-bold uppercase">
                    <tr>
                      <th className="pb-1">S.No</th>
                      <th className="pb-1">Hospital Service Description</th>
                      <th className="pb-1">SAC Code</th>
                      <th className="pb-1 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20">
                    <tr>
                      <td className="py-2">1</td>
                      <td className="py-2 font-bold">{serviceType}</td>
                      <td className="py-2 font-mono">999312</td>
                      <td className="py-2 text-right font-mono font-bold">₹{amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals & Tax Calculation */}
              <div className="pt-3 border-t-2 border-black space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono font-bold">₹{amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Healthcare GST (Exempted u/s 12AA):</span>
                  <span className="font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-black text-sm font-black">
                  <span>Total Net Paid:</span>
                  <span className="font-mono">₹{amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Barcode & Verification */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-white border border-black rounded-lg">
                    <QRCodeSVG value={`https://jsrhealthcare.in/verify-invoice?id=${receiptNumber}&amt=${amount}&pat=${encodeURIComponent(patientName)}`} size={55} />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold">Digital Authorization</p>
                    <p className="font-mono text-xs">{transactionId}</p>
                  </div>
                </div>

                <div className="text-right text-[10px]">
                  <p className="font-bold">JSR Healthcare Portal</p>
                  <p>Created by Ankit Chaudhary</p>
                </div>
              </div>
            </div>

            {/* Print and Close Action Buttons (Hidden on Print) */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Invoice (Clean Voucher)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

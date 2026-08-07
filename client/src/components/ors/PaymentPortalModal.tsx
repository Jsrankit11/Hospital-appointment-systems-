import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, X, Download, Printer, Loader2 } from 'lucide-react';

interface PaymentPortalModalProps {
  onClose: () => void;
  language: 'en' | 'hi';
}

export const PaymentPortalModal: React.FC<PaymentPortalModalProps> = ({ onClose, language }) => {
  const { addToast } = useNotification();
  const [patientName, setPatientName] = useState('Rohan Sharma');
  const [serviceType, setServiceType] = useState('Central Pathology & Blood Tests Fee');
  const [amount, setAmount] = useState<number>(350);
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePaySuccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsPaid(true);
      addToast('success', 'Payment Successful', `Hospital fee of ₹${amount} received and settled.`);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const upiPayload = `upi://pay?pa=hospital.central@hdfcbank&pn=HAMS%20Government%20Hospital&am=${amount}&cu=INR&tn=${encodeURIComponent(serviceType)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header with mobile_payment.gif */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/mobile_payment.gif"
              alt="Payment Portal"
              className="h-10 w-10 object-contain rounded-xl"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'Online Hospital Payment Gateway' : 'अस्पताल शुल्क भुगतान पोर्टल'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant settlement for OPD registration, lab diagnostics and IPD advance
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
          <div className="space-y-5">
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
                Hospital Service / Fee Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => {
                  setServiceType(e.target.value);
                  if (e.target.value.includes('Registration')) setAmount(150);
                  else if (e.target.value.includes('Pathology')) setAmount(350);
                  else if (e.target.value.includes('Radiology')) setAmount(1200);
                  else setAmount(2500);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="Central Pathology & Blood Tests Fee">Central Pathology & Blood Tests (₹350)</option>
                <option value="Super Specialty OPD Consultation">Super Specialty OPD Consultation (₹150)</option>
                <option value="Radiology CT Scan & 2D Echo">Radiology CT Scan & 2D Echo (₹1,200)</option>
                <option value="IPD Inpatient Ward Bed Advance">IPD Inpatient Ward Bed Advance (₹2,500)</option>
              </select>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    method === 'UPI'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Dynamic UPI
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('CARD')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    method === 'CARD'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Debit / Card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('NETBANKING')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    method === 'NETBANKING'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Net Banking
                </button>
              </div>
            </div>

            {/* UPI QR Display */}
            {method === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-md">
                  <QRCodeSVG value={upiPayload} size={150} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Scan with any UPI App
                  </p>
                  <p className="text-[11px] text-slate-400">Google Pay • PhonePe • Paytm • BHIM</p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handlePaySuccess}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Simulate Instant Payment (₹${amount})`}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success & Receipt */
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-base font-black text-emerald-900 dark:text-emerald-300">
                Payment Settled Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Transaction ID: <span className="font-mono font-bold">TXN-UPI-{Date.now().toString().slice(-8)}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-slate-900 dark:text-white">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-slate-900 dark:text-white">{serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-600">₹{amount} (GST Exempted)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print GST Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

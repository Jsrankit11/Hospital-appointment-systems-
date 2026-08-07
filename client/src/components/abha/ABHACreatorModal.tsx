import React, { useState } from 'react';
import API from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, KeyRound, Smartphone, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { Patient } from '../../types';

interface ABHACreatorModalProps {
  onClose: () => void;
  onCreated: (patient: Patient) => void;
}

export const ABHACreatorModal: React.FC<ABHACreatorModalProps> = ({ onClose, onCreated }) => {
  const { addToast } = useNotification();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Input Aadhaar/Phone, 2: OTP, 3: Success
  const [method, setMethod] = useState<'AADHAAR' | 'MOBILE'>('AADHAAR');
  const [identityValue, setIdentityValue] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1994-06-18');
  const [preferredAddress, setPreferredAddress] = useState('');
  const [txnId, setTxnId] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Send OTP via ABDM Gateway
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityValue || !name) {
      setError('Please provide full name and identity number.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await API.post('/abha/request-otp', { identityValue, type: method });
      if (res.data.success) {
        setTxnId(res.data.data.txnId);
        setDemoOtp(res.data.data.demoOtp);
        setOtp(res.data.data.demoOtp); // Autofill for effortless testing
        setStep(2);
        addToast('success', 'ABDM OTP Dispatched', `Simulated 6-digit OTP code sent: ${res.data.data.demoOtp}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch ABDM OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Issue ABHA Number
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/abha/verify-otp', {
        txnId,
        otp,
        profileData: {
          name,
          gender,
          dob,
          preferredAddress,
          mobile: method === 'MOBILE' ? identityValue : '9822334455'
        }
      });

      if (res.data.success) {
        setStep(3);
        addToast('success', 'ABHA Number Issued', `14-digit ABHA: ${res.data.data.abhaNumber}`);
        if (res.data.patient) {
          onCreated(res.data.patient);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Ayushman ABHA Health ID
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">National Health Authority ABDM Enrollment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Input Identity Details */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Verification Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('AADHAAR')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    method === 'AADHAAR'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <KeyRound className="w-4 h-4" /> 12-Digit Aadhaar
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('MOBILE')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    method === 'MOBILE'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Mobile OTP
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (as per Govt ID)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikramaditya Rathore"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {method === 'AADHAAR' ? '12-Digit Aadhaar Number' : '10-Digit Mobile Number'}
              </label>
              <input
                type="text"
                value={identityValue}
                onChange={(e) => setIdentityValue(e.target.value)}
                placeholder={method === 'AADHAAR' ? '9812 4410 8821' : '9899001122'}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate ABDM OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Enter 6-Digit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                OTP code sent to {identityValue}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Sandbox Demo Code: <strong className="font-mono text-sm">{demoOtp || '123456'}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Choose ABHA Address (PHR Handle)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={preferredAddress}
                  onChange={(e) => setPreferredAddress(e.target.value)}
                  placeholder={`${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'citizen'}@abdm`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Issue ABHA'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                ABHA Health Account Created!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Citizen profile is now synchronized with Ayushman Bharat Digital Mission.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
            >
              View in Hospital Registry
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

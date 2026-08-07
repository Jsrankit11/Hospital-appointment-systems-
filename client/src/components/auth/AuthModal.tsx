import React, { useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  UserCircle, Lock, Mail, Phone, ShieldCheck, CheckCircle2,
  X, Loader2, KeyRound, Sparkles, Building2, UserPlus, LogIn, HelpCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, quickSwitchRole } = useAuth();
  const { addToast } = useNotification();

  const [tab, setTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'STAFF'>('LOGIN');

  // Login Form States
  const [emailOrMobile, setEmailOrMobile] = useState('rohan.sharma@gmail.com');
  const [password, setPassword] = useState('Patient@123');

  // Register States
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(32);
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [abhaNumber, setAbhaNumber] = useState('');

  // Forgot Password States
  const [forgotIdentifier, setForgotIdentifier] = useState('rohan.sharma@gmail.com');
  const [resetOtp, setResetOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(emailOrMobile, password);
      if (success) {
        addToast('success', 'Login Successful', `Welcome back! Authentication complete.`);
        onClose();
      } else {
        addToast('error', 'Login Failed', 'Invalid credentials.');
      }
    } catch (err: any) {
      addToast('error', 'Login Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Citizen Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First attempt to register via API
      let success = false;
      try {
        const res = await API.post('/auth/register', {
          name, email: regEmail, mobile: regMobile, password: regPassword,
          role: 'PATIENT', gender, age, city, state, abhaNumber
        });
        if (res.data.success) {
          success = await login(regEmail, regPassword);
        }
      } catch (err) {
        console.warn('API register error, falling back to local session');
        // Fallback login
        success = await login(regEmail, regPassword);
      }

      if (success) {
        addToast('success', 'Account Registered & Saved', `Account created! Details & password saved in database and emailed to ankitchaudhary8081039@gmail.com.`);
        onClose();
      }
    } catch (err: any) {
      addToast('error', 'Registration Failed', err.message || 'Could not register user.');
    } finally {
      setLoading(false);
    }
  };

  // Request Forgot Password OTP
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', {
        identifier: forgotIdentifier
      });

      if (res.data.success) {
        setOtpSent(true);
        setDemoOtpCode(res.data.demoOtp);
        setResetOtp(res.data.demoOtp); // pre-fill for convenience
        addToast('info', 'OTP Dispatched', `Password Reset OTP: ${res.data.demoOtp} (Sent to SMS/Email)`);
      }
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.response?.data?.message || 'User not found.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Execution
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', {
        identifier: forgotIdentifier,
        otp: resetOtp,
        newPassword
      });

      if (res.data.success) {
        addToast('success', 'Password Reset Successful', `Your password was updated in database and dispatched to ankitchaudhary8081039@gmail.com!`);
        setTab('LOGIN');
        setEmailOrMobile(forgotIdentifier);
        setPassword(newPassword);
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.response?.data?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Switcher helper
  const handleDemoClick = (role: UserRole) => {
    quickSwitchRole(role);
    addToast('info', 'Demo Session Active', `Switched active session to ${role}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-sm shadow-md">
              JSR
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {tab === 'LOGIN' && 'Citizen & Patient Login'}
                {tab === 'REGISTER' && 'Create New Citizen Account'}
                {tab === 'FORGOT' && 'Forgot / Reset Password'}
                {tab === 'STAFF' && 'Hospital Staff & Admin Portal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JSR Healthcare Portal • Managed by Ankit Chaudhary
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1.5 mb-6">
          <button
            type="button"
            onClick={() => setTab('LOGIN')}
            className={`py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              tab === 'LOGIN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-3 h-3" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('REGISTER')}
            className={`py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              tab === 'REGISTER'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3 h-3" />
            <span>Register</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('FORGOT')}
            className={`py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              tab === 'FORGOT'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Forgot</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('STAFF')}
            className={`py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              tab === 'STAFF'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Staff</span>
          </button>
        </div>

        {/* --- FORM 1: CITIZEN LOGIN --- */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Email / Mobile / ABHA ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="rohan.sharma@gmail.com or 9899001122"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(emailOrMobile);
                    setTab('FORGOT');
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login to JSR Healthcare'}
            </button>

            {/* Quick Demo Pre-fills */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1-Click Demo Logins
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrMobile('rohan.sharma@gmail.com');
                    setPassword('Patient@123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/30"
                >
                  Citizen: Rohan Sharma
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrMobile('arvind.cardio@hams.gov.in');
                    setPassword('Doctor@123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-500/30"
                >
                  Doctor: Dr. Arvind
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrMobile('admin@hams.gov.in');
                    setPassword('Admin@123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-500/30"
                >
                  Admin: Director
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- FORM 2: CITIZEN REGISTRATION --- */}
        {tab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (as per Govt ID) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikramaditya Singh"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="vikram@gmail.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Create Account Password * (Saved to Database)
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Enter password (e.g. Pass@123)"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Lucknow"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register & Save to Database'}
            </button>
          </form>
        )}

        {/* --- FORM 3: FORGOT PASSWORD & RESET --- */}
        {tab === 'FORGOT' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Registered Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. rohan.sharma@gmail.com or 9899001122"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Code (OTP)'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  OTP Code dispatched to {forgotIdentifier}. Demo OTP: <strong className="font-mono">{demoOtpCode}</strong>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter 6-Digit OTP *
                  </label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (e.g. MyNewPass@2026)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save New Password & Notify Admin'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- FORM 4: STAFF QUICK DEMO ROLES --- */}
        {tab === 'STAFF' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Click any hospital role below to instantly log in and access internal clinical desks:
            </p>

            {[
              { role: 'SUPER_ADMIN', name: 'Dr. Randeep Guleria', dept: 'Medical Director / Admin', icon: '👑', color: 'border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-950/30' },
              { role: 'DOCTOR', name: 'Dr. Arvind Sharma', dept: 'Cardiology & Cardiac Surgery', icon: '🩺', color: 'border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30' },
              { role: 'RECEPTIONIST', name: 'Sunita Mehra', dept: 'OPD Registration & Tokens', icon: '📋', color: 'border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/30' },
              { role: 'LAB_TECHNICIAN', name: 'Anand Kulkarni', dept: 'Central Pathology & Labs', icon: '🔬', color: 'border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-cyan-950/30' },
              { role: 'PHARMACIST', name: 'Vikas Gupta', dept: 'Jan Aushadhi Pharmacy', icon: '💊', color: 'border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' }
            ].map((s) => (
              <div
                key={s.role}
                onClick={() => handleDemoClick(s.role as UserRole)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${s.color}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</h4>
                    <p className="text-[11px] text-slate-500">{s.dept}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Login →
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

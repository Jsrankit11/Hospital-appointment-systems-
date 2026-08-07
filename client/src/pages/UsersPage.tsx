import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Users, KeyRound, Download, ShieldCheck, Search, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { addToast } = useNotification();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.mobile && u.mobile.includes(search)) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            User Accounts & Passwords Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Database records for all registered citizens, doctors, and hospital administrators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              showPasswords
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPasswords ? 'Hide Passwords' : 'Show Saved Passwords'}</span>
          </button>

          <a
            href="/api/export/patients"
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Registry (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, mobile or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            Total Users in Database: <strong className="text-slate-900 dark:text-white font-mono">{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="pb-3">User ID</th>
                <th className="pb-3">Full Name</th>
                <th className="pb-3">Email & Mobile</th>
                <th className="pb-3">Saved Password (Database)</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                    {u.id}
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">
                    {u.email} <br />
                    <span className="text-[10px] text-slate-400 font-mono">{u.mobile}</span>
                  </td>
                  <td className="py-3 font-mono">
                    {showPasswords ? (
                      <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                        {u.passwordPreview}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono tracking-widest">
                        ••••••••
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                      u.role === 'DOCTOR' ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300' :
                      u.role === 'PATIENT' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {u.city}, {u.state}
                  </td>
                  <td className="py-3 text-right text-slate-400 text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

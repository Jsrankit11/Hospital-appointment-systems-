import React from 'react';
import { FileSpreadsheet, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ExcelExportCard: React.FC = () => {
  const exportItems = [
    {
      title: 'Registered Patients Master Directory',
      desc: 'Includes ABHA numbers, demographics, contact details & insurance policy metadata.',
      endpoint: '/api/export/patients',
      filename: 'HAMS_Registered_Patients.xlsx',
      records: 'All Active Records'
    },
    {
      title: 'OPD Appointments & Token Register',
      desc: 'Token queue timestamps, consulting physicians, priority triage & status breakdown.',
      endpoint: '/api/export/opd',
      filename: 'HAMS_OPD_Token_Register.xlsx',
      records: 'Daily Token Roster'
    },
    {
      title: 'Hospital Revenue & Billing Ledger',
      desc: 'GST tax invoices, payment gateways (UPI/Razorpay/Stripe), settlements & discounts.',
      endpoint: '/api/export/bills',
      filename: 'HAMS_Revenue_Ledger.xlsx',
      records: 'Treasury & Audit'
    },
    {
      title: 'Pathology & Diagnostic Lab Register',
      desc: 'Test orders, sample types, pathologist observations & critical panic values.',
      endpoint: '/api/export/lab',
      filename: 'HAMS_Lab_Diagnostics.xlsx',
      records: 'Diagnostic Records'
    },
    {
      title: 'Pharmacy Medicines & Inventory Stock',
      desc: 'Drug codes, batch numbers, expiry dates, unit prices & low stock alerts.',
      endpoint: '/api/export/pharmacy',
      filename: 'HAMS_Pharmacy_Stock.xlsx',
      records: 'Jan Aushadhi Inventory'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner with 97795-download-green.gif */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 flex items-center justify-center shrink-0">
            <img
              src="/images/97795-download-green.gif"
              alt="Download Excel"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
              Official Spreadsheet Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              One-Click Excel (.xlsx) Reports & Bulk Data Exporter
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Export complete, formatted Microsoft Excel spreadsheets directly to your computer for auditing, National Health Authority reporting, and data archiving.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            SheetJS Formatted • 100% Secure
          </span>
        </div>
      </div>

      {/* Grid of Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>.XLSX FORMAT</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{item.records}</span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={item.endpoint}
                download={item.filename}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition text-center"
              >
                <Download className="w-4 h-4" />
                <span>Download Excel Sheet</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

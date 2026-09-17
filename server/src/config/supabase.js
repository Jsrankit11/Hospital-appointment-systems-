const { createClient } = require('@supabase/supabase-js');
const { memoryStore, saveLocalStore } = require('./db');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock-supabase-hams.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'mock-anon-key-sih-2026';

let supabase = null;
let isSupabaseConfigured = false;
let isSupabaseConnected = false;

try {
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    isSupabaseConfigured = true;
    console.log('⚡ Supabase Client initialized with remote endpoint:', process.env.SUPABASE_URL);
  } else {
    // Local / Demo Mock Supabase Client wrapper
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    isSupabaseConfigured = false;
    console.log('ℹ️ Supabase environment variables not configured -> Operating in High-Speed Local Resilient Demo Mode with seamless in-memory & file cache.');
  }
} catch (err) {
  console.warn('⚠️ Supabase init warning:', err.message);
}

// Test live Supabase connection (non-blocking)
const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured || !supabase) {
    isSupabaseConnected = false;
    return { connected: false, mode: 'DEMO_OFFLINE_READY' };
  }
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      isSupabaseConnected = false;
      return { connected: false, error: error.message, mode: 'FALLBACK_LOCAL' };
    }
    isSupabaseConnected = true;
    return { connected: true, mode: 'SUPABASE_CLOUD_LIVE' };
  } catch (err) {
    isSupabaseConnected = false;
    return { connected: false, error: err.message, mode: 'FALLBACK_LOCAL' };
  }
};

// Database operation adapters with transparent local store fallback
const supabaseDb = {
  client: supabase,
  isConfigured: () => isSupabaseConfigured,
  isConnected: () => isSupabaseConnected,
  testConnection: testSupabaseConnection,

  // 1. Audit Log Recorder
  logAudit: async (entry) => {
    const auditRecord = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      ...entry
    };

    if (!memoryStore.auditLogs) memoryStore.auditLogs = [];
    memoryStore.auditLogs.unshift(auditRecord);
    saveLocalStore();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_logs').insert([auditRecord]);
      } catch (e) {
        console.warn('Supabase audit log insert note:', e.message);
      }
    }
    return auditRecord;
  },

  // 2. Triage Alert Dispatcher
  saveTriageAlert: async (alert) => {
    const alertRecord = {
      id: `TRG-${Date.now()}`,
      alertId: alert.alertId || `ALT-${Date.now()}`,
      severity: alert.severity || 'CODE_RED',
      category: alert.category || 'CARDIOVASCULAR',
      alertTitle: alert.alertTitle || 'Emergency Alert',
      triggerSymptom: alert.triggerSymptom || '',
      clinicalInstruction: alert.clinicalInstruction || '',
      patientId: alert.patientId || 'PAT-1001',
      patientName: alert.patientName || 'Emergency Patient',
      status: 'TRIGGERED',
      createdAt: new Date().toISOString()
    };

    if (!memoryStore.triageAlerts) memoryStore.triageAlerts = [];
    memoryStore.triageAlerts.unshift(alertRecord);
    saveLocalStore();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('triage_alerts').insert([alertRecord]);
      } catch (e) {
        console.warn('Supabase triage alert insert note:', e.message);
      }
    }
    return alertRecord;
  },

  // 3. Clinical Summary Persist
  saveClinicalSummary: async (summary) => {
    if (!memoryStore.clinicalSummaries) memoryStore.clinicalSummaries = [];
    const idx = memoryStore.clinicalSummaries.findIndex(s => s.summaryId === summary.summaryId);
    if (idx >= 0) {
      memoryStore.clinicalSummaries[idx] = summary;
    } else {
      memoryStore.clinicalSummaries.unshift(summary);
    }
    saveLocalStore();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('clinical_summaries').upsert([summary]);
      } catch (e) {
        console.warn('Supabase clinical summary sync note:', e.message);
      }
    }
    return summary;
  }
};

module.exports = {
  supabase,
  supabaseDb,
  testSupabaseConnection
};

-- ==============================================================================
-- MediKiosk – AI Clinical History & Patient Intake Platform
-- Database Schema for Supabase / PostgreSQL (SIH Problem Statement 26047)
-- All India Institute of Ayurveda | Ministry of Ayush
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & RBAC TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'TRIAGE_STAFF', 'PATIENT', 'NURSE', 'PHARMACIST', 'LAB_TECH')),
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PATIENTS TABLE (ABHA / ABDM Ready)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. PAT-1001
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    abha_id VARCHAR(100), -- e.g. rohan.sharma@abdm
    abha_number VARCHAR(50), -- e.g. 91-4829-1092-3341
    address TEXT,
    preferred_language VARCHAR(50) DEFAULT 'en',
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    doctor_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    room_number VARCHAR(50),
    opd_days VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. VISITS & OPD TOKENS
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. VIS-9021
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    token_number INT NOT NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    department VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'IN_INTAKE', 'INTAKE_COMPLETED', 'TRIAGED', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED')),
    triage_priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (triage_priority IN ('NORMAL', 'URGENT', 'EMERGENCY_CODE_RED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PATIENT CONSENT LOGS (DPDP Act 2023 & ABDM Compliant)
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consent_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    purpose VARCHAR(100) DEFAULT 'CLINICAL_INTAKE_AND_CONSULTATION',
    hi_types TEXT[] DEFAULT ARRAY['DiagnosticReport', 'Prescription', 'DischargeSummary', 'OPConsultation'],
    data_elements TEXT[] DEFAULT ARRAY['VOICE_RECORDING', 'MEDICAL_HISTORY', 'UPLOADED_DOCUMENTS', 'AYUSH_DATA'],
    status VARCHAR(50) DEFAULT 'GRANTED' CHECK (status IN ('GRANTED', 'REVOKED', 'EXPIRED')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    consent_version VARCHAR(20) DEFAULT 'v1.2-DPDP2023',
    audio_consent_listened BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(50)
);

-- 7. CLINICAL HISTORIES & AI SESSIONS
CREATE TABLE IF NOT EXISTS clinical_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    chief_complaint TEXT,
    language VARCHAR(20) DEFAULT 'en',
    is_ayush BOOLEAN DEFAULT FALSE,
    current_step INT DEFAULT 0,
    total_steps INT DEFAULT 9,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABORTED')),
    triage_level VARCHAR(20) DEFAULT 'GREEN' CHECK (triage_level IN ('GREEN', 'YELLOW', 'RED')),
    audio_recordings_url TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. HISTORY STEP-WISE ANSWERS (SOCRATES Framework)
CREATE TABLE IF NOT EXISTS history_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    history_id UUID REFERENCES clinical_histories(id) ON DELETE CASCADE,
    step_id VARCHAR(50) NOT NULL, -- CHIEF_COMPLAINT, HPI_ONSET, HPI_SEVERITY, etc.
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    input_mode VARCHAR(20) DEFAULT 'TEXT' CHECK (input_mode IN ('VOICE', 'TOUCH_PILL', 'KEYBOARD')),
    transcription_confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. MEDICAL DOCUMENTS (Uploads & Scans)
CREATE TABLE IF NOT EXISTS medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image/jpeg, application/pdf
    file_url TEXT,
    doc_type VARCHAR(50) DEFAULT 'PRESCRIPTION' CHECK (doc_type IN ('PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY', 'IMAGING_REPORT', 'OTHER')),
    document_date DATE DEFAULT CURRENT_DATE,
    ocr_status VARCHAR(50) DEFAULT 'PROCESSED' CHECK (ocr_status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. OCR RESULTS & EXTRACTED CLINICAL ENTITIES
CREATE TABLE IF NOT EXISTS ocr_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES medical_documents(id) ON DELETE CASCADE,
    raw_text TEXT,
    ocr_confidence VARCHAR(20) DEFAULT '96.5%',
    extracted_diagnosis TEXT,
    extracted_medicines JSONB DEFAULT '[]'::jsonb,
    extracted_lab_values JSONB DEFAULT '[]'::jsonb,
    detected_drug_interactions JSONB DEFAULT '[]'::jsonb,
    has_abnormal_values BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. MEDICATIONS LEDGER
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(50),
    prescribed_by VARCHAR(255),
    source VARCHAR(50) DEFAULT 'PATIENT_REPORTED' CHECK (source IN ('PATIENT_REPORTED', 'OCR_EXTRACTED', 'DOCTOR_EHR')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ALLERGIES LEDGER
CREATE TABLE IF NOT EXISTS allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergen VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'DRUG' CHECK (category IN ('DRUG', 'FOOD', 'ENVIRONMENTAL', 'OTHER')),
    reaction TEXT,
    severity VARCHAR(20) DEFAULT 'MODERATE' CHECK (severity IN ('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. INVESTIGATIONS & LAB VALUES
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_value VARCHAR(100) NOT NULL,
    reference_range VARCHAR(100),
    unit VARCHAR(50),
    status VARCHAR(50) DEFAULT 'NORMAL' CHECK (status IN ('NORMAL', 'HIGH', 'LOW', 'CRITICAL', 'REVIEW_REQUIRED')),
    is_abnormal BOOLEAN DEFAULT FALSE,
    test_date DATE DEFAULT CURRENT_DATE,
    lab_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. CHRONOLOGICAL MEDICAL TIMELINE EVENTS
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('CONSULTATION', 'PRESCRIPTION', 'LAB_TEST', 'DISCHARGE', 'AYUSH_ASSESSMENT', 'EMERGENCY_TRIAGE')),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    facility_name VARCHAR(255) DEFAULT 'All India Institute of Ayurveda',
    doctor_name VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. AYUSH & AYURVEDA ASSESSMENTS (Dashavidha Pariksha)
CREATE TABLE IF NOT EXISTS ayush_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    primary_prakriti VARCHAR(100) NOT NULL, -- e.g. Vata-Pitta Dominant
    vata_percentage INT NOT NULL,
    pitta_percentage INT NOT NULL,
    kapha_percentage INT NOT NULL,
    vikriti TEXT,
    sara VARCHAR(100),
    samhanana VARCHAR(100),
    pramana VARCHAR(100),
    satmya VARCHAR(100),
    sattva VARCHAR(100),
    ahara_shakti VARCHAR(100),
    vyayama_shakti VARCHAR(100),
    vaya VARCHAR(100),
    agni VARCHAR(100), -- Samagni, Tikshnagni, Mandagni, Vishamagni
    koshta VARCHAR(100), -- Krura, Mridu, Madhyama
    ashtavidha_pariksha JSONB DEFAULT '{}'::jsonb,
    dietary_recommendations TEXT[],
    dinacharya_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. RED FLAGS & TRIAGE EMERGENCY ALERTS
CREATE TABLE IF NOT EXISTS triage_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CODE_RED', 'CODE_YELLOW', 'CODE_GREEN')),
    category VARCHAR(100) NOT NULL, -- CARDIOVASCULAR, RESPIRATORY, NEUROLOGICAL, etc.
    alert_title VARCHAR(255) NOT NULL,
    trigger_symptom TEXT NOT NULL,
    clinical_instruction TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'TRIGGERED' CHECK (status IN ('TRIGGERED', 'ACKNOWLEDGED', 'ROUTED_TO_EMERGENCY', 'RESOLVED')),
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. STRUCTURED CLINICAL SUMMARIES (Doctor 1-Page Draft)
CREATE TABLE IF NOT EXISTS clinical_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    chief_complaint TEXT NOT NULL,
    history_of_present_illness TEXT NOT NULL,
    past_medical_history TEXT,
    past_surgical_history TEXT,
    drug_history TEXT,
    allergy_history TEXT,
    family_history TEXT,
    personal_history TEXT,
    review_of_systems TEXT,
    prior_investigations JSONB DEFAULT '[]'::jsonb,
    current_medications JSONB DEFAULT '[]'::jsonb,
    medical_document_summary TEXT,
    ayush_history JSONB DEFAULT '{}'::jsonb,
    reported_red_flags JSONB DEFAULT '[]'::jsonb,
    physician_review_items TEXT[],
    provisional_working_diagnosis TEXT,
    physician_review_status VARCHAR(50) DEFAULT 'DRAFT_READY' CHECK (physician_review_status IN ('DRAFT_READY', 'CONFIRMED', 'MODIFIED', 'REJECTED')),
    physician_notes TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. AUDIT LOGS (DPDP Act & ABDM Traceability)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. VIEW_CLINICAL_SUMMARY, EDIT_SUMMARY, GRANT_CONSENT, OCR_SCAN, FHIR_EXPORT
    patient_ref VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    status VARCHAR(50) DEFAULT 'SUCCESS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_code);
CREATE INDEX IF NOT EXISTS idx_patients_abha ON patients(abha_number);
CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_triage_severity ON triage_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_triage_status ON triage_alerts(status);
CREATE INDEX IF NOT EXISTS idx_summaries_patient ON clinical_summaries(patient_id);
CREATE INDEX IF NOT EXISTS idx_timeline_patient ON timeline_events(patient_id);

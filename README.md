# 🏥 MediKiosk – AI Clinical History & Patient Intake Platform
### **Smart India Hackathon (SIH) Problem Statement 26047**
- **Problem Statement ID**: `26047`
- **Title**: Patient Case-Taking Software
- **Organization**: All India Institute of Ayurveda (AIIA)
- **Ministry**: Ministry of Ayush
- **Theme**: MedTech / BioTech / HealthTech
- **Platform**: JSR Healthcare & MediKiosk by **Ankit Chaudhary** (`ankitchaudhary8081039@gmail.com`)

---

> *"Let the patient tell their story before they meet the doctor, let AI structure it, let documents become digital, and let the doctor spend more time on actual care."*

---

## 🌟 Executive Summary

Indian government hospitals and apex medical institutes (AIIMS, AIIA, PGIMER, KEM) face immense Outpatient Department (OPD) patient loads, where physicians often have only a few minutes per consultation.

**MediKiosk** solves this bottleneck by allowing patients to complete their structured clinical history via **multilingual voice, touch, or text** in the waiting area before entering the consultation room. It digitizes past medical records via **AI OCR**, screens for **emergency red flags** for instant triage routing, supports **AYUSH Dashavidha Pariksha**, and delivers a **physician-ready 1-page clinical summary** directly into the doctor's electronic health record (EHR) console.

---

## ⚡ Core Architecture & "WOW" Capabilities

1. **🎙️ Multilingual Voice, Touch & Text Kiosk Intake**:
   - Web Speech API integration with real-time audio visualization, mic animation, live speech-to-text (STT), and text-to-speech (TTS) playback.
   - 11 Indian Languages: English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Malayalam (മലയാളം), Odia (ଓଡ଼ିଆ).
   - Designed for elderly, rural, and low-literacy users with high-contrast mode, text scaling, audio explanations, and oversized touch targets (>48px).

2. **🧠 Adaptive SOCRATES Clinical Question Engine**:
   - 16 dynamic clinical branch trees: Chest pain, Fever, Cough, Headache, Abdominal pain, Vomiting, Diarrhea, Back pain, Joint pain, Skin complaints, Urinary symptoms, Menstrual symptoms, Diabetes, Hypertension, and General weakness.
   - Dynamic follow-ups explore **Onset, Location, Duration, Character, Radiation, Triggers, Relieving factors, Past medical/surgical history, Drug allergies, Family/Personal history, and Review of Systems (ROS)**.

3. **🚨 Safety-First Red-Flag Detection & Instant Triage Broadcast**:
   - Screen for cardiovascular emergencies (chest pain + radiation), respiratory failure, stroke (FAST protocol), acute surgical abdomen, and severe trauma.
   - Dispatches instant **Code Red / Code Yellow** triage alerts to the hospital Emergency & Triage Desk.
   - *Medical Safety Rule*: Strictly screens and triages; never autonomously diagnoses.

4. **📄 Document Scanner + AI OCR Digitization**:
   - Digitizes uploaded prescription slips, blood test reports, and discharge summaries.
   - Extracts medicines, generic molecules, dosages, frequencies, and durations.
   - **Abnormal Lab Value Highlighting**: Out-of-range parameters (HbA1c, Fasting glucose, Cholesterol) flagged with reference ranges for doctor review.
   - **Drug-Drug Interaction Engine**: Automatically flags fatal combinations (e.g. Aspirin + Warfarin hemorrhage risk, Statin + Clarithromycin rhabdomyolysis).

5. **🌿 AYUSH & Ayurvedic Dashavidha Pariksha Framework**:
   - Standardized Ayurvedic case taking for the Ministry of Ayush:
     1. **Prakriti** (Vata, Pitta, Kapha dosha distribution algorithm)
     2. **Vikriti** (Current Dosha dushti)
     3. **Sara** (Tissue excellence)
     4. **Samhanana** (Body compactness)
     5. **Pramana** (Anthropometric measurements)
     6. **Satmya** (Adaptability)
     7. **Sattva** (Mental resilience)
     8. **Ahara Shakti** (Digestive power & Agni)
     9. **Vyayama Shakti** (Physical endurance)
     10. **Vaya** (Age stage)
   - Evaluates **Jatharagni** (*Samagni, Tikshnagni, Mandagni, Vishamagni*), **Koshta** (*Krura, Mridu, Madhyama*), **Ashtavidha Pariksha** (*Nadi, Mutra, Mala, Jihva, Shabda, Sparsha, Druk, Akruti*), and generates tailored **Dinacharya & Ahara-Vihara** diet protocols.

6. **📋 Structured Physician-Ready 1-Page Summary (Section 18 Standard)**:
   - Compiles patient voice inputs + OCR records into a draft for the doctor:
     - `CHIEF COMPLAINT`
     - `HISTORY OF PRESENT ILLNESS (HPI)`
     - `PAST MEDICAL & SURGICAL HISTORY`
     - `DRUG & ALLERGY HISTORY`
     - `FAMILY & PERSONAL LIFESTYLE HISTORY`
     - `REVIEW OF SYSTEMS (ROS)`
     - `PRIOR INVESTIGATIONS & ABNORMAL LABS`
     - `CURRENT MEDICATIONS & DRUG INTERACTIONS`
     - `AYUSH DASHAVIDHA PARIKSHA`
     - `REPORTED RED FLAGS & REVIEW ITEMS`
   - **Physician Authority**: Doctor can edit, confirm, dismiss, or inject directly into consultation EHR.

7. **🐘 Supabase / PostgreSQL Database Integration**:
   - Full Supabase Client (`@supabase/supabase-js`) on both frontend and backend.
   - Complete 17-table schema (`supabase_schema.sql`) covering `users`, `patients`, `doctors`, `visits`, `consents`, `clinical_histories`, `history_answers`, `medical_documents`, `ocr_results`, `medications`, `allergies`, `investigations`, `timeline_events`, `ayush_assessments`, `triage_alerts`, `clinical_summaries`, and `audit_logs`.
   - Automatic local file/memory fallback cache ensuring 100% functionality offline and in demo environments without API keys.

8. **🛡️ DPDP Act 2023 & ABDM Consent Architecture**:
   - Simple voice-assisted explanatory consent screen with audio playback.
   - Tamper-evident Audit Trail tracking history views, doctor edits, and OCR scans.
   - **FHIR R4 Standard Document Bundle Exporter** (`/api/fhir/export`) generating compliant `Bundle`, `Patient`, `Encounter`, `Condition`, `Observation`, and `Consent` resources for ABDM / Personal Health Record (PHR) interoperability.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Socket.io Client, QRCode.react, Recharts, Axios, Web Speech API |
| **Backend** | Node.js, Express.js, Socket.io, SheetJS (`xlsx`), JWT, BcryptJS, Helmet, CORS, Rate-Limiting |
| **Database** | **Supabase (PostgreSQL)** + High-Performance Local JSON / Memory Fallback Store |
| **AI / NLP** | Deterministic SOCRATES Question Tree Engine, Red-Flag Rule Engine, Ayurveda Prakriti Assessor, Drug Interaction Matrix |
| **Interoperability** | ABDM M1/M2/M3 Sandbox Ready, HL7 FHIR R4 Bundles, DPDP Act 2023 Consent |

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
# Install root & backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables (Optional for Cloud DB)
Create `.env` inside `server/` and `client/` if using Supabase Cloud:
```env
# server/.env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-key

# client/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: If omitted, the platform automatically runs in Resilient Local Demo Mode with zero configuration!)*

### 3. Run Application
```bash
# Terminal 1: Start Backend Server (Port 5000)
cd server
node src/server.js

# Terminal 2: Start Frontend Dev Server (Port 3000)
cd client
npm run dev
```

Open `http://localhost:5000` or `http://localhost:3000` in your browser.

---

## 👥 Demo Credentials & Archetypes

| Role | Username / Email | Password | Access / Role Scope |
|---|---|---|---|
| **Hospital Admin** | `admin@hams.gov.in` | `Admin@123` | Full Hospital Console, Analytics & Audit Trail |
| **Attending Doctor** | `doctor@hams.gov.in` | `Doctor@123` | Doctor Consultation Desk, EHR Writer & AI Summaries |
| **Triage Officer** | `triage@hams.gov.in` | `Admin@123` | Live Emergency Red-Flag Triage Console |
| **Chief Pharmacist** | `pharmacy@hams.gov.in` | `Admin@123` | Jan Aushadhi Pharmacy Inventory & POS |
| **Citizen / Patient** | `rohan.sharma@gmail.com` | `Patient@123` | Citizen Health Portal & ABHA Health Account |

### 5 Preloaded Patient Demo Personas:
1. **Rohan Sharma** (`PAT-1001`): Metabolic OPD Patient with Hypertension & Fasting Glucose.
2. **Vikram Malhotra** (`PAT-1002`): 🚨 **Code Red Cardiac Emergency** (Chest pain radiating to jaw).
3. **Sunita Devi** (`PAT-1003`): ⚠️ **Code Yellow Urgent** (Continuous 103°F fever + neck stiffness).
4. **Ananya Iyer** (`PAT-1004`): 🌿 **AYUSH Patient** (Vata-Pitta Prakriti, Vishamagni & Insomnia).
5. **Rajesh Verma** (`PAT-1005`): Diabetes Follow-up with Elevated HbA1c (8.4%) & Scanned Labs.

---

## 📡 Key API Endpoints

- `GET /api/health` – Server health, uptime, record counts.
- `GET /api/database/status` – Supabase PostgreSQL live status check.
- `POST /api/ai/conversation/start` – Initializes adaptive case-taking session.
- `POST /api/ai/conversation/respond` – Processes patient answer, branches SOCRATES tree, detects red flags.
- `POST /api/ai/ocr/scan-document` – Digitizes prescription/lab images and extracts entities.
- `POST /api/ai/ayush/assess` – Computes Dashavidha Pariksha & Prakriti dosha distribution.
- `POST /api/ai/clinical-summary/generate` – Synthesizes 1-page physician draft.
- `POST /api/ai/clinical-summary/update` – Doctor edit, confirm, or reject action.
- `GET /api/triage/alerts` – Real-time priority red-flag queue.
- `PUT /api/triage/alerts/:id` – Acknowledge alert, route to emergency bay, or resolve.
- `POST /api/fhir/export` – Exports complete clinical encounter as an ABDM FHIR R4 Bundle.
- `GET /api/admin/audit-logs` – DPDP Act 2023 tamper-evident access log stream.

---

## 🏆 SIH 2026 Demonstration Flow (Walkthrough)

1. **Citizen Landing Page**: Open `http://localhost:5000` -> Click **"Start MediKiosk Patient Intake"**.
2. **Language Selection**: Choose from 11 Indian languages (e.g. Hindi or English) -> Toggle **AYUSH Mode**.
3. **Patient Identification**: Quick-load demo patient or enter ABHA ID.
4. **DPDP Audio Consent**: Click *"Listen to Consent"* for audio readout -> Click **"Give Consent"**.
5. **AI Conversational Intake**:
   - Click the microphone to speak, type, or tap quick touch pills.
   - Enter *"I have severe chest pain radiating to my left arm"*.
   - Watch the instant **🚨 Priority Triage Code Red alert** trigger.
6. **Document OCR Scanner**: Click *"Scan Previous Prescription"* -> AI extracts medicines & abnormal lab values.
7. **Medical Timeline**: View chronological history of prior consultations and tests.
8. **AYUSH Dashavidha Pariksha**: Compute body frame, Agni, and Koshta to receive Vata-Pitta Prakriti profile.
9. **Structured Summary Review**: Inspect the 14-section physician draft -> Click **"Submit & Generate Token"**.
10. **Doctor Consultation Desk**: Switch to **Doctor Console** -> Open patient from OPD Queue -> Review AI Summary -> Click **"Confirm & Inject into EHR"** -> Sign and transmit e-Prescription.
11. **Triage Console**: Open **Triage Desk** -> View live emergency alert for Vikram Malhotra -> Click **"Send to Emergency Bay"**.
12. **ABDM & FHIR**: Open **ABDM Hub** -> View Supabase DB status -> Click **"Export ABDM FHIR R4 Bundle"** to inspect the HL7 JSON payload.

---

## 📜 Copyright & License

© 2026 **MediKiosk Platform** by **Ankit Chaudhary** (`ankitchaudhary8081039@gmail.com`).  
Built for the **Smart India Hackathon** | **All India Institute of Ayurveda** | **Ministry of Ayush**. All Rights Reserved.

# 🏥 JSR Healthcare Portal & Hospital Management System (HAMS)
### **Designed & Developed by Ankit Chaudhary**
📧 **Email**: `ankitchaudhary8081039@gmail.com`

---

## 🌟 Overview

**JSR Healthcare Portal** is a production-grade full-stack Hospital & Healthcare Management System compliant with **Ayushman Bharat Digital Mission (ABDM)** standards and featuring an **All-India Hospital Appointment & OPD Booking Portal**.

---

## ✨ Key Features

1. **🏥 All-India Hospital Appointments & OPD Booking**:
   - Directory of 27+ Apex Institutes & Hospitals across 28+ Indian States & Cities (AIIMS New Delhi, KEM Mumbai, NIMHANS Bengaluru, CMC Vellore, KGMU Lucknow, etc.).
   - Interactive 4-step booking wizard with appointment tokens, doctors, and time slots.
   - Clean printable official OPD slips with barcodes and QR codes.

2. **💳 Instant Multi-Option Payments & GST Invoicing**:
   - **Dynamic UPI QR Code Generator** for Google Pay, PhonePe, Paytm, and BHIM UPI.
   - **Debit / Credit Card** simulation and checkout.
   - **Cash at Hospital Counter** receipt generation.
   - **GST-Compliant Tax Invoices** with 1-click clean printing.

3. **🔐 Citizen Registration, Login & Database Password Storage**:
   - Citizen registration with state, city, age, gender, and ABHA ID.
   - Saved database passwords with Admin show/hide toggle.
   - **Forgot / Reset Password** workflow with 6-digit OTP codes.
   - **Email Notifications**: Instant dispatch of all registrations, logins, and password resets to `ankitchaudhary8081039@gmail.com`.

4. **🔬 Pathology Lab, Diagnostics & Signed PDF Reports**:
   - Diagnostic order management, panic values flags, and signed PDF report downloads.
   - **Live Blood Bank Availability** search across Indian blood banks.

5. **💊 Jan Aushadhi Pharmacy & POS**:
   - Medicine formulation catalog, batch expiry monitoring, and POS dispensing.

6. **🛏️ ICU & Ward Bed Matrix**:
   - Live occupancy matrix for ICU Ventilators, Emergency Triage, and General Wards.

7. **📊 Excel (.xlsx) Bulk Data Exporter**:
   - 1-click downloads for Patient Rosters, OPD Token Registers, and Revenue Ledgers.

8. **🌓 Theme Switcher & Mobile Responsiveness**:
   - Modern Dark Mode & Light Mode persisted in `localStorage`.
   - 100% responsive on all smartphones, tablets, and desktops.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Socket.io Client, QRCode.react, Recharts, Axios
- **Backend**: Node.js, Express, Socket.io, Mongoose / Local Reactive Database Store, SheetJS (`xlsx`), JWT, BcryptJS, Helmet, CORS, Rate-Limiting
- **Integrations**: ABDM / ABHA Sandbox, UPI QR Payload Engine, Multi-channel Notifications (SMS, WhatsApp, Email)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Run Application
```bash
# Start backend server (Serves unified fullstack app on port 5000)
cd server
node src/server.js

# Or start Vite dev server on port 3000
cd ../client
npm run dev
```

### 3. Open in Browser
- **Citizen Portal & Web Application**: `http://localhost:5000` or `http://localhost:3000`
- **API Health Check**: `http://localhost:5000/api/health`
- **Admin Users & Passwords DB**: `http://localhost:5000/api/admin/users`

---

## 📜 Copyright & License

© 2026 **JSR Healthcare Portal**. Designed and Developed by **Ankit Chaudhary** (`ankitchaudhary8081039@gmail.com`). All Rights Reserved.

const { jsPDF } = require('./client/node_modules/jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 40;
const contentWidth = pageWidth - 2 * margin;

let y = 40;

function checkPageBreak(neededHeight) {
  if (y + neededHeight > pageHeight - 50) {
    doc.addPage();
    y = 40;
    renderHeaderSmall();
  }
}

function renderHeaderSmall() {
  doc.setFontSize(8);
  doc.setTextColor(140, 150, 165);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Case-Taking Software – Complete Technology Stack Documentation', margin, 25);
  doc.setDrawColor(220, 226, 235);
  doc.line(margin, 28, pageWidth - margin, 28);
}

// 1. Title Banner
doc.setFillColor(15, 23, 42); // Dark slate
doc.roundedRect(margin, y, contentWidth, 75, 8, 8, 'F');

doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text('Patient Case-Taking Software', margin + 18, y + 28);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.setTextColor(148, 163, 184);
doc.text('AI Clinical History & Patient Intake Platform (SIH Problem Statement 26047)', margin + 18, y + 46);
doc.text('ABDM, HL7 FHIR R4, AYUSH Dashavidha Pariksha & Multilingual Voice Enabled', margin + 18, y + 60);

y += 95;

// Section Component Helper
function addSection(title, items, accentColor = [37, 99, 235]) {
  checkPageBreak(50 + items.length * 24);

  // Section Header Badge
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(margin, y, 4, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin + 12, y + 14);

  y += 24;

  items.forEach(item => {
    checkPageBreak(28);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 24, 4, 4, 'FD');

    // Bullet
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.circle(margin + 12, y + 12, 2.5, 'F');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.name + ':', margin + 22, y + 15);

    // Value
    const labelWidth = doc.getTextWidth(item.name + ': ');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(item.desc, margin + 22 + labelWidth, y + 15);

    y += 28;
  });

  y += 10;
}

// 1. Frontend
addSection('1. Frontend Technologies (Client-Side)', [
  { name: 'Core Framework', desc: 'React 18 (Component-driven SPA architecture)' },
  { name: 'Build & Bundler', desc: 'Vite 5 (Lightning-fast HMR and ESM bundling)' },
  { name: 'Language', desc: 'TypeScript (Strict static typing & interfaces)' },
  { name: 'Styling System', desc: 'Tailwind CSS, PostCSS & Autoprefixer' },
  { name: 'Animations & UI', desc: 'Framer Motion & Canvas Confetti' },
  { name: 'Icons & Visuals', desc: 'Lucide React (Vector icons)' },
  { name: 'Analytics & Charts', desc: 'Recharts (Vital signs, triage and hospital analytics)' },
  { name: 'QR & Document Export', desc: 'QRCode.react, jsPDF (PDF reports & token generation)' },
  { name: 'Speech & Voice Engine', desc: 'Web Speech API (STT & TTS across 11 Indian Languages)' }
], [14, 116, 144]);

// 2. Backend
addSection('2. Backend Technologies (Server-Side)', [
  { name: 'Runtime Environment', desc: 'Node.js (v18+ / v20+ / v24+)' },
  { name: 'Web Framework', desc: 'Express.js (RESTful APIs, routing & middlewares)' },
  { name: 'Real-Time Communication', desc: 'Socket.io (Live emergency triage alerts & sync)' },
  { name: 'Security & Headers', desc: 'Helmet, CORS, Express-Rate-Limit' },
  { name: 'Authentication & Tokens', desc: 'JSON Web Tokens (JWT), BcryptJS (Password hashing)' },
  { name: 'File & Document Handling', desc: 'Multer (Prescription & lab report uploads)' },
  { name: 'Spreadsheet Processing', desc: 'SheetJS / XLSX (Patient & hospital excel data export)' },
  { name: 'HTTP Logger', desc: 'Morgan (Dev logging and API inspection)' }
], [16, 185, 129]);

// 3. Database & Persistence
addSection('3. Database & Data Storage Solutions', [
  { name: 'Primary Cloud Database', desc: 'Supabase (PostgreSQL 15 with Row Level Security)' },
  { name: 'NoSQL Support', desc: 'MongoDB (Mongoose ODM connectivity)' },
  { name: 'Resilient Offline Store', desc: 'In-Memory Cache & JSON Local Store (Zero-config offline mode)' },
  { name: 'Relational Entities', desc: '17 Tables (Patients, Visited Doctors, Triage, AYUSH, Audits)' }
], [245, 158, 11]);

// 4. Clinical AI & Healthcare Engines
addSection('4. Clinical AI Engines & Healthcare Standards', [
  { name: 'Clinical Questioning', desc: 'Adaptive SOCRATES Question Tree (16 Clinical Branches)' },
  { name: 'Emergency Triage', desc: 'Red-Flag & Yellow-Flag Screening (Code Red routing)' },
  { name: 'AYUSH Framework', desc: 'Dashavidha & Ashtavidha Pariksha + Prakriti Assessment' },
  { name: 'OCR & Drug Safety', desc: 'Prescription OCR Scanner & Drug-Drug Interaction Matrix' },
  { name: 'National Standards', desc: 'ABDM (ABHA M1/M2/M3 Sandbox) & DPDP Act 2023 Consent' },
  { name: 'Interoperability', desc: 'HL7 FHIR R4 Compliant Document Bundle Exporter' }
], [99, 102, 241]);

// Footer on all pages
const totalPages = doc.internal.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('Patient Case-Taking Software (MediKiosk)', margin, pageHeight - 20);
  doc.text('SIH PS ID: 26047 – AIIA / Ministry of Ayush', pageWidth - margin, pageHeight - 20, { align: 'right' });
}

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

// Target paths
const targetFolder = path.join(__dirname, 'Patient-Case-Taking-Software');
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}

const fileLocations = [
  path.join(__dirname, 'Patient_Case_Taking_Software_Technology_Stack.pdf'),
  path.join(targetFolder, 'Patient_Case_Taking_Software_Technology_Stack.pdf'),
  path.join(__dirname, 'client', 'public', 'Patient_Case_Taking_Software_Technology_Stack.pdf'),
  path.join(__dirname, 'server', 'uploads', 'Patient_Case_Taking_Software_Technology_Stack.pdf')
];

fileLocations.forEach(loc => {
  fs.writeFileSync(loc, pdfBuffer);
  console.log('Saved to:', loc);
});

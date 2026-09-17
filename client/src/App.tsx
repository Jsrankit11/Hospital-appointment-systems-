import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { EmergencyModal } from './components/common/EmergencyModal';

import { JSRHeader } from './components/jsr/JSRHeader';
import { JSRHeroServices } from './components/jsr/JSRHeroServices';
import { ConsultDoctorsSection } from './components/jsr/ConsultDoctorsSection';
import { AppointmentBookingWizard } from './components/ors/AppointmentBookingWizard';
import { LabReportsLookupModal } from './components/ors/LabReportsLookupModal';
import { BloodAvailabilityPortal } from './components/ors/BloodAvailabilityPortal';
import { PaymentModal } from './components/billing/PaymentModal';
import { TeleConsultationModal } from './components/ors/TeleConsultationModal';
import { JSRFooter } from './components/jsr/JSRFooter';
import { AuthModal } from './components/auth/AuthModal';

import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { OPDPage } from './pages/OPDPage';
import { DoctorPage } from './pages/DoctorPage';
import { LabPage } from './pages/LabPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { BedsPage } from './pages/BedsPage';
import { BillingPage } from './pages/BillingPage';
import { ABDMPage } from './pages/ABDMPage';
import { UsersPage } from './pages/UsersPage';

import { ABHACreatorModal } from './components/abha/ABHACreatorModal';
import { OPDRegistrationModal } from './components/opd/OPDRegistrationModal';

import { AICaseTakingModal } from './components/ai/AICaseTakingModal';
import { GeminiMedicalCopilotModal } from './components/ai/GeminiMedicalCopilotModal';
import { AyushAssessmentModal } from './components/ayush/AyushAssessmentModal';

import { MedicalDocumentScannerModal } from './components/ocr/MedicalDocumentScannerModal';
import { PatientPortalModal } from './components/patient/PatientPortalModal';
import { AccessibilityControls } from './components/accessibility/AccessibilityControls';
import { SignLanguageAvatarModal } from './components/accessibility/SignLanguageAvatarModal';
import { MediKioskFlowModal } from './components/kiosk/MediKioskFlowModal';
import { TriageDashboardModal } from './components/triage/TriageDashboardModal';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { triggerEmergencyCodeBlue } = useNotification();
  
  // View mode: 'PORTAL' (Citizen Experience) vs 'CONSOLE' (Hospital Staff & Doctor Desk)
  const [viewMode, setViewMode] = useState<'PORTAL' | 'CONSOLE'>('PORTAL');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [bookingParams, setBookingParams] = useState<{
    hospitalId?: string;
    department?: string;
    doctorName?: string;
  }>({
    hospitalId: 'HOSP-KGMU-LUCKNOW',
    department: 'Cardiology & Lari Centre',
    doctorName: 'Dr. Arvind Sharma (Senior Consultant)'
  });

  const [showLabLookup, setShowLabLookup] = useState(false);
  const [showBloodPortal, setShowBloodPortal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTeleconsultModal, setShowTeleconsultModal] = useState(false);
  const [teleconsultDoctor, setTeleconsultDoctor] = useState<any | undefined>(undefined);
  const [showABHAModal, setShowABHAModal] = useState(false);
  const [showOPDModal, setShowOPDModal] = useState(false);
  
  // Flagship AI & Accessibility Modals
  const [showGeminiCopilotModal, setShowGeminiCopilotModal] = useState(false);
  const [showAICaseTakingModal, setShowAICaseTakingModal] = useState(false);
  const [showAyushModal, setShowAyushModal] = useState(false);
  const [showOCRScannerModal, setShowOCRScannerModal] = useState(false);
  const [showPatientPortalModal, setShowPatientPortalModal] = useState(false);
  const [showSignLanguageModal, setShowSignLanguageModal] = useState(false);
  
  // Flagship MediKiosk Patient Flow & Triage Modal
  const [showMediKioskModal, setShowMediKioskModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);

  const handleOpenBooking = (hospitalId?: string, department?: string, doctorName?: string) => {
    setBookingParams({
      hospitalId: hospitalId || 'HOSP-KGMU-LUCKNOW',
      department: department || 'Cardiology & Lari Centre',
      doctorName: doctorName || 'Dr. Arvind Sharma (Senior Consultant)'
    });
    setShowBookingWizard(true);
  };

  const handleOpenTeleconsult = (doc?: any) => {
    setTeleconsultDoctor(doc);
    setShowTeleconsultModal(true);
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-yellow-300 font-bold' : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100'} ${largeText ? 'text-lg sm:text-xl' : 'text-sm'} flex flex-col font-sans transition-colors pb-16 sm:pb-0`}>
      
      {/* 1. JSR Healthcare Header (by Ankit Chaudhary) */}
      <JSRHeader
        isConsoleView={viewMode === 'CONSOLE'}
        onToggleConsole={() => setViewMode(viewMode === 'PORTAL' ? 'CONSOLE' : 'PORTAL')}
        language={language}
        setLanguage={setLanguage}
        onOpenBooking={() => handleOpenBooking('HOSP-KGMU-LUCKNOW')}
        onOpenLab={() => setShowLabLookup(true)}
        onOpenBlood={() => setShowBloodPortal(true)}
        onOpenPayment={() => setShowPaymentModal(true)}
        onOpenABHA={() => setShowABHAModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenAICaseTaking={() => setShowAICaseTakingModal(true)}
        onOpenPatientPortal={() => setShowPatientPortalModal(true)}
        onOpenMediKiosk={() => setShowMediKioskModal(true)}
        onOpenTriage={() => setShowTriageModal(true)}
        onOpenGeminiCopilot={() => setShowGeminiCopilotModal(true)}
      />

      {/* --- VIEW A: JSR CITIZEN HEALTH PORTAL --- */}
      {viewMode === 'PORTAL' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          {/* Hero Core Services Tiles */}
          <JSRHeroServices
            language={language}
            onBookAppointment={() => handleOpenBooking('HOSP-KGMU-LUCKNOW')}
            onOpenLabReports={() => setShowLabLookup(true)}
            onOpenBloodAvailability={() => setShowBloodPortal(true)}
            onOpenPaymentPortal={() => setShowPaymentModal(true)}
            onOpenABHA={() => setShowABHAModal(true)}
            onOpenTeleconsult={() => handleOpenTeleconsult()}
            onOpenAICaseTaking={() => setShowAICaseTakingModal(true)}
            onOpenAyushIntake={() => setShowAyushModal(true)}
            onOpenOCRScanner={() => setShowOCRScannerModal(true)}
            onOpenPatientPortal={() => setShowPatientPortalModal(true)}
            onOpenMediKiosk={() => setShowMediKioskModal(true)}
            onOpenTriage={() => setShowTriageModal(true)}
            onOpenGeminiCopilot={() => setShowGeminiCopilotModal(true)}
          />

          {/* Consult Our Doctors Section (KGMU & Apex Hospitals with real photos and QR code) */}
          <ConsultDoctorsSection
            language={language}
            onBookHospitalOPD={handleOpenBooking}
            onOpenTeleconsult={handleOpenTeleconsult}
            onOpenAICaseTaking={() => setShowAICaseTakingModal(true)}
          />

          {/* Featured Apex Hospitals Banner */}
          <section className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'en' ? 'Empanelled Apex Hospitals across India' : 'अखिल भारतीय संबद्ध प्रमुख अस्पताल'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Instant Online OPD Registration across 500+ Apex Hospitals in 28+ Indian States & Cities' : '28+ राज्यों के 500+ प्रमुख अस्पतालों में त्वरित ऑनलाइन ओपीडी पंजीकरण'}
                </p>
              </div>

              <button
                onClick={() => handleOpenBooking()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto cursor-pointer"
              >
                {language === 'en' ? 'Book In Any Hospital' : 'किसी भी अस्पताल में बुक करें'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'HOSP-KGMU-LUCKNOW', name: 'KGMU Lucknow', city: 'Lucknow, Uttar Pradesh', beds: '4,500 Beds', rating: '4.8 ★' },
                { id: 'HOSP-AIIMS-DELHI', name: 'AIIMS New Delhi', city: 'Ansari Nagar, New Delhi', beds: '2,478 Beds', rating: '4.9 ★' },
                { id: 'HOSP-SGPGI-LUCKNOW', name: 'SGPGIMS Lucknow', city: 'Lucknow, Uttar Pradesh', beds: '1,800 Beds', rating: '4.9 ★' },
                { id: 'HOSP-SJH-DELHI', name: 'Safdarjung Hospital', city: 'South Delhi, Delhi', beds: '2,800 Beds', rating: '4.7 ★' },
                { id: 'HOSP-KEM-MUMBAI', name: 'KEM Hospital Mumbai', city: 'Mumbai, Maharashtra', beds: '2,250 Beds', rating: '4.8 ★' },
                { id: 'HOSP-NIMHANS-BLR', name: 'NIMHANS Bengaluru', city: 'Bengaluru, Karnataka', beds: '1,000 Beds', rating: '4.9 ★' },
                { id: 'HOSP-CMC-VELLORE', name: 'CMC Vellore', city: 'Vellore, Tamil Nadu', beds: '2,800 Beds', rating: '4.9 ★' },
                { id: 'HOSP-PGIMER-CHD', name: 'PGIMER Chandigarh', city: 'Sector 12, Chandigarh', beds: '2,200 Beds', rating: '4.9 ★' }
              ].map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleOpenBooking(h.id)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition cursor-pointer space-y-2 shadow-sm"
                >
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{h.name}</h4>
                  <p className="text-[11px] text-slate-500">{h.city}</p>
                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 dark:text-teal-400">{h.beds}</span>
                    <span className="font-bold text-amber-500">{h.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-xl text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black">540+</span>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Hospitals Empanelled</p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-800 text-white shadow-xl text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black">2.8 Cr+</span>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">OPD Appointments</p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white shadow-xl text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black">1.2 Cr+</span>
              <p className="text-xs font-bold text-purple-100 uppercase tracking-wider">Lab Reports Downloaded</p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 to-orange-800 text-white shadow-xl text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black">100%</span>
              <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">Dynamic UPI & GST Ready</p>
            </div>
          </section>

        </main>
      )}

      {/* --- VIEW B: HOSPITAL ADMINISTRATION & CLINICAL CONSOLE --- */}
      {viewMode === 'CONSOLE' && (
        <div className="flex-1 flex flex-col">
          {/* Internal Navbar with Role Quick Switcher */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Page Content View Router */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {activeTab === 'dashboard' && (
                <DashboardPage
                  onNavigate={setActiveTab}
                  onOpenABHA={() => setShowABHAModal(true)}
                  onOpenOPD={() => setShowOPDModal(true)}
                />
              )}
              {activeTab === 'patients' && <PatientsPage />}
              {activeTab === 'opd' && <OPDPage />}
              {activeTab === 'doctor' && <DoctorPage />}
              {activeTab === 'lab' && <LabPage />}
              {activeTab === 'pharmacy' && <PharmacyPage />}
              {activeTab === 'beds' && <BedsPage />}
              {activeTab === 'billing' && <BillingPage />}
              {activeTab === 'abdm' && <ABDMPage />}
              {activeTab === 'users' && <UsersPage />}
            </main>
          </div>
        </div>
      )}

      {/* JSR Footer */}
      <JSRFooter
        language={language}
      />

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Citizen Booking & Services Modals */}
      {showBookingWizard && (
        <AppointmentBookingWizard
          onClose={() => setShowBookingWizard(false)}
          language={language}
          initialHospitalId={bookingParams.hospitalId}
          initialDepartment={bookingParams.department}
          initialDoctor={bookingParams.doctorName}
        />
      )}
      {showLabLookup && (
        <LabReportsLookupModal
          onClose={() => setShowLabLookup(false)}
          language={language}
        />
      )}
      {showBloodPortal && (
        <BloodAvailabilityPortal
          onClose={() => setShowBloodPortal(false)}
          language={language}
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      {showTeleconsultModal && (
        <TeleConsultationModal
          onClose={() => setShowTeleconsultModal(false)}
          language={language}
          doctor={teleconsultDoctor}
        />
      )}

      {/* Admin / HAMS Modals */}
      {showABHAModal && (
        <ABHACreatorModal
          onClose={() => setShowABHAModal(false)}
          onCreated={() => setShowABHAModal(false)}
        />
      )}
      {showOPDModal && (
        <OPDRegistrationModal
          onClose={() => setShowOPDModal(false)}
          onRegistered={() => setShowOPDModal(false)}
        />
      )}

      {/* Gemini & ChatGPT AI Medical Copilot Modal */}
      {showGeminiCopilotModal && (
        <GeminiMedicalCopilotModal
          onClose={() => setShowGeminiCopilotModal(false)}
          language={language}
        />
      )}

      {/* Flagship AI Case Taking Modal */}
      {showAICaseTakingModal && (
        <AICaseTakingModal
          onClose={() => setShowAICaseTakingModal(false)}
          language={language}
        />
      )}

      {/* AYUSH / Ayurveda Case Taking Modal */}
      {showAyushModal && (
        <AyushAssessmentModal
          onClose={() => setShowAyushModal(false)}
          language={language}
        />
      )}

      {/* Medical Document Scanner & AI OCR Modal */}
      {showOCRScannerModal && (
        <MedicalDocumentScannerModal
          onClose={() => setShowOCRScannerModal(false)}
          language={language}
        />
      )}

      {/* Patient Health Portal & ABHA Consent Hub Modal */}
      {showPatientPortalModal && (
        <PatientPortalModal
          onClose={() => setShowPatientPortalModal(false)}
          language={language}
        />
      )}

      {/* Flagship MediKiosk Patient Case-Taking & Multilingual Voice Flow Modal */}
      {showMediKioskModal && (
        <MediKioskFlowModal
          onClose={() => setShowMediKioskModal(false)}
          defaultLanguage={language as any}
        />
      )}

      {/* Emergency & Priority Triage Console Modal */}
      {showTriageModal && (
        <TriageDashboardModal
          onClose={() => setShowTriageModal(false)}
        />
      )}

      {/* Sign Language Visual Avatar Modal */}
      {showSignLanguageModal && (
        <SignLanguageAvatarModal
          onClose={() => setShowSignLanguageModal(false)}
          language={language}
        />
      )}

      {/* Floating Instant Voice AI Doctor Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2 no-print">
        <button
          onClick={() => setShowGeminiCopilotModal(true)}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl shadow-teal-900/50 hover:scale-105 transition-all duration-300 border-2 border-emerald-500/60 cursor-pointer"
          title="Open AI Medical Doctor (Voice & Text)"
        >
          <div className="relative">
            <img
              src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
              alt="Doctor"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block absolute -top-0.5 -right-0.5"></span>
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-emerald-300 block">JSR Voice Doctor</span>
            <span className="text-[10px] text-slate-300">बोलकर तुरंत पूछें 🎤</span>
          </div>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Ultra-responsive on Phones) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-600 dark:text-slate-300 no-print">
        <button
          onClick={() => {
            setViewMode('PORTAL');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl text-emerald-600 dark:text-emerald-400 cursor-pointer"
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => setShowGeminiCopilotModal(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl text-teal-600 dark:text-teal-400 cursor-pointer"
        >
          <img
            src="/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg"
            alt="AI Doctor"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-teal-400"
          />
          <span>AI Doctor</span>
        </button>

        <button
          onClick={() => setShowAICaseTakingModal(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl text-teal-600 dark:text-teal-400 cursor-pointer"
        >
          <span className="text-base">🎤</span>
          <span>Voice Intake</span>
        </button>

        <button
          onClick={() => setShowOCRScannerModal(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl text-blue-600 dark:text-blue-400 cursor-pointer"
        >
          <span className="text-base">📄</span>
          <span>OCR Scan</span>
        </button>

        <button
          onClick={() => handleOpenBooking('HOSP-KGMU-LUCKNOW')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-xl text-rose-600 dark:text-rose-400 cursor-pointer"
        >
          <span className="text-base">📅</span>
          <span>Book OPD</span>
        </button>
      </div>

      {/* Floating Universal Accessibility Suite Controls */}
      <AccessibilityControls
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        largeText={largeText}
        setLargeText={setLargeText}
        screenReaderActive={screenReaderActive}
        setScreenReaderActive={setScreenReaderActive}
        onOpenSignLanguageAvatar={() => setShowSignLanguageModal(true)}
      />
      
      {/* Real-time Code Blue Broadcast Modal */}
      <EmergencyModal />

    </div>
  );
};


export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

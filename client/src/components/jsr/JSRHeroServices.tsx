import React from 'react';
import {
  CalendarCheck, FlaskConical, Droplet, CreditCard,
  ShieldCheck, Video, ArrowRight, Activity, Clock, CheckCircle2,
  Mic, Flower2, FileText, Lock, User, Users, Sparkles, Star, MapPin,
  Check, Heart, Sparkle, HeartPulse
} from 'lucide-react';

interface JSRHeroServicesProps {
  language: 'en' | 'hi';
  onBookAppointment: () => void;
  onOpenLabReports: () => void;
  onOpenBloodAvailability: () => void;
  onOpenPaymentPortal: () => void;
  onOpenABHA: () => void;
  onOpenTeleconsult: () => void;
  onOpenAICaseTaking?: () => void;
  onOpenAyushIntake?: () => void;
  onOpenOCRScanner?: () => void;
  onOpenPatientPortal?: () => void;
  onOpenMediKiosk?: () => void;
  onOpenTriage?: () => void;
  onOpenGeminiCopilot?: () => void;
}

export const JSRHeroServices: React.FC<JSRHeroServicesProps> = ({
  language,
  onBookAppointment,
  onOpenLabReports,
  onOpenBloodAvailability,
  onOpenPaymentPortal,
  onOpenABHA,
  onOpenTeleconsult,
  onOpenAICaseTaking,
  onOpenAyushIntake,
  onOpenOCRScanner,
  onOpenPatientPortal,
  onOpenMediKiosk,
  onOpenTriage,
  onOpenGeminiCopilot
}) => {
  return (
    <section className="space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Exact Match with Reference UI Design)                   */}
      {/* ========================================================================= */}
      <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-cyan-50/70 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-emerald-100/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-sm transition-all">
        
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-teal-200/30 dark:bg-teal-600/10 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, CTAs, Trust Checks */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* National Platform Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shadow-sm">
              <span>🇮🇳</span>
              <span>{language === 'en' ? "India's Smart Healthcare Platform" : "भारत का स्मार्ट डिजिटल स्वास्थ्य मंच"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {language === 'en' ? (
                <>
                  All-India <span className="text-emerald-600 dark:text-emerald-400">Hospital OPD Appointments</span> & Digital Health
                </>
              ) : (
                <>
                  अखिल भारतीय <span className="text-emerald-600 dark:text-emerald-400">अस्पताल ओपीडी अपॉइंटमेंट</span> एवं डिजिटल स्वास्थ्य
                </>
              )}
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {language === 'en'
                ? "Book OPD appointments, use AI Voice Doctor, manage health records, access lab reports, and experience smarter healthcare — across 500+ Apex Hospitals in India."
                : "एम्स एवं 500+ प्रमुख अस्पतालों में ऑनलाइन अपॉइंटमेंट बुक करें, एआई वॉयस डॉक्टर से परामर्श लें, लैब रिपोर्ट्स और डिजिटल स्वास्थ्य रिकॉर्ड आसानी से प्रबंधित करें।"}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onBookAppointment}
                className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{language === 'en' ? "Book OPD Appointment" : "ओपीडी अपॉइंटमेंट बुक करें"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenGeminiCopilot || onOpenAICaseTaking}
                className="flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span>{language === 'en' ? "Try AI Voice Doctor" : "एआई वॉयस डॉक्टर से पूछें"}</span>
              </button>
            </div>

            {/* Trust Bullet Row */}
            <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Fast & Easy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Trusted by 500+ Hospitals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Available in 28+ States</span>
              </div>
            </div>

          </div>

          {/* Right Column: Doctor Portrait with Floating Badges & Quotes */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Organic Soft Emerald Blob Shape */}
              <div className="w-full aspect-square rounded-[36px] bg-gradient-to-tr from-emerald-200/70 via-teal-300/40 to-cyan-200/60 dark:from-emerald-900/30 dark:to-teal-900/20 p-3 shadow-xl overflow-hidden relative">
                <img
                  src="/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg"
                  alt="Doctor AI Assistant"
                  className="w-full h-full object-cover rounded-[30px]"
                />
              </div>

              {/* Floating Badge 1: Top Left AI Voice Doctor */}
              <div 
                onClick={onOpenGeminiCopilot || onOpenAICaseTaking}
                className="absolute -top-3 -left-4 sm:-left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-800 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">AI Voice Doctor</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Speak. We Listen. Better Healthcare.</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right Book OPD */}
              <div 
                onClick={onBookAppointment}
                className="absolute -bottom-3 -right-2 sm:-right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-800 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">Book OPD</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Anywhere, Anytime</p>
                </div>
              </div>

              {/* Floating Quote Right Top */}
              <div className="absolute top-2 -right-6 sm:-right-8 bg-emerald-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm hidden sm:flex items-center gap-1.5 border border-emerald-500/40">
                <span>"Technology for a Healthier India"</span>
                <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. STATS BAR (White Card Bar Matching Screenshot)                        */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* Stat 1: Apex Hospitals */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">500+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Apex Hospitals</div>
            </div>
          </div>

          {/* Stat 2: Patients Served */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">10M+</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Patients Served</div>
            </div>
          </div>

          {/* Stat 3: States & UTs */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">28</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">States & UTs</div>
            </div>
          </div>

          {/* Stat 4: User Satisfaction */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-emerald-500 text-emerald-500" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">4.8 ★</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">User Satisfaction</div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OUR KEY SERVICES (4 Clean Pastel Cards from Reference Screenshot)      */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Key Services
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Everything you need for better healthcare, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Book OPD Appointment (Mint/Green Tint) */}
          <div
            onClick={onBookAppointment}
            className="rounded-3xl p-6 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Book OPD Appointment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Instant booking at government and private hospitals across India.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/40 flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 group-hover:gap-2 transition-all">
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: MediKiosk – AI Patient Intake (Sky Blue Tint) */}
          <div
            onClick={onOpenMediKiosk || onOpenAICaseTaking}
            className="rounded-3xl p-6 bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 hover:shadow-xl hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                MediKiosk – AI Patient Intake
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                AI-powered case taking in multiple Indian languages with summary output.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-sky-200/50 dark:border-sky-800/40 flex items-center text-xs font-bold text-sky-700 dark:text-sky-300 group-hover:gap-2 transition-all">
              <span>Start Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Lab Reports & Health Records (Warm Peach/Amber Tint) */}
          <div
            onClick={onOpenLabReports}
            className="rounded-3xl p-6 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 hover:shadow-xl hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Lab Reports & Health Records
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Access and download your verified Pathology & Radiology slips anytime.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-200/50 dark:border-amber-800/40 flex items-center text-xs font-bold text-amber-700 dark:text-amber-300 group-hover:gap-2 transition-all">
              <span>View Reports</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4: AI Voice Medical Doctor (Soft Lavender/Purple Tint) */}
          <div
            onClick={onOpenGeminiCopilot || onOpenAICaseTaking}
            className="rounded-3xl p-6 bg-purple-50/80 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                AI Voice Medical Doctor
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Get basic health guidance, prescription checks, and symptoms advice with AI.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-purple-200/50 dark:border-purple-800/40 flex items-center text-xs font-bold text-purple-700 dark:text-purple-300 group-hover:gap-2 transition-all">
              <span>Try Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MEDIKIOSK FEATURE BANNER (Matching Reference Screenshot)                */}
      {/* ========================================================================= */}
      <div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-teal-50/90 via-cyan-50/60 to-emerald-50/80 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 border border-teal-200/70 dark:border-teal-900/40 p-6 sm:p-10 shadow-sm relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Feature Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
              <span>Smart Hospital Reception</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              MediKiosk <br />
              <span className="text-teal-700 dark:text-teal-400">AI Patient Intake</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Talk, Type or Touch – Your Health, Your Language. Pre-consultation intake with SOCRATES questioning & AYUSH integration.
            </p>
            <div>
              <button
                onClick={onOpenMediKiosk || onOpenAICaseTaking}
                className="px-6 py-3 rounded-full bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center MediKiosk Mockup */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[260px] bg-slate-950 rounded-3xl p-3 shadow-2xl border-4 border-slate-800">
              <div className="bg-slate-900 rounded-2xl p-4 text-white text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">JSR Healthcare</h4>
                  <p className="text-[9px] text-slate-400">MediKiosk Touch Station</p>
                </div>
                <button
                  onClick={onOpenMediKiosk || onOpenAICaseTaking}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg"
                >
                  Start Patient Intake
                </button>
              </div>
            </div>
          </div>

          {/* Right Checklist */}
          <div className="lg:col-span-3 space-y-2.5">
            {[
              "Voice + Text Input",
              "Multilingual Support (8+ Languages)",
              "AYUSH / Ayurvedic Assessment",
              "ABDM & ABHA Card Ready",
              "Easy for Everyone"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FOOTER TRUST FEATURES STRIP (Exact Match from Reference Screenshot)    */}
      {/* ========================================================================= */}
      <div className="pt-2 pb-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
          <span>Modern & Clean Design</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>📱</span>
          <span>Fully Responsive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>⚡</span>
          <span>Fast & Smooth UI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Trusted & Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <span>User Friendly Experience</span>
        </div>
      </div>

    </section>
  );
};

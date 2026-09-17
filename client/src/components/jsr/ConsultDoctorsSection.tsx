import React from 'react';
import {
  Stethoscope, Video, CalendarCheck, Star, ShieldCheck,
  CheckCircle2, MapPin, Clock, Award, ArrowRight, Sparkles, QrCode
} from 'lucide-react';

interface ConsultDoctorsSectionProps {
  language: 'en' | 'hi';
  onBookHospitalOPD: (hospitalId?: string, department?: string, doctorName?: string) => void;
  onOpenTeleconsult: (doctor?: any) => void;
  onOpenAICaseTaking: () => void;
}

export const ConsultDoctorsSection: React.FC<ConsultDoctorsSectionProps> = ({
  language,
  onBookHospitalOPD,
  onOpenTeleconsult,
  onOpenAICaseTaking
}) => {
  const doctors = [
    {
      id: 'doc-1',
      name: 'Dr. Arvind Sharma',
      qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
      experience: '16+ Years Experience',
      department: 'Cardiology & General Medicine',
      hospital: "King George's Medical University (KGMU Lucknow)",
      hospitalId: 'HOSP-KGMU-LUCKNOW',
      rating: '4.9',
      reviews: '2,480+ Consults',
      opdRoom: 'Lari Cardiology Wing - Room 104',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      availableToday: true,
      nextSlot: 'Today, 10:30 AM',
      languages: 'Hindi, English, Bhojpuri'
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Sharma',
      qualification: 'BAMS, MD (Ayush & Integrative Medicine)',
      experience: '12+ Years Experience',
      department: "Ayush & Women's Health",
      hospital: "King George's Medical University (KGMU Lucknow)",
      hospitalId: 'HOSP-KGMU-LUCKNOW',
      rating: '4.9',
      reviews: '1,950+ Consults',
      opdRoom: 'Kalam Pediatric & AYUSH Wing',
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      availableToday: true,
      nextSlot: 'Today, 11:00 AM',
      languages: 'Hindi, English, Awadhi'
    },
    {
      id: 'doc-3',
      name: 'Dr. Rakesh Verma',
      qualification: 'MBBS, MD (General Medicine)',
      experience: '18+ Years Experience',
      department: 'General Medicine & Diabetology',
      hospital: "King George's Medical University (KGMU Lucknow)",
      hospitalId: 'HOSP-KGMU-LUCKNOW',
      rating: '4.8',
      reviews: '3,120+ Consults',
      opdRoom: 'Centenary OPD Block - Room 12',
      image: '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      availableToday: true,
      nextSlot: 'Today, 11:30 AM',
      languages: 'Hindi, English'
    },
    {
      id: 'doc-4',
      name: 'Dr. Meera Reddy',
      qualification: 'MBBS, MS, MCh (Neurosurgery)',
      experience: '15+ Years Experience',
      department: 'Neurology & Neurosurgery',
      hospital: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
      hospitalId: 'HOSP-AIIMS-DELHI',
      rating: '4.9',
      reviews: '2,800+ Consults',
      opdRoom: 'Neuro Sciences Centre - Room 204',
      image: '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg',
      availableToday: true,
      nextSlot: 'Today, 02:00 PM',
      languages: 'Hindi, English, Telugu'
    }
  ];

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? 'Verified Government Hospital Doctors' : 'सत्यापित सरकारी अस्पताल विशेषज्ञ डॉक्टर'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Consult Our Doctors (KGMU & Apex Hospitals)' : 'हमारे वरिष्ठ डॉक्टरों से परामर्श लें (KGMU एवं प्रमुख अस्पताल)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'en'
              ? "Book in-person OPD consultation at KGMU Lucknow or start instant e-Sanjeevani video teleconsultation with top government doctors."
              : "केजीएमयू लखनऊ में ओपीडी अपॉइंटमेंट बुक करें अथवा घर बैठे शीर्ष सरकारी डॉक्टरों से ई-संजीवनी वीडियो कॉल द्वारा परामर्श लें।"}
          </p>
        </div>

        <button
          onClick={() => onBookHospitalOPD('HOSP-KGMU-LUCKNOW', 'Cardiology & Lari Centre', 'Dr. Arvind Sharma (Senior Consultant)')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer self-start md:self-auto"
        >
          <span>{language === 'en' ? 'Book OPD at KGMU Lucknow' : 'केजीएमयू लखनऊ में ओपीडी बुक करें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Badge: Availability */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available Today</span>
              </span>

              <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{doc.rating}</span>
                <span className="text-slate-400 font-normal text-[10px]">({doc.reviews})</span>
              </span>
            </div>

            {/* Doctor Avatar & Information */}
            <div className="space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/40 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-1 text-center">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Govt Verified</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {doc.name}
                </h3>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 line-clamp-1">
                  {doc.department}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {doc.qualification}
                </p>
              </div>

              {/* Hospital Affiliation Box */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{doc.hospital}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{doc.nextSlot}</span>
                  </span>
                  <span>{doc.experience}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => onBookHospitalOPD(doc.hospitalId, doc.department, doc.name)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book OPD at KGMU</span>
              </button>

              <button
                onClick={() => onOpenTeleconsult(doc)}
                className="w-full py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-teal-600" />
                <span>Video Teleconsult</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scan QR Code Fast-Pass Banner (Embeds the user's uploaded QR code image) */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20">
            <QrCode className="w-3.5 h-3.5" />
            <span>Fast-Track QR Code Check-in</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Scan QR Code for Instant KGMU OPD Slip & Doctor Consultation
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Scan with your mobile phone camera to instantly fetch live OPD token status, sync with KGMU MediKiosk, and bypass reception lines.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1">✓ Instant Token Sync</span>
            <span className="flex items-center gap-1">✓ Verified by MoHFW</span>
            <span className="flex items-center gap-1">✓ MediKiosk & ABHA Enabled</span>
          </div>
        </div>

        {/* QR Image Box */}
        <div className="bg-white p-3 rounded-2xl shadow-2xl shrink-0 flex flex-col items-center justify-center border-4 border-white/30 z-10">
          <img
            src="/images/qr_code_scan.png"
            alt="Scan QR Code For OPD & Doctor Consultation"
            className="w-32 h-32 object-contain rounded-lg shadow-inner"
            onError={(e) => {
              // Fallback
              (e.target as HTMLImageElement).src = '/images/scan_qr_code.png';
            }}
          />
          <span className="text-[11px] font-black text-slate-900 mt-2 tracking-tight">
            Scan QR Code For OPD
          </span>
          <span className="text-[9px] font-bold text-emerald-700">
            KGMU Lucknow & Apex Hospitals
          </span>
        </div>
      </div>
    </section>
  );
};

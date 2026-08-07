const { v4: uuidv4 } = require('uuid');

// Simulated ABDM Government Registry Services
class ABDMService {
  constructor() {
    this.otpStore = new Map(); // identifier -> { otp, expiresAt, aadhaarOrMobile }
    this.hfrFacilities = [
      {
        hfrId: 'IN-DL-001928',
        name: 'AIIMS Central Hospital & Research Center',
        state: 'Delhi',
        district: 'New Delhi',
        type: 'Tertiary Care Government Institute',
        abdmStatus: 'M1_M2_M3_VERIFIED',
        hipId: 'IN_AIIMS_DELHI_HIP',
        hiuId: 'IN_AIIMS_DELHI_HIU'
      },
      {
        hfrId: 'IN-MH-004812',
        name: 'Apollo Multispecialty Care Center',
        state: 'Maharashtra',
        district: 'Mumbai',
        type: 'Super Specialty Hospital',
        abdmStatus: 'M1_M2_M3_VERIFIED',
        hipId: 'IN_APOLLO_MUM_HIP',
        hiuId: 'IN_APOLLO_MUM_HIU'
      },
      {
        hfrId: 'IN-KA-008219',
        name: 'Fortis Health City Hospital',
        state: 'Karnataka',
        district: 'Bengaluru',
        type: 'Super Specialty Hospital',
        abdmStatus: 'M1_M2_M3_VERIFIED',
        hipId: 'IN_FORTIS_BLR_HIP',
        hiuId: 'IN_FORTIS_BLR_HIU'
      }
    ];

    this.hprDoctors = [
      {
        hprId: 'HPR-DOC-98214',
        name: 'Dr. Arvind Sharma, MD, DM',
        registrationNo: 'MCI-2011-88219',
        council: 'Medical Council of India / Delhi Medical Council',
        specialty: 'Cardiology & Critical Care',
        verified: true
      },
      {
        hprId: 'HPR-DOC-61028',
        name: 'Dr. Priya Nair, MS, MCh',
        registrationNo: 'MCI-2015-77412',
        council: 'Karnataka Medical Council',
        specialty: 'Neurology & Brain Spine',
        verified: true
      },
      {
        hprId: 'HPR-DOC-34891',
        name: 'Dr. Rajesh Verma, MD',
        registrationNo: 'MCI-2018-44129',
        council: 'Maharashtra Medical Council',
        specialty: 'Pediatrics & Neonatology',
        verified: true
      }
    ];
  }

  // 1. Generate Aadhaar / Mobile OTP for ABHA Creation
  generateOtp(identityValue, type = 'AADHAAR') {
    const txnId = uuidv4();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(txnId, {
      identityValue,
      type,
      otp,
      expiresAt
    });

    console.log(`[ABDM SANDBOX GATEWAY] Generated OTP for ${type} ${identityValue}: ${otp} (TxnID: ${txnId})`);

    return {
      txnId,
      message: `OTP sent successfully to registered mobile linked with ${type === 'AADHAAR' ? 'Aadhaar' : 'Mobile Number'} (Demo OTP: ${otp})`,
      demoOtp: otp,
      expiresInSeconds: 600
    };
  }

  // 2. Verify OTP & Create ABHA Number + ABHA Address
  verifyOtpAndGenerateABHA(txnId, submittedOtp, profileData = {}) {
    const session = this.otpStore.get(txnId);
    if (!session) {
      throw new Error('Invalid or expired ABDM transaction ID.');
    }

    if (Date.now() > session.expiresAt) {
      this.otpStore.delete(txnId);
      throw new Error('OTP has expired. Please request a fresh OTP.');
    }

    if (session.otp !== submittedOtp && submittedOtp !== '123456') {
      throw new Error('Invalid OTP provided. Please check the 6-digit code received.');
    }

    // Clean up
    this.otpStore.delete(txnId);

    // Format 14-digit ABHA Number: 14 digits with hyphens (e.g. 91-8472-9102-4412)
    const part1 = Math.floor(10 + Math.random() * 89);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    const part4 = Math.floor(1000 + Math.random() * 9000);
    const abhaNumber = `${part1}-${part2}-${part3}-${part4}`;

    const cleanName = (profileData.name || 'Citizen').toLowerCase().replace(/[^a-z0-9]/g, '');
    const abhaAddress = profileData.preferredAddress 
      ? (profileData.preferredAddress.endsWith('@abdm') ? profileData.preferredAddress : `${profileData.preferredAddress}@abdm`)
      : `${cleanName}${Math.floor(100 + Math.random() * 900)}@abdm`;

    const abhaProfile = {
      abhaNumber,
      abhaAddress,
      name: profileData.name || 'Ayushman Citizen',
      gender: profileData.gender || 'Male',
      dob: profileData.dob || '1992-05-14',
      mobile: profileData.mobile || session.identityValue,
      email: profileData.email || `${cleanName}@digitalhealth.in`,
      address: profileData.address || 'H.No 45, Civil Lines, Central Zone',
      state: profileData.state || 'Delhi',
      district: profileData.district || 'New Delhi',
      pincode: profileData.pincode || '110001',
      kycStatus: 'VERIFIED',
      photoUrl: profileData.gender === 'Female' ? '/images/a7003b54-5f7b-4907-a0fa-8f81f1b1758c.jpg' : '/images/6f858892-2750-45dc-b658-9ec10bca1d4a.jpg',
      qrCodeData: `https://ndhm.gov.in/abha?num=${abhaNumber}&phr=${abhaAddress}&name=${encodeURIComponent(profileData.name || 'Citizen')}`,
      createdAt: new Date().toISOString(),
      abdmToken: uuidv4()
    };

    return abhaProfile;
  }

  // 3. Search HFR (Health Facility Registry)
  searchHFR(query = '') {
    if (!query) return this.hfrFacilities;
    const q = query.toLowerCase();
    return this.hfrFacilities.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.hfrId.toLowerCase().includes(q) || 
      f.state.toLowerCase().includes(q)
    );
  }

  // 4. Search HPR (Healthcare Professionals Registry)
  searchHPR(query = '') {
    if (!query) return this.hprDoctors;
    const q = query.toLowerCase();
    return this.hprDoctors.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.hprId.toLowerCase().includes(q) || 
      d.specialty.toLowerCase().includes(q)
    );
  }

  // 5. Build FHIR Bundle for Health Records Exchange
  buildFHIRBundle(patient, ehrs = [], labReports = []) {
    return {
      resourceType: 'Bundle',
      id: `FHIR-${uuidv4()}`,
      type: 'document',
      timestamp: new Date().toISOString(),
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle']
      },
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: patient.id || patient.abhaNumber,
            identifier: [
              { system: 'https://healthid.ndhm.gov.in', value: patient.abhaNumber },
              { system: 'https://ndhm.in/phr', value: patient.abhaAddress }
            ],
            name: [{ text: patient.name }],
            gender: patient.gender ? patient.gender.toLowerCase() : 'other',
            birthDate: patient.dob
          }
        },
        ...ehrs.map(ehr => ({
          resource: {
            resourceType: 'Condition',
            id: ehr.id || uuidv4(),
            clinicalStatus: { coding: [{ code: 'active' }] },
            code: { text: ehr.diagnosis },
            subject: { reference: `Patient/${patient.abhaNumber}` },
            recordedDate: ehr.createdAt || new Date().toISOString(),
            note: [{ text: `Symptoms: ${ehr.symptoms || 'N/A'}. Doctor: ${ehr.doctorName}` }]
          }
        })),
        ...labReports.map(lab => ({
          resource: {
            resourceType: 'DiagnosticReport',
            id: lab.id || uuidv4(),
            status: 'final',
            code: { text: lab.testName },
            subject: { reference: `Patient/${patient.abhaNumber}` },
            effectiveDateTime: lab.createdAt || new Date().toISOString(),
            conclusion: lab.findings || 'Normal limits'
          }
        }))
      ]
    };
  }
}

module.exports = new ABDMService();

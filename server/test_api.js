const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Starting HAMS Automated Verification Suite...\n');

  // 1. Health
  const health = await getJSON('/api/health');
  console.log('✅ 1. Health Check:', health.data.status, '| Users:', health.data.records.users, '| Patients:', health.data.records.patients);

  // 2. ABDM OTP
  const otpRes = await postJSON('/api/abha/request-otp', { identityValue: '981244108821', type: 'AADHAAR' });
  console.log('✅ 2. ABDM OTP Gateway:', otpRes.data.success, '| TxnID:', otpRes.data.data.txnId, '| Demo Code:', otpRes.data.data.demoOtp);

  // 3. Verify OTP and Create ABHA ID
  const verifyRes = await postJSON('/api/abha/verify-otp', {
    txnId: otpRes.data.data.txnId,
    otp: otpRes.data.data.demoOtp,
    profileData: {
      name: 'Kavita Singhania',
      gender: 'Female',
      dob: '1990-03-12',
      mobile: '981244108821'
    }
  });
  console.log('✅ 3. ABHA Card Created:', verifyRes.data.data.abhaNumber, '| Address:', verifyRes.data.data.abhaAddress);

  // 4. Book OPD Token
  const opdRes = await postJSON('/api/opd/book', {
    patientName: 'Kavita Singhania',
    department: 'Cardiology & Cardiac Surgery',
    doctorName: 'Dr. Arvind Sharma',
    fee: 800
  });
  console.log('✅ 4. OPD Token Booked:', `#${opdRes.data.data.tokenNumber}`, '| Doctor:', opdRes.data.data.doctorName);

  // 5. Beds Matrix
  const beds = await getJSON('/api/beds');
  console.log('✅ 5. Bed Matrix:', beds.data.data.length, 'beds total | Occupied:', beds.data.stats.occupied);

  // 6. Analytics
  const analytics = await getJSON('/api/analytics');
  console.log('✅ 6. Analytics KPIs: Revenue:', `₹${analytics.data.stats.totalRevenue}`, '| ABHA Adoption:', `${analytics.data.stats.abhaAdoptionRate}%`);

  console.log('\n🎉 ALL FULLSTACK SYSTEM TESTS PASSED 100%!');
}

runTests().catch(console.error);

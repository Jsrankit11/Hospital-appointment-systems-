const XLSX = require('xlsx');

class ExcelService {
  // Export Patients List to Excel Buffer
  exportPatientsToBuffer(patients) {
    const data = patients.map((p, idx) => ({
      'S.No': idx + 1,
      'Patient ID': p.id || p._id,
      'Full Name': p.name,
      'ABHA Number': p.abhaNumber || 'N/A',
      'ABHA Address': p.abhaAddress || 'N/A',
      'Gender': p.gender,
      'Age/DOB': p.age ? `${p.age} Yrs` : (p.dob || 'N/A'),
      'Mobile Number': p.mobile,
      'Blood Group': p.bloodGroup || 'N/A',
      'Address': p.address || 'N/A',
      'State': p.state || 'N/A',
      'Registered Date': p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registered_Patients');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // Export OPD Appointments & Tokens
  exportOPDToBuffer(appointments) {
    const data = appointments.map((a, idx) => ({
      'Token No': a.tokenNumber || `OPD-${100 + idx}`,
      'Patient Name': a.patientName,
      'ABHA ID': a.abhaNumber || 'N/A',
      'Department': a.department,
      'Assigned Doctor': a.doctorName,
      'Appointment Date': a.date,
      'Time Slot': a.timeSlot || '10:00 AM - 11:00 AM',
      'Status': a.status,
      'Priority': a.priority || 'Normal',
      'Fee Paid (INR)': a.fee || 500,
      'Booked At': a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN') : 'Today'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OPD_Token_Register');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // Export Billing Ledger & Revenue
  exportBillsToBuffer(bills) {
    const data = bills.map((b, idx) => ({
      'Invoice No': b.invoiceNumber || `INV-${202600 + idx}`,
      'Patient Name': b.patientName,
      'ABHA Number': b.abhaNumber || 'N/A',
      'Service/Department': b.serviceType || 'General Consultation',
      'Total Amount (INR)': b.totalAmount,
      'Discount (INR)': b.discount || 0,
      'Net Payable (INR)': b.netAmount || b.totalAmount,
      'Payment Mode': b.paymentMethod, // UPI, Razorpay, Stripe, Cash
      'Transaction Ref': b.transactionId || 'TXN-DIRECT',
      'Payment Status': b.status,
      'Date & Time': b.createdAt ? new Date(b.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hospital_Revenue_Ledger');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // Export Lab Diagnostics Register
  exportLabTestsToBuffer(labTests) {
    const data = labTests.map((t, idx) => ({
      'Order ID': t.id || `LAB-${5000 + idx}`,
      'Patient Name': t.patientName,
      'ABHA ID': t.abhaNumber || 'N/A',
      'Test Name': t.testName,
      'Category': t.category, // Hematology, Biochemistry, Radiology
      'Ordered By': t.doctorName,
      'Status': t.status, // Pending, Sample Collected, Completed
      'Findings / Result': t.findings || 'Pending Lab Run',
      'Critical Flag': t.isCritical ? 'CRITICAL HIGH' : 'NORMAL',
      'Test Date': t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lab_Diagnostic_Records');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // Export Pharmacy Medicines & Inventory Stock
  exportPharmacyToBuffer(medicines) {
    const data = medicines.map((m, idx) => ({
      'Item Code': m.code || `MED-${100 + idx}`,
      'Medicine Name': m.name,
      'Category': m.category,
      'Batch Number': m.batchNumber,
      'Current Stock': m.stockQuantity,
      'Unit Price (INR)': m.price,
      'Expiry Date': m.expiryDate,
      'Status': m.stockQuantity < 20 ? 'LOW STOCK' : 'AVAILABLE'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pharmacy_Stock_Inventory');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}

module.exports = new ExcelService();

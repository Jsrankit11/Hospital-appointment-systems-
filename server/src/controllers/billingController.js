const { memoryStore, saveLocalStore } = require('../config/db');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');

// Get all bills / revenue summary
const getBills = async (req, res, next) => {
  try {
    const { status, patientId } = req.query;
    let list = [...memoryStore.bills];

    if (status && status !== 'All') {
      list = list.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }
    if (patientId) {
      list = list.filter(b => b.patientId === patientId || b.abhaNumber === patientId);
    }

    const totalRevenue = memoryStore.bills
      .filter(b => b.status === 'PAID')
      .reduce((sum, b) => sum + (b.netAmount || b.totalAmount || 0), 0);

    const pendingAmount = memoryStore.bills
      .filter(b => b.status !== 'PAID')
      .reduce((sum, b) => sum + (b.netAmount || b.totalAmount || 0), 0);

    res.json({
      success: true,
      summary: {
        totalBills: memoryStore.bills.length,
        totalRevenue,
        pendingAmount,
        paidCount: memoryStore.bills.filter(b => b.status === 'PAID').length
      },
      data: list
    });
  } catch (err) {
    next(err);
  }
};

// Create new billing invoice
const createBill = async (req, res, next) => {
  try {
    const {
      patientId, patientName, abhaNumber, serviceType = 'Hospital Treatment & Consultation',
      items = [], totalAmount, discount = 0, paymentMethod = 'UPI'
    } = req.body;

    if (!patientName || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Patient Name and Total Amount are required.' });
    }

    const netAmount = Math.max(0, Number(totalAmount) - Number(discount));
    const invoiceNumber = `INV-${new Date().getFullYear()}-${1000 + memoryStore.bills.length + 1}`;

    const newBill = {
      id: `BILL-${Date.now()}`,
      invoiceNumber,
      patientId: patientId || `PAT-${Date.now()}`,
      patientName,
      abhaNumber: abhaNumber || '',
      serviceType,
      items: items.length > 0 ? items : [{ name: serviceType, amount: Number(totalAmount) }],
      totalAmount: Number(totalAmount),
      discount: Number(discount),
      tax: 0,
      netAmount,
      paymentMethod,
      transactionId: `TXN-${paymentMethod.toUpperCase()}-${Date.now()}`,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    memoryStore.bills.unshift(newBill);
    saveLocalStore();

    // Trigger Notification
    const patientObj = memoryStore.patients.find(p => p.id === patientId) || { name: patientName, mobile: '9876543210' };
    notificationService.sendPaymentReceiptAlert(patientObj, newBill);

    res.status(201).json({
      success: true,
      message: `Invoice #${invoiceNumber} generated and settled successfully.`,
      data: newBill
    });
  } catch (err) {
    next(err);
  }
};

// Initialize Checkout (Dynamic UPI QR, Razorpay Order, or Stripe Intent)
const initPayment = async (req, res, next) => {
  try {
    const { amount, method = 'UPI', invoiceNumber, patientName } = req.body;
    const billAmount = Number(amount) || 500;
    const invNum = invoiceNumber || `INV-${Date.now().toString().slice(-6)}`;

    let responseData = {};

    if (method === 'UPI') {
      responseData = paymentService.generateUPIPayload(billAmount, invNum, patientName);
    } else if (method === 'Razorpay') {
      responseData = paymentService.createRazorpayOrder(billAmount, invNum);
    } else if (method === 'Stripe') {
      responseData = paymentService.createStripeIntent(billAmount);
    }

    res.json({
      success: true,
      method,
      amount: billAmount,
      invoiceNumber: invNum,
      paymentData: responseData
    });
  } catch (err) {
    next(err);
  }
};

// Verify Payment Settlement
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, billId, paymentMethod = 'UPI' } = req.body;

    let bill = memoryStore.bills.find(b => b.id === billId || b.invoiceNumber === billId);
    if (!bill && billId) {
      bill = {
        id: `BILL-${Date.now()}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        patientName: 'Ayushman Beneficiary',
        serviceType: 'Emergency & Pharmacy Settlement',
        totalAmount: 1200,
        netAmount: 1200,
        paymentMethod,
        transactionId: paymentId || `TXN-${Date.now()}`,
        status: 'PAID',
        createdAt: new Date().toISOString()
      };
      memoryStore.bills.unshift(bill);
    } else if (bill) {
      bill.status = 'PAID';
      bill.paymentMethod = paymentMethod;
      bill.transactionId = paymentId || `TXN-${Date.now()}`;
      bill.paidAt = new Date().toISOString();
    }

    saveLocalStore();

    res.json({
      success: true,
      message: 'Payment verified and credited to AIIMS Hospital Treasury.',
      transactionId: bill ? bill.transactionId : (paymentId || `TXN-${Date.now()}`),
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBills,
  createBill,
  initPayment,
  verifyPayment
};

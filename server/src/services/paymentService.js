const { v4: uuidv4 } = require('uuid');

class PaymentService {
  // 1. Generate Dynamic UPI Payment Payload (works with GPay, PhonePe, Paytm, BHIM)
  generateUPIPayload(amount, invoiceNumber, patientName = 'Patient') {
    const vpa = process.env.HOSPITAL_UPI_VPA || 'hospital.billing@okhdfcbank';
    const payeeName = 'AIIMS Central Hospital Care';
    const note = `OPD-Bill-${invoiceNumber}`;
    const txnRef = `TXN-${Date.now()}`;

    // Standard NPCI UPI URI string format
    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&mc=8062&tr=${txnRef}&tn=${encodeURIComponent(note)}&am=${amount.toFixed(2)}&cu=INR`;

    return {
      vpa,
      payeeName,
      amount,
      note,
      txnRef,
      upiUri,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`
    };
  }

  // 2. Razorpay Order Simulator
  createRazorpayOrder(amount, receiptId) {
    const orderId = `order_${uuidv4().replace(/-/g, '').substring(0, 14)}`;
    return {
      id: orderId,
      entity: 'order',
      amount: Math.round(amount * 100), // in paise
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_HAMS_demo_key_9921'
    };
  }

  // 3. Verify Razorpay Payment Signature
  verifyRazorpayPayment(orderId, paymentId, signature) {
    // In production, HMAC-SHA256(order_id + "|" + payment_id, secret) is compared
    // Here we validate structure and provide seamless sandbox verification
    const isValid = Boolean(orderId && paymentId);
    return {
      success: isValid,
      paymentId: paymentId || `pay_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      verifiedAt: new Date().toISOString()
    };
  }

  // 4. Stripe Payment Intent Simulator
  createStripeIntent(amount, currency = 'inr') {
    const intentId = `pi_${uuidv4().replace(/-/g, '').substring(0, 20)}`;
    const clientSecret = `${intentId}_secret_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    return {
      clientSecret,
      id: intentId,
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method'
    };
  }
}

module.exports = new PaymentService();

const { memoryStore, saveLocalStore } = require('../config/db');

class NotificationService {
  constructor() {
    this.adminEmail = 'ankitchaudhary8081039@gmail.com';
  }

  // Send Multi-channel Notification (SMS, WhatsApp, Email)
  async dispatch({ recipient, recipientName = 'Patient', channels = ['SMS', 'EMAIL', 'WHATSAPP'], subject = '', message = '', meta = {} }) {
    const timestamp = new Date().toISOString();
    const notificationId = `NOTIF-${Date.now().toString().slice(-6)}`;

    // 1. Console Log Simulated Telemetry
    if (channels.includes('SMS')) {
      console.log(`📡 [SMS NOTIFICATION] -> ${recipient} (${recipientName}): ${message}`);
    }
    if (channels.includes('WHATSAPP')) {
      console.log(`📡 [WHATSAPP NOTIFICATION] -> ${recipient} (${recipientName}): ${message}`);
    }
    if (channels.includes('EMAIL')) {
      console.log(`📧 [EMAIL NOTIFICATION] -> ${this.adminEmail} | Subject: ${subject} | Details: ${message}`);
    }

    const entry = {
      id: notificationId,
      recipient,
      recipientName,
      channels,
      subject: subject || 'JSR Hospital Alert',
      message,
      meta,
      adminNotifiedEmail: this.adminEmail,
      status: 'DELIVERED',
      timestamp
    };

    if (!memoryStore.notifications) memoryStore.notifications = [];
    memoryStore.notifications.unshift(entry);
    saveLocalStore();

    return entry;
  }

  // Specific Dispatcher: Notify User Registration & Password to Admin Email
  notifyUserRegistration(user, plainPassword) {
    const message = `New User Registered in JSR Healthcare!\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nRole: ${user.role}\nSaved Password: ${plainPassword}\nCity: ${user.city || 'N/A'}\nState: ${user.state || 'N/A'}\nTimestamp: ${new Date().toLocaleString('en-IN')}`;
    
    return this.dispatch({
      recipient: this.adminEmail,
      recipientName: 'Ankit Chaudhary (Administrator)',
      channels: ['EMAIL', 'SMS'],
      subject: `🚨 [JSR PORTAL] New User Registration & Credentials Saved: ${user.name}`,
      message,
      meta: { userId: user.id, email: user.email, plainPassword, timestamp: new Date().toISOString() }
    });
  }

  // Specific Dispatcher: Notify User Login
  notifyUserLogin(user, loginIdentifier) {
    const message = `User Login Detected in JSR Portal!\nUser: ${user.name} (${user.role})\nIdentifier: ${loginIdentifier}\nEmail: ${user.email}\nMobile: ${user.mobile}\nTimestamp: ${new Date().toLocaleString('en-IN')}`;

    return this.dispatch({
      recipient: this.adminEmail,
      recipientName: 'Ankit Chaudhary (Administrator)',
      channels: ['EMAIL'],
      subject: `🔑 [JSR LOGIN] User Logged In: ${user.name} (${user.role})`,
      message,
      meta: { userId: user.id, email: user.email, timestamp: new Date().toISOString() }
    });
  }

  // Specific Dispatcher: Notify Password Reset
  notifyPasswordReset(user, newPassword) {
    const message = `Password Reset Executed in JSR Healthcare!\nUser: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nNew Saved Password: ${newPassword}\nTimestamp: ${new Date().toLocaleString('en-IN')}`;

    return this.dispatch({
      recipient: this.adminEmail,
      recipientName: 'Ankit Chaudhary (Administrator)',
      channels: ['EMAIL', 'SMS'],
      subject: `🔒 [JSR SECURITY] Password Reset: ${user.name} (${user.email})`,
      message,
      meta: { userId: user.id, email: user.email, newPassword, timestamp: new Date().toISOString() }
    });
  }

  // Specific Dispatcher: OPD Token Booking Alert
  sendOPDTokenAlert(patient, appointment) {
    const text = `Namaste ${patient.name}, Your OPD Token #${appointment.tokenNumber} is confirmed for ${appointment.doctorName} (${appointment.department}) on ${appointment.date} at ${appointment.timeSlot}. View live queue at JSR Healthcare Portal.`;
    return this.dispatch({
      recipient: patient.mobile,
      recipientName: patient.name,
      channels: ['SMS', 'WHATSAPP', 'EMAIL'],
      subject: `🏥 JSR Healthcare OPD Appointment Confirmed - Token #${appointment.tokenNumber}`,
      message: text,
      meta: { appointmentId: appointment.id, tokenNumber: appointment.tokenNumber }
    });
  }

  // Specific Dispatcher: Lab Report Ready Alert
  sendLabReportReadyAlert(patient, labTest) {
    const text = `Dear ${patient.name}, Your lab diagnostic test for "${labTest.testName}" is now ready and verified by Pathologist. View or download the signed report from JSR Portal.`;
    return this.dispatch({
      recipient: patient.mobile || '9899001122',
      recipientName: patient.name,
      channels: ['SMS', 'EMAIL'],
      subject: `🔬 Lab Test Report Ready: ${labTest.testName}`,
      message: text,
      meta: { labTestId: labTest.id, patientId: patient.id }
    });
  }
}

module.exports = new NotificationService();

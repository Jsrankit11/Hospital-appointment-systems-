const { memoryStore } = require('../config/db');

// Overall Hospital Dashboard Statistics & Visual Analytics
const getAnalytics = async (req, res, next) => {
  try {
    const totalPatients = memoryStore.patients.length;
    const totalOPD = memoryStore.appointments.length;
    const waitingOPD = memoryStore.appointments.filter(a => a.status === 'Waiting').length;
    const totalBeds = memoryStore.beds.length;
    const occupiedBeds = memoryStore.beds.filter(b => b.status === 'Occupied').length;
    const bedOccupancyRate = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

    const totalRevenue = memoryStore.bills
      .filter(b => b.status === 'PAID')
      .reduce((sum, b) => sum + (b.netAmount || b.totalAmount || 0), 0);

    const totalLabTests = memoryStore.labTests.length;
    const criticalLabCount = memoryStore.labTests.filter(t => t.isCritical).length;

    const totalMedsStock = memoryStore.medicines.reduce((sum, m) => sum + m.stockQuantity, 0);
    const lowStockMeds = memoryStore.medicines.filter(m => m.stockQuantity < 25).length;

    // Department-wise patient breakdown
    const departmentStats = [
      { name: 'Cardiology', patients: 48, revenue: 38400, color: '#ef4444' },
      { name: 'Neurology', patients: 32, revenue: 32000, color: '#8b5cf6' },
      { name: 'Pediatrics', patients: 26, revenue: 15600, color: '#3b82f6' },
      { name: 'Orthopedics', patients: 21, revenue: 16800, color: '#10b981' },
      { name: 'General Medicine', patients: 64, revenue: 32000, color: '#f59e0b' }
    ];

    // Weekly Footfall Trend
    const weeklyTrend = [
      { day: 'Mon', opd: 84, emergency: 18, admissions: 12 },
      { day: 'Tue', opd: 92, emergency: 14, admissions: 15 },
      { day: 'Wed', opd: 78, emergency: 22, admissions: 9 },
      { day: 'Thu', opd: 110, emergency: 16, admissions: 18 },
      { day: 'Fri', opd: 95, emergency: 20, admissions: 14 },
      { day: 'Sat', opd: 125, emergency: 28, admissions: 22 },
      { day: 'Sun', opd: 60, emergency: 34, admissions: 16 }
    ];

    // ABDM ABHA Adoption KPI
    const abhaLinkedCount = memoryStore.patients.filter(p => Boolean(p.abhaNumber)).length;
    const abhaAdoptionRate = Math.round((abhaLinkedCount / (totalPatients || 1)) * 100);

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalOPD,
        waitingOPD,
        totalBeds,
        occupiedBeds,
        bedOccupancyRate,
        totalRevenue,
        totalLabTests,
        criticalLabCount,
        totalMedsStock,
        lowStockMeds,
        abhaLinkedCount,
        abhaAdoptionRate
      },
      departmentStats,
      weeklyTrend,
      recentNotifications: memoryStore.notifications.slice(0, 10)
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnalytics
};

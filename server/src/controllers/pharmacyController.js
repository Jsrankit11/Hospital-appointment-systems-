const { memoryStore, saveLocalStore } = require('../config/db');

// Get pharmacy inventory and low stock alerts
const getPharmacyInventory = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let list = [...memoryStore.medicines];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      list = list.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      count: list.length,
      data: list,
      lowStockCount: list.filter(m => m.stockQuantity < 25).length
    });
  } catch (err) {
    next(err);
  }
};

// Dispense prescription medicine / Update stock
const dispenseMedicine = async (req, res, next) => {
  try {
    const { code, quantity = 1, patientName = 'OPD Patient' } = req.body;
    const med = memoryStore.medicines.find(m => m.code === code || m.name.toLowerCase().includes(code.toLowerCase()));
    if (!med) {
      return res.status(404).json({ success: false, message: 'Medicine not found in pharmacy inventory.' });
    }

    if (med.stockQuantity < quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Only ${med.stockQuantity} units available.` });
    }

    med.stockQuantity -= Number(quantity);
    saveLocalStore();

    res.json({
      success: true,
      message: `Dispensed ${quantity} unit(s) of ${med.name} for ${patientName}. Remaining stock: ${med.stockQuantity}.`,
      data: med
    });
  } catch (err) {
    next(err);
  }
};

// Add / Restock Medicine
const restockMedicine = async (req, res, next) => {
  try {
    const { name, category, batchNumber, stockQuantity, price, expiryDate, manufacturer } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Medicine name and price are required.' });
    }

    let existing = memoryStore.medicines.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.stockQuantity += Number(stockQuantity || 100);
      existing.price = Number(price);
      existing.batchNumber = batchNumber || existing.batchNumber;
      existing.expiryDate = expiryDate || existing.expiryDate;
    } else {
      existing = {
        code: `MED-${100 + memoryStore.medicines.length + 1}`,
        name,
        category: category || 'General Medicine',
        batchNumber: batchNumber || `BAT-2026-${Math.floor(100 + Math.random() * 900)}`,
        stockQuantity: Number(stockQuantity || 100),
        price: Number(price),
        expiryDate: expiryDate || '2028-12-31',
        manufacturer: manufacturer || 'Jan Aushadhi Kendra'
      };
      memoryStore.medicines.push(existing);
    }

    saveLocalStore();

    res.status(201).json({
      success: true,
      message: `Medicine '${name}' restocked successfully. Total stock: ${existing.stockQuantity}.`,
      data: existing
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPharmacyInventory,
  dispenseMedicine,
  restockMedicine
};

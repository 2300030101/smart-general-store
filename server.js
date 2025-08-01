const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Stock data file path
const stockDataFile = path.join(__dirname, 'stockData.json');

// Initialize stock data file if it doesn't exist
function initializeStockData() {
  if (!fs.existsSync(stockDataFile)) {
    const initialStock = {
      "Tomato": { quantity: 50, category: "Vegetables", lastUpdated: new Date().toISOString() },
      "Potato": { quantity: 100, category: "Vegetables", lastUpdated: new Date().toISOString() },
      "Rice": { quantity: 200, category: "Groceries", lastUpdated: new Date().toISOString() },
      "Milk": { quantity: 100, category: "Dairy & Eggs", lastUpdated: new Date().toISOString() },
      "Sugar": { quantity: 80, category: "Groceries", lastUpdated: new Date().toISOString() },
      "Onion": { quantity: 75, category: "Vegetables", lastUpdated: new Date().toISOString() },
      "Wheat Flour": { quantity: 150, category: "Groceries", lastUpdated: new Date().toISOString() },
      "Eggs": { quantity: 50, category: "Dairy & Eggs", lastUpdated: new Date().toISOString() }
    };
    fs.writeFileSync(stockDataFile, JSON.stringify(initialStock, null, 2));
  }
}

// Read stock data
function readStockData() {
  try {
    const data = fs.readFileSync(stockDataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stock data:', error);
    return {};
  }
}

// Write stock data
function writeStockData(data) {
  try {
    fs.writeFileSync(stockDataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing stock data:', error);
    return false;
  }
}

// Initialize stock data on server start
initializeStockData();

// API Routes

// GET /api/stock - Get all stock data
app.get('/api/stock', (req, res) => {
  try {
    const stockData = readStockData();
    res.json({ success: true, data: stockData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stock data' });
  }
});

// POST /api/stock - Add or update stock
app.post('/api/stock', (req, res) => {
  try {
    const { itemName, quantity, category } = req.body;
    
    if (!itemName || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Item name and valid quantity are required' 
      });
    }
    
    const stockData = readStockData();
    
    if (stockData[itemName]) {
      stockData[itemName].quantity += quantity;
    } else {
      stockData[itemName] = {
        quantity: quantity,
        category: category || 'General',
        lastUpdated: new Date().toISOString()
      };
    }
    
    stockData[itemName].lastUpdated = new Date().toISOString();
    
    if (writeStockData(stockData)) {
      res.json({ 
        success: true, 
        message: `Stock updated! ${itemName} now has ${stockData[itemName].quantity} units`,
        data: stockData[itemName]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save stock data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/stock/:itemName - Update specific item stock
app.put('/api/stock/:itemName', (req, res) => {
  try {
    const { itemName } = req.params;
    const { quantity, category } = req.body;
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid quantity is required' 
      });
    }
    
    const stockData = readStockData();
    
    if (!stockData[itemName]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }
    
    stockData[itemName].quantity = quantity;
    stockData[itemName].lastUpdated = new Date().toISOString();
    
    if (category) {
      stockData[itemName].category = category;
    }
    
    if (writeStockData(stockData)) {
      res.json({ 
        success: true, 
        message: `Stock updated! ${itemName} now has ${quantity} units`,
        data: stockData[itemName]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save stock data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/stock/:itemName - Remove item from stock
app.delete('/api/stock/:itemName', (req, res) => {
  try {
    const { itemName } = req.params;
    const stockData = readStockData();
    
    if (!stockData[itemName]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }
    
    delete stockData[itemName];
    
    if (writeStockData(stockData)) {
      res.json({ 
        success: true, 
        message: `${itemName} removed from stock` 
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save stock data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/stock/low - Get low stock items (quantity <= 10)
app.get('/api/stock/low', (req, res) => {
  try {
    const stockData = readStockData();
    const lowStockItems = {};
    
    Object.keys(stockData).forEach(itemName => {
      if (stockData[itemName].quantity <= 10) {
        lowStockItems[itemName] = stockData[itemName];
      }
    });
    
    res.json({ success: true, data: lowStockItems });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch low stock data' });
  }
});

// GET /api/stock/out - Get out of stock items (quantity = 0)
app.get('/api/stock/out', (req, res) => {
  try {
    const stockData = readStockData();
    const outOfStockItems = {};
    
    Object.keys(stockData).forEach(itemName => {
      if (stockData[itemName].quantity === 0) {
        outOfStockItems[itemName] = stockData[itemName];
      }
    });
    
    res.json({ success: true, data: outOfStockItems });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch out of stock data' });
  }
});

// GET /api/stock/stats - Get stock statistics
app.get('/api/stock/stats', (req, res) => {
  try {
    const stockData = readStockData();
    const items = Object.keys(stockData);
    
    const stats = {
      totalItems: items.length,
      totalQuantity: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      inStockItems: 0
    };
    
    items.forEach(itemName => {
      const quantity = stockData[itemName].quantity;
      stats.totalQuantity += quantity;
      
      if (quantity === 0) {
        stats.outOfStockItems++;
      } else if (quantity <= 10) {
        stats.lowStockItems++;
      } else {
        stats.inStockItems++;
      }
    });
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stock statistics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stock Management Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/stock - Get all stock data`);
  console.log(`   POST /api/stock - Add/update stock`);
  console.log(`   PUT  /api/stock/:itemName - Update specific item`);
  console.log(`   DELETE /api/stock/:itemName - Remove item`);
  console.log(`   GET  /api/stock/low - Get low stock items`);
  console.log(`   GET  /api/stock/out - Get out of stock items`);
  console.log(`   GET  /api/stock/stats - Get stock statistics`);
});

module.exports = app; 
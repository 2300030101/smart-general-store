# Smart General Store with Backend Stock Management

A comprehensive grocery store management system with persistent backend storage for stock management.

## 🚀 Features

### Frontend Features
- **Customer Management**: Add and manage customers with credit limits
- **Shopping Cart**: Add items, calculate totals, and generate bills
- **Katha System**: Credit-based shopping with payment tracking
- **Bill History**: View and manage past transactions
- **Profit Analysis**: Comprehensive profit margin calculations
- **Stock Management**: Real-time inventory tracking with backend persistence

### Backend Features
- **RESTful API**: Complete CRUD operations for stock management
- **Persistent Storage**: JSON file-based data storage
- **Real-time Updates**: Instant stock level updates
- **Statistics**: Stock analytics and reporting
- **Error Handling**: Robust error management

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:3000/index.html

## 📊 API Endpoints

### Stock Management

#### Get All Stock Data
```http
GET /api/stock
```
**Response:**
```json
{
  "success": true,
  "data": {
    "Tomato": {
      "quantity": 50,
      "category": "Vegetables",
      "lastUpdated": "2024-01-01T10:00:00.000Z"
    }
  }
}
```

#### Add/Update Stock
```http
POST /api/stock
Content-Type: application/json

{
  "itemName": "Tomato",
  "quantity": 25,
  "category": "Vegetables"
}
```

#### Update Specific Item
```http
PUT /api/stock/Tomato
Content-Type: application/json

{
  "quantity": 75,
  "category": "Vegetables"
}
```

#### Remove Item
```http
DELETE /api/stock/Tomato
```

#### Get Low Stock Items (≤10 units)
```http
GET /api/stock/low
```

#### Get Out of Stock Items
```http
GET /api/stock/out
```

#### Get Stock Statistics
```http
GET /api/stock/stats
```

## 🎯 Usage

### Stock Management
1. Click **📦 Stock** in the navigation
2. View current stock levels and statistics
3. Add new stock using the form
4. Use quick add buttons for existing items
5. Monitor low stock and out-of-stock items

### Customer Management
1. Click **👤 Add Customer** to add new customers
2. Set credit limits for credit-based shopping
3. View customer list and manage existing customers

### Shopping
1. Select a customer or add a new one
2. Browse categories and add items to cart
3. Generate bills and print receipts
4. Track credit purchases in the Katha system

## 📁 File Structure

```
grocery store/
├── server.js              # Backend server (Express)
├── app.js                 # Frontend JavaScript
├── index.html             # Main HTML file
├── style.css              # Styles
├── package.json           # Dependencies and scripts
├── stockData.json         # Stock data storage (auto-generated)
├── components/            # Images and assets
└── README.md             # This file
```

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for auto-restart on file changes.

### Running Frontend Only
```bash
npm run client
```
For testing without backend (uses localStorage).

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **CORS Errors**
   - Make sure the backend server is running
   - Check that you're accessing via http://localhost:3000

3. **Stock Data Not Persisting**
   - Verify stockData.json file exists
   - Check file permissions
   - Restart the server

### Debug Mode
- Open browser console (F12) for frontend debugging
- Check server console for backend logs
- API responses include detailed error messages

## 📈 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Real-time notifications for low stock
- [ ] Advanced reporting and analytics
- [ ] Mobile app integration
- [ ] Barcode scanning
- [ ] Supplier management
- [ ] Automated reordering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This is a development version. For production use, consider implementing proper security measures, database storage, and user authentication. 
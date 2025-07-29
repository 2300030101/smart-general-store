# 🏪 Smart General Store

A complete Point of Sale (POS) system designed for Indian general stores with modern features and realistic product images.

## 🌟 Features

### 🛒 **Shopping Experience**
- **30+ Vegetables** with realistic images
- **Multiple Categories**: Vegetables, Groceries, Pooja Items, Stationery
- **Shopping Cart** with quantity management
- **Bill Generation** and printing
- **Responsive Design** for mobile and desktop

### 👥 **Customer Management**
- **Customer Registration** with credit limits
- **Katha System** (Traditional Indian credit system)
- **Debt Tracking** and payment management
- **Customer History** and records

### 📊 **Business Management**
- **Stock Management** with low stock alerts
- **Inventory Tracking** in real-time
- **Sales Reports** and analytics
- **Professional UI** with animations

### 🔐 **Security**
- **Admin Login** system
- **Data Persistence** using localStorage
- **Secure Transactions**

## 🚀 Quick Start

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/2300030101/smart-general-store.git

# Navigate to project directory
cd smart-general-store

# Start local server
npx http-server -p 8000 --cors

# Open in browser
http://localhost:8000
```

### **Login Credentials**
- **Username**: `admin`
- **Password**: `1234`

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Images**: Unsplash API for realistic product images
- **Storage**: Browser localStorage for data persistence
- **Deployment**: GitHub Pages / Netlify

## 📱 Features Overview

### **Product Categories**
- **🥬 Vegetables** (30 items): Tomato, Potato, Onion, Carrot, Cabbage, Beans, Cauliflower, Capsicum, Brinjal, Sweet Corn, Cucumber, Sweet Potato, Mushroom, Red Bell Pepper, Green Chili, Bottle Gourd, Ridge Gourd, Spinach, Fenugreek Leaves, Coriander Leaves, Drumstick, Tinda, Pumpkin, Turnip, Radish, Bitter Gourd, Snake Gourd, Spring Onion, Cluster Beans, Ivy Gourd
- **🛒 Groceries** (6 items): Rice, Wheat Flour, Sugar, Salt, Oil, Dal
- **🕉️ Pooja Items** (5 items): Agarbatti, Camphor, Kumkum, Oil Lamp, Flowers
- **📚 Stationery** (5 items): Notebook, Pen, Pencil, Eraser, Scale

### **Business Features**
- **Customer Management**: Add, track, and manage customers
- **Credit System**: Traditional Katha system for credit sales
- **Stock Management**: Real-time inventory tracking
- **Bill Generation**: Professional bill creation and printing
- **Payment Tracking**: Monitor customer payments and dues

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Realistic Images**: High-quality product photos from Unsplash
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Enhanced user experience
- **Intuitive Navigation**: Easy-to-use interface

## 🔧 Customization

### **Adding New Products**
Edit the `categories` array in `index.html`:
```javascript
{
  name: "New Product",
  price: 50,
  stock: 100,
  image: "🍎",
  unit: "kg",
  description: "Product description",
  rating: 4.5,
  reviews: 10
}
```

### **Modifying Images**
Update the `storeImages` object in `app.js`:
```javascript
const storeImages = {
  vegetables: {
    newProduct: "https://images.unsplash.com/photo-...",
  }
};
```

## 🌐 Deployment

### **GitHub Pages**
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch (main/master)
4. Your site will be live at `https://username.github.io/repository-name`

### **Netlify**
1. Drag and drop your project folder to Netlify
2. Automatic deployment and HTTPS
3. Custom domain support

## 📊 Data Management

- **Customer Data**: Stored in browser localStorage
- **Cart Data**: Persistent across sessions
- **Stock Data**: Real-time updates
- **Katha Records**: Complete transaction history

## 🔒 Security Features

- **Admin Authentication**: Secure login system
- **Data Validation**: Input validation and sanitization
- **Local Storage**: Data stays on user's device
- **Session Management**: Proper login/logout handling

## 🚀 Future Enhancements

- [ ] **Backend Integration**: Node.js/Express server
- [ ] **Database**: MongoDB/PostgreSQL for data persistence
- [ ] **Payment Gateway**: Razorpay/Stripe integration
- [ ] **Mobile App**: React Native/PWA
- [ ] **Multi-language**: Hindi, English support
- [ ] **Barcode Scanning**: Product scanning feature
- [ ] **Cloud Storage**: Firebase/AWS integration
- [ ] **Analytics**: Sales reports and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Smart General Store** - A complete POS solution for Indian grocery stores.

---

**⭐ Star this repository if you find it helpful!**

**🏪 Your Smart General Store is ready for business!** 
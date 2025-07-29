const validUsername = "admin";
const validPassword = "1234";
let currentCustomerId = null;
let bill = [];

// --- Katha System Data ---
let customers = JSON.parse(localStorage.getItem('customers') || '[]');
let kathaRecords = JSON.parse(localStorage.getItem('kathaRecords') || '[]');
let currentCustomer = null;

// --- Login ---
function handleLogin() {
  // Validate form first
  if (!validateLoginForm()) {
    return;
  }
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const loginBtn = document.querySelector('.login-btn');
  const btnText = loginBtn.querySelector('.btn-text');
  const btnIcon = loginBtn.querySelector('.btn-icon');
  const btnLoading = loginBtn.querySelector('.btn-loading');
  
  // Show loading state
  btnText.style.display = 'none';
  btnIcon.style.display = 'none';
  btnLoading.style.display = 'flex';
  loginBtn.disabled = true;
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    if (username === validUsername && password === validPassword) {
      // Success animation
      loginBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      btnLoading.innerHTML = '<div class="spinner" style="border-color: rgba(255,255,255,0.3); border-top-color: white;"></div>';
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
      }
      
      setTimeout(() => {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("customerSection").style.display = "block";
        
        // Load existing customers for selection
        loadExistingCustomers();
        renderCustomerList();
        
        // Reset button state
        btnText.style.display = 'inline';
        btnIcon.style.display = 'inline';
        btnLoading.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }, 1000);
    } else {
      // Error state
      loginBtn.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
      btnLoading.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: white; font-size: 1.2rem;"></i>';
      
      setTimeout(() => {
        // Show error message
        showLoginError("Invalid username or password. Please try again.");
        
        // Reset button state
        btnText.style.display = 'inline';
        btnIcon.style.display = 'inline';
        btnLoading.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }, 1000);
    }
  }, 800);
}

// Show login error message
function showLoginError(message) {
  // Remove existing error message
  const existingError = document.querySelector('.login-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'login-error';
  errorDiv.style.cssText = `
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    color: #dc2626;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid #fecaca;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    ${message}
  `;
  
  // Insert error message before the form
  const loginForm = document.querySelector('.login-form');
  loginForm.parentNode.insertBefore(errorDiv, loginForm);
  
  // Auto-remove error message after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => errorDiv.remove(), 300);
    }
  }, 5000);
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const passwordEye = document.getElementById('password-eye');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordEye.className = 'fas fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    passwordEye.className = 'fas fa-eye';
  }
}

// Show forgot password modal
function showForgotPassword() {
  const modal = document.createElement('div');
  modal.className = 'forgot-password-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
  `;
  
  modal.innerHTML = `
    <div class="forgot-password-card" style="
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    ">
      <div style="margin-bottom: 1.5rem;">
        <i class="fas fa-key" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
        <h3 style="color: #0f172a; margin-bottom: 0.5rem;">Reset Password</h3>
        <p style="color: #64748b;">Enter your username to receive reset instructions</p>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <input type="text" id="resetUsername" placeholder="Enter your username" style="
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 1rem;
        ">
        <button onclick="sendResetEmail()" style="
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
        ">Send Reset Link</button>
      </div>
      
      <button onclick="closeForgotPassword()" style="
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        text-decoration: underline;
      ">Back to Login</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Close forgot password modal
function closeForgotPassword() {
  const modal = document.querySelector('.forgot-password-modal');
  if (modal) {
    modal.remove();
  }
}

// Send reset email (demo function)
function sendResetEmail() {
  const username = document.getElementById('resetUsername').value.trim();
  
  if (!username) {
    alert('Please enter your username');
    return;
  }
  
  // Simulate sending reset email
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Sending...';
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = 'Email Sent!';
    button.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    
    setTimeout(() => {
      closeForgotPassword();
      showLoginSuccess('Password reset link sent to your email!');
    }, 1500);
  }, 2000);
}

// Show login success message
function showLoginSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'login-success';
  successDiv.style.cssText = `
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    color: #059669;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid #bbf7d0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  successDiv.innerHTML = `
    <i class="fas fa-check-circle"></i>
    ${message}
  `;
  
  const loginForm = document.querySelector('.login-form');
  loginForm.parentNode.insertBefore(successDiv, loginForm);
  
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => successDiv.remove(), 300);
    }
  }, 5000);
}

// Enhanced form validation
function validateLoginForm() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const usernameError = document.getElementById('username-error');
  const passwordError = document.getElementById('password-error');
  
  let isValid = true;
  
  // Clear previous errors
  usernameError.textContent = '';
  usernameError.classList.remove('show');
  passwordError.textContent = '';
  passwordError.classList.remove('show');
  
  // Validate username
  if (!username) {
    usernameError.textContent = 'Username is required';
    usernameError.classList.add('show');
    isValid = false;
  } else if (username.length < 3) {
    usernameError.textContent = 'Username must be at least 3 characters';
    usernameError.classList.add('show');
    isValid = false;
  }
  
  // Validate password
  if (!password) {
    passwordError.textContent = 'Password is required';
    passwordError.classList.add('show');
    isValid = false;
  } else if (password.length < 4) {
    passwordError.textContent = 'Password must be at least 4 characters';
    passwordError.classList.add('show');
    isValid = false;
  }
  
  return isValid;
}

// --- Add Customer ---
function addCustomerAndContinue() {
  const id = document.getElementById("custId").value.trim();
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const limit = parseFloat(document.getElementById("custLimit").value);
  
  if (!id || !name || !phone || isNaN(limit)) {
    alert("Fill all fields correctly");
    return;
  }

  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  if (customers.find(c => c.id === id)) {
    alert("Customer ID already exists");
    return;
  }

  const newCustomer = {
    id, 
    name, 
    phone, 
    limit, 
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    currentDebt: 0
  };
  
  customers.push(newCustomer);
  localStorage.setItem("customers", JSON.stringify(customers));
  
  // Set as current customer
  currentCustomerId = id;
  currentCustomer = newCustomer;
  
  // Refresh the customer lists
  loadExistingCustomers();
  renderCustomerList();
  
  // Show store section
  document.getElementById("customerSection").style.display = "none";
  document.getElementById("storeSection").style.display = "block";
  loadCustomerDropdown();
  renderCategories();
  
  alert(`Customer ${name} added and selected!`);
}

// --- Load Dropdown ---
function loadCustomerDropdown() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const dropdown = document.getElementById("customerDropdown");
  dropdown.innerHTML = '<option value="">-- Select Customer --</option>';
  customers.forEach(c => {
    dropdown.innerHTML += `<option value="${c.id}">${c.name} (${c.id})</option>`;
  });
}

// --- Show Existing Customers ---
function renderCustomerList() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const list = document.getElementById("customerList");
  
  if (customers.length === 0) {
    list.innerHTML = "<p style='color: #666;'>No customers registered yet.</p>";
    return;
  }
  
  list.innerHTML = `
    <h4>Registered Customers:</h4>
    ${customers.map(c => {
      const overdue = new Date() > new Date(c.dueDate || Date.now());
      return `
        <div style="padding: 10px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 5px; background: ${overdue ? '#fff5f5' : '#f8f9fa'};">
          <strong>${c.name}</strong> (ID: ${c.id})<br>
          Phone: ${c.phone}<br>
          Current Debt: ₹${c.currentDebt} / ₹${c.limit}
          ${overdue ? '<span style="color:red;"> ⚠️ Overdue</span>' : ''}
        </div>
      `;
    }).join("")}
  `;
}

function loadExistingCustomers() {
  // Get customers from localStorage
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  console.log("Found customers:", customers);
  
  // Get the dropdown element
  const dropdown = document.getElementById("existingCustomerDropdown");
  console.log("Dropdown element:", dropdown);
  
  if (!dropdown) {
    console.error("Dropdown not found!");
    return;
  }
  
  // Clear and populate dropdown
  dropdown.innerHTML = '<option value="">-- Select Existing Customer --</option>';
  
  if (customers.length === 0) {
    dropdown.innerHTML += '<option value="" disabled>No customers available</option>';
    console.log("No customers found");
    return;
  }
  
  // Add each customer as an option
  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = `${customer.name} (ID: ${customer.id}) - Debt: ₹${customer.currentDebt}`;
    dropdown.appendChild(option);
    console.log("Added option:", customer.name);
  });
  
  console.log("Dropdown populated successfully");
}

// --- Show Existing Customers ---
function renderCustomerList() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const list = document.getElementById("customerList");
  
  if (customers.length === 0) {
    list.innerHTML = "<p style='color: #666;'>No customers registered yet.</p>";
    return;
  }
  
  list.innerHTML = `
    <h4>Registered Customers:</h4>
    ${customers.map(c => {
      const overdue = new Date() > new Date(c.dueDate || Date.now());
      return `
        <div style="padding: 10px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 5px; background: ${overdue ? '#fff5f5' : '#f8f9fa'};">
          <strong>${c.name}</strong> (ID: ${c.id})<br>
          Phone: ${c.phone}<br>
          Current Debt: ₹${c.currentDebt} / ₹${c.limit}
          ${overdue ? '<span style="color:red;"> ⚠️ Overdue</span>' : ''}
        </div>
      `;
    }).join("")}
  `;
}

function loadExistingCustomers() {
  // Get customers from localStorage
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  console.log("Found customers:", customers);
  
  // Get the dropdown element
  const dropdown = document.getElementById("existingCustomerDropdown");
  console.log("Dropdown element:", dropdown);
  
  if (!dropdown) {
    console.error("Dropdown not found!");
    return;
  }
  
  // Clear and populate dropdown
  dropdown.innerHTML = '<option value="">-- Select Existing Customer --</option>';
  
  if (customers.length === 0) {
    dropdown.innerHTML += '<option value="" disabled>No customers available</option>';
    console.log("No customers found");
    return;
  }
  
  // Add each customer as an option
  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = `${customer.name} (ID: ${customer.id}) - Debt: ₹${customer.currentDebt}`;
    dropdown.appendChild(option);
    console.log("Added option:", customer.name);
  });
  
  console.log("Dropdown populated successfully");
}

function selectExistingCustomer() {
  const dropdown = document.getElementById("existingCustomerDropdown");
  const selectedValue = dropdown.value;
  
  if (!selectedValue) {
    alert("Please select a customer first!");
    return;
  }
  
  // Get the selected customer details
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const selectedCustomer = customers.find(c => c.id === selectedValue);
  
  if (selectedCustomer) {
    currentCustomerId = selectedValue;
    currentCustomer = selectedCustomer;
    
    alert(`Selected: ${selectedCustomer.name} (ID: ${selectedCustomer.id})`);
    
    // Hide customer section and show store
    document.getElementById("customerSection").style.display = "none";
    document.getElementById("storeSection").style.display = "block";
    
    // Update the store dropdown too
    loadCustomerDropdown();
    renderCategories();
  } else {
    alert("Customer not found!");
  }
}

// --- On Selecting Existing Customer ---
function startShopping() {
  const id = document.getElementById("customerDropdown").value;
  if (!id) return;
  currentCustomerId = id;
  document.getElementById("customerSection").style.display = "none";
  document.getElementById("storeSection").style.display = "block";
  renderCategories();
}

// Enhanced Realistic Images for Grocery Store
const storeImages = {
  vegetables: {
    tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop&crop=center",
    potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop&crop=center",
    onion: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop&crop=center",
    carrot: "https://images.unsplash.com/photo-1447175008436-170170d0d43b?w=400&h=300&fit=crop&crop=center",
    cabbage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    beans: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    cauliflower: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    capsicum: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    brinjal: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    sweetCorn: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    cucumber: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    sweetPotato: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    mushroom: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    redBellPepper: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    greenChili: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    bottleGourd: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    ridgeGourd: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    spinach: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    fenugreekLeaves: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    corianderLeaves: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    drumstick: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    tinda: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    pumpkin: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    turnip: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    radish: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    bitterGourd: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    snakeGourd: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    springOnion: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    clusterBeans: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    ivyGourd: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center"
  },
  groceries: {
    rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
    wheatFlour: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    sugar: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
    salt: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
    oil: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    dal: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center"
  },
  poojaItems: {
    agarbatti: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    camphor: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    kumkum: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    oilLamp: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    flowers: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center"
  },
  stationery: {
    notebook: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    pen: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    pencil: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    eraser: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    scale: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center"
  },
  categories: {
    vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center",
    groceries: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
    poojaItems: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center",
    stationery: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center"
  }
};

// Function to get image URL for an item
function getItemImage(category, itemName) {
  const categoryImages = storeImages[category.toLowerCase()];
  
  // Handle special cases for vegetable names
  let imageKey = itemName.toLowerCase().replace(/\s+/g, '');
  
  // Map specific vegetable names to image keys
  const vegetableNameMap = {
    'sweetcorn': 'sweetCorn',
    'sweet potato': 'sweetPotato',
    'red bell pepper': 'redBellPepper',
    'green chili': 'greenChili',
    'bottle gourd': 'bottleGourd',
    'ridge gourd': 'ridgeGourd',
    'fenugreek leaves': 'fenugreekLeaves',
    'coriander leaves': 'corianderLeaves',
    'bitter gourd': 'bitterGourd',
    'snake gourd': 'snakeGourd',
    'spring onion': 'springOnion',
    'cluster beans': 'clusterBeans',
    'ivy gourd': 'ivyGourd'
  };
  
  // Check if we have a mapped name
  if (vegetableNameMap[itemName.toLowerCase()]) {
    imageKey = vegetableNameMap[itemName.toLowerCase()];
  }
  
  if (categoryImages && categoryImages[imageKey]) {
    return categoryImages[imageKey];
  }
  
  // Fallback to category image
  return storeImages.categories[category.toLowerCase()] || storeImages.categories.vegetables;
}

// Function to get category image
function getCategoryImage(categoryName) {
  return storeImages.categories[categoryName.toLowerCase()] || storeImages.categories.vegetables;
}

// Categories are defined in the HTML file
// The categories variable is available globally from the HTML

// --- Persistent Cart ---
let cart = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  cart = stored ? JSON.parse(stored) : [];
  renderCart();
}

function addToCart(item, quantity) {
  quantity = parseFloat(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  
  // Check stock availability
  if (quantity > item.stock) {
    alert(`Sorry! Only ${item.stock} kg available in stock.`);
    return;
  }
  
  const existing = cart.find(i => i.name === item.name);
  if (existing) {
    const newTotalQty = existing.quantity + quantity;
    if (newTotalQty > item.stock) {
      alert(`Sorry! Only ${item.stock} kg available in stock.`);
      return;
    }
    existing.quantity = newTotalQty;
    existing.total = (existing.quantity * item.price).toFixed(2);
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      quantity: quantity,
      total: (quantity * item.price).toFixed(2)
    });
  }
  
  // Reduce stock
  item.stock -= quantity;
  
  saveCart();
  renderCart();
  alert(`${item.name} added to cart! Stock remaining: ${item.stock} kg`);
}

function removeFromCart(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  saveCart();
  renderCart();
}

function updateCartQuantity(itemName, newQuantity) {
  newQuantity = parseFloat(newQuantity);
  if (isNaN(newQuantity) || newQuantity <= 0) return;
  const item = cart.find(i => i.name === itemName);
  if (item) {
    item.quantity = newQuantity;
    item.total = (item.quantity * item.price).toFixed(2);
    saveCart();
    renderCart();
  }
}

// --- Render Category Cards ---
function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = categories.map(cat => `
    <div class="category-card" onclick='renderItems(${JSON.stringify(cat)})'>
      <div class="category-image">
        <img src="${getCategoryImage(cat.name)}" alt="${cat.name}" loading="lazy">
      </div>
      <div class="category-content">
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
      </div>
    </div>
  `).join("");
}

// --- Render Items on Category Click ---
function renderItems(category) {
  const section = document.getElementById("itemsSection");
  if (!category) {
    section.innerHTML = "";
    return;
  }
  section.innerHTML = `
    <h2 style="text-align:center; color:#38b2ac; margin-bottom:1em;">${category.icon} ${category.name}</h2>
    <div class="items-list">
      ${category.items.map((item, index) => {
        const isOutOfStock = item.stock <= 0;
        const isLowStock = item.stock <= 10 && item.stock > 0;
        const itemImage = getItemImage(category.name, item.name);
        return `
          <div class="item-card ${isOutOfStock ? 'out-of-stock' : ''}">
            <div class="item-image">
              <img src="${itemImage}" alt="${item.name}" loading="lazy">
              ${isOutOfStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
            </div>
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-price">₹${item.price}/kg</div>
              <div class="stock-info">
                <span class="stock-amount ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                  Stock: ${item.stock} kg
                  ${isOutOfStock ? '❌ Out of Stock' : isLowStock ? '⚠️ Low Stock' : '✅ In Stock'}
                </span>
              </div>
              <div class="item-actions">
                <div class="quantity-input">
                  <label>Weight (kg): <input type="number" min="0.1" step="0.1" max="${item.stock}" id="qty-${category.name}-${index}" style="width:60px;" ${isOutOfStock ? 'disabled' : ''}></label>
                </div>
                <div class="action-buttons">
                  <button onclick="addToCartFromUI('${category.name}',${index})" ${isOutOfStock ? 'disabled' : ''} class="btn-add-cart">Add to Cart</button>
                  <button onclick="addToKathaFromUI('${category.name}',${index})" ${isOutOfStock ? 'disabled' : ''} class="btn-add-katha">Add to Katha</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// --- Handle Quantity Change and Update ---
function updatePrice(input, pricePerKg, itemName) {
  const qty = parseFloat(input.value);
  if (isNaN(qty) || qty <= 0) return;
  const total = (qty * pricePerKg).toFixed(2);

  const customer = JSON.parse(localStorage.getItem("customers")).find(c => c.id === currentCustomerId);
  if (!customer) return alert("Customer not found");

  const newDebt = customer.currentDebt + parseFloat(total);
  if (newDebt > customer.limit) return alert("Credit limit exceeded");

  customer.currentDebt = newDebt;
  const customers = JSON.parse(localStorage.getItem("customers"));
  const updated = customers.map(c => c.id === customer.id ? customer : c);
  localStorage.setItem("customers", JSON.stringify(updated));
  renderCustomerList();

  const container = input.closest(".item-card");
  container.querySelector(".calculated-price").textContent = `Total: ₹${total}`;

  const existing = bill.find(b => b.name === itemName);
  if (existing) existing.total = total;
  else bill.push({ name: itemName, total });

  renderBill();
}

// --- Show Bill Summary ---
function renderBill() {
  const section = document.getElementById("billSection");
  section.style.display = bill.length ? "block" : "none";
  const totalAmount = bill.reduce((sum, b) => sum + parseFloat(b.total), 0);
  section.innerHTML = `
    <h3>Token Bill</h3>
    ${bill.map(b => `<div class="bill-item"><span>${b.name}</span><span>₹${b.total}</span></div>`).join("")}
    <div class="bill-total">Total: ₹${totalAmount.toFixed(2)}</div>
  `;
}

// --- Render Functions ---
// Note: renderCategories function is already defined above

// Note: renderItems function is already defined above

window.addToCartFromUI = function(categoryName, index) {
  const cat = categories.find(c => c.name === categoryName);
  const item = cat.items[index];
  const qtyInput = document.getElementById(`qty-${categoryName}-${index}`);
  addToCart(item, qtyInput.value);
  qtyInput.value = "";
};

function renderCart() {
  const section = document.getElementById("cartSection");
  if (!section) return;
  if (cart.length === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";
  let totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);

  section.innerHTML = `
    <button id="printBillBtn" style="float:right; margin-bottom:10px;">🖨️ Print/Download Bill</button>
    <h3>🛒 Your Cart</h3>
    ${cart.map(item => `
      <div class="bill-item">
        <span>${item.name} 
          (<input type="number" min="0.1" step="0.1" value="${item.quantity}" style="width:50px;" onchange="updateCartQuantityUI('${item.name}', this.value)"> kg)
        </span>
        <span>₹${item.total} 
          <button onclick="removeFromCartUI('${item.name}')" style="color:red; background:none; border:none; cursor:pointer;">✖</button>
        </span>
      </div>
    `).join("")}
    <div class="bill-total">
      Total: ₹${totalAmount.toFixed(2)}
    </div>
  `;

  // Add print handler
  document.getElementById("printBillBtn").onclick = function() {
    printBill();
  };
}

function printBill() {
  const printContents = document.getElementById("cartSection").innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = `
    <div style="max-width:500px;margin:40px auto;font-family:Inter,sans-serif;">
      <h2 style="text-align:center;color:#2563eb;">Smart General Store</h2>
      ${printContents}
      <p style="text-align:center;margin-top:2em;">Thank you for shopping!</p>
    </div>
  `;
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // reload to restore event listeners
}

window.removeFromCartUI = function(itemName) {
  removeFromCart(itemName);
};
window.updateCartQuantityUI = function(itemName, newQty) {
  updateCartQuantity(itemName, newQty);
};

// Show cart when clicking "View Cart"
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("viewCart").onclick = function(e) {
    e.preventDefault();
    renderCart();
    document.getElementById("cartSection").scrollIntoView({ behavior: "smooth" });
  };
  document.getElementById("viewKatha").onclick = function(e) {
    e.preventDefault();
    showKathaSection();
  };
  document.getElementById("addCustomer").onclick = function(e) {
    e.preventDefault();
    addCustomer();
  };
  // Add this line for stock management
  document.getElementById("stockManagement").onclick = function(e) {
    e.preventDefault();
    showStockManagement();
  };
  
  // Add login button functionality
  document.getElementById("showLogin").onclick = function(e) {
    e.preventDefault();
    showLoginSection();
  };
  
  loadCart();
  
  // Load saved credentials if remember me was checked
  loadSavedCredentials();
});

// Load saved credentials
function loadSavedCredentials() {
  const rememberMe = localStorage.getItem('rememberMe');
  const savedUsername = localStorage.getItem('savedUsername');
  
  if (rememberMe === 'true' && savedUsername) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('rememberMe').checked = true;
  }
}

// Show login section
function showLoginSection() {
  // Hide all other sections
  const sections = ['customerSection', 'storeSection'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  });
  
  // Show login section
  document.getElementById('loginSection').style.display = 'block';
  
  // Focus on username field
  setTimeout(() => {
    const usernameField = document.getElementById('username');
    if (usernameField) {
      usernameField.focus();
    }
  }, 100);
}

// --- Katha System Functions ---
function addCustomer() {
  const name = prompt("Enter customer name:");
  if (!name) return;
  const phone = prompt("Enter phone number:");
  const creditLimit = parseFloat(prompt("Enter credit limit (₹):") || "1000");
  const customer = {
    id: Date.now(),
    name,
    phone,
    creditLimit,
    currentDebt: 0
  };
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
  alert(`Customer ${name} added!`);
  showKathaSection();
}

function selectCustomer() {
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  if (customers.length === 0) {
    alert("No customers registered. Please add a customer first.");
    return;
  }
  
  const options = customers.map(c => `${c.id} - ${c.name} (Debt: ₹${c.currentDebt})`).join('\n');
  const selected = prompt(`Select Customer:\n${options}`);
  if (!selected) return;
  
  const customerId = parseInt(selected.split(' - ')[0]);
  currentCustomer = customers.find(c => c.id === customerId);
  
  if (currentCustomer) {
    alert(`Selected: ${currentCustomer.name}`);
    showKathaSection(); // Refresh the Katha section
  }
}

function addToKatha(item, quantity) {
  if (!currentCustomer) {
    alert("Please select a customer first (from Katha menu)!");
    return;
  }
  quantity = parseFloat(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  
  // Check stock availability
  if (quantity > item.stock) {
    alert(`Sorry! Only ${item.stock} kg available in stock.`);
    return;
  }
  
  const totalAmount = item.price * quantity;
  const newDebt = currentCustomer.currentDebt + totalAmount;
  if (newDebt > currentCustomer.creditLimit) {
    alert(`Credit limit exceeded! Current debt: ₹${currentCustomer.currentDebt}, Limit: ₹${currentCustomer.creditLimit}`);
    return;
  }
  
  // Add to katha records
  const kathaRecord = {
    id: Date.now(),
    customerId: currentCustomer.id,
    customerName: currentCustomer.name,
    itemName: item.name,
    quantity,
    price: item.price,
    totalAmount,
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  };
  kathaRecords.push(kathaRecord);
  
  // Update customer debt
  currentCustomer.currentDebt = newDebt;
  customers = customers.map(c => c.id === currentCustomer.id ? currentCustomer : c);
  
  // Reduce stock
  item.stock -= quantity;
  
  // Save to localStorage
  localStorage.setItem('kathaRecords', JSON.stringify(kathaRecords));
  localStorage.setItem('customers', JSON.stringify(customers));
  alert(`Added to Katha: ${item.name} x${quantity} = ₹${totalAmount}\nCustomer: ${currentCustomer.name}\nStock remaining: ${item.stock} kg`);
}

function showKathaSection() {
  document.getElementById('categoryGrid').style.display = 'none';
  document.getElementById('itemsSection').style.display = 'none';
  document.getElementById('cartSection').style.display = 'none';
  document.getElementById('kathaSection').style.display = 'block';

  const overdueRecords = kathaRecords.filter(record =>
    new Date(record.dueDate) < new Date() && record.status === 'pending'
  );

  let kathaHTML = `
    <div>
      <h2>📋 Katha Management</h2>
      <button onclick="selectCustomer()" class="btn-primary">Select Customer</button>
      <button onclick="addCustomer()" class="btn-secondary">Add New Customer</button>
    </div>
  `;

  if (currentCustomer) {
    kathaHTML += `
      <div>
        <h3>Current Customer: ${currentCustomer.name}</h3>
        <p>Current Debt: ₹${currentCustomer.currentDebt} / ₹${currentCustomer.creditLimit}</p>
        <p>Phone: ${currentCustomer.phone}</p>
      </div>
    `;
  }

  if (overdueRecords.length > 0) {
    kathaHTML += `
      <div>
        <h3>⚠️ Overdue Payments (${overdueRecords.length})</h3>
        ${overdueRecords.map(record => `
          <div>
            <strong>${record.customerName}</strong> - ${record.itemName} (₹${record.totalAmount})
            <br>Due: ${new Date(record.dueDate).toLocaleDateString()}
            <button onclick="markAsPaid(${record.id})">Mark Paid</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  kathaHTML += `
    <div>
      <h3>Recent Katha Records</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${kathaRecords.slice(-10).reverse().map(record => `
            <tr>
              <td>${new Date(record.date).toLocaleDateString()}</td>
              <td>${record.customerName}</td>
              <td>${record.itemName}</td>
              <td>₹${record.totalAmount}</td>
              <td>${new Date(record.dueDate).toLocaleDateString()}</td>
              <td>${record.status}</td>
              <td>
                ${record.status === 'pending' ? 
                  `<button onclick="markAsPaid(${record.id})">Pay</button>` : 
                  'Paid'
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <button onclick="showMainSection()">Back to Shopping</button>
  `;

  document.getElementById('kathaSection').innerHTML = kathaHTML;
}

function markAsPaid(recordId) {
  const record = kathaRecords.find(r => r.id === recordId);
  if (!record) return;
  record.status = 'paid';
  // Update customer debt
  const customer = customers.find(c => c.id === record.customerId);
  if (customer) {
    customer.currentDebt = Math.max(0, customer.currentDebt - record.totalAmount);
  }
  localStorage.setItem('kathaRecords', JSON.stringify(kathaRecords));
  localStorage.setItem('customers', JSON.stringify(customers));
  alert(`Payment recorded!`);
  showKathaSection();
}

function showMainSection() {
  document.getElementById('categoryGrid').style.display = 'grid';
  document.getElementById('itemsSection').style.display = 'block';
  document.getElementById('cartSection').style.display = 'block';
  document.getElementById('kathaSection').style.display = 'none';
}

window.addToKathaFromUI = function(categoryName, index) {
  const cat = categories.find(c => c.name === categoryName);
  const item = cat.items[index];
  const qtyInput = document.getElementById(`qty-${categoryName}-${index}`);
  addToKatha(item, qtyInput.value);
  qtyInput.value = "";
};

function addStock(itemName, quantity) {
  let found = false;
  categories.forEach(category => {
    category.items.forEach(item => {
      if (item.name === itemName) {
        item.stock += parseFloat(quantity);
        found = true;
      }
    });
  });
  if (found) {
    alert(`Stock updated for ${itemName}. New stock: ${item.stock} kg`);
    renderItems(currentCategory); // Re-render if a category is currently displayed
  } else {
    alert("Item not found!");
  }
}

function showStockManagement() {
  let stockHTML = `
    <div class="bill-section">
      <h2>📋 Stock Management</h2>
      <div style="margin-bottom: 20px;">
        <input type="text" id="stockItemName" placeholder="Item Name" style="width: 200px;">
        <input type="number" id="stockQuantity" placeholder="Quantity to Add" style="width: 150px;">
        <button onclick="addStockFromUI()">Add Stock</button>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Stock (kg)</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(category => 
            category.items.map(item => {
              const isOutOfStock = item.stock <= 0;
              const isLowStock = item.stock <= 10 && item.stock > 0;
              return `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${category.name}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; ${isOutOfStock ? 'color: red;' : isLowStock ? 'color: orange;' : ''}">${item.stock}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">
                    ${isOutOfStock ? '❌ Out of Stock' : isLowStock ? '⚠️ Low Stock' : '✅ In Stock'}
                  </td>
                </tr>
              `;
            }).join('')
          ).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = stockHTML;
}

window.addStockFromUI = function() {
  const itemName = document.getElementById("stockItemName").value.trim();
  const quantity = parseFloat(document.getElementById("stockQuantity").value);
  if (!itemName || isNaN(quantity) || quantity <= 0) {
    alert("Please enter valid item name and quantity!");
    return;
  }
  addStock(itemName, quantity);
  document.getElementById("stockItemName").value = "";
  document.getElementById("stockQuantity").value = "";
};

function selectCustomerById() {
  const customerId = document.getElementById("manualCustomerId").value.trim();
  if (!customerId) {
    alert("Please enter a customer ID!");
    return;
  }
  
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const selectedCustomer = customers.find(c => c.id === customerId);
  
  if (selectedCustomer) {
    currentCustomerId = customerId;
    currentCustomer = selectedCustomer;
    
    alert(`Selected: ${selectedCustomer.name} (ID: ${selectedCustomer.id})`);
    
    // Hide customer section and show store
    document.getElementById("customerSection").style.display = "none";
    document.getElementById("storeSection").style.display = "block";
    
    // Update the store dropdown too
    loadCustomerDropdown();
    renderCategories();
  } else {
    alert("Customer not found! Please check the ID.");
  }
}

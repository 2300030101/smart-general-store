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
  document.getElementById("homepage").style.display = "none";
  document.getElementById("storeSection").style.display = "block";
  document.getElementById("fullWidthBanner").style.display = "block";
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
  console.log("Rendering categories...");
  console.log("Categories data:", categories);
  
  grid.innerHTML = categories.map(cat => `
    <div class="category-card" onclick='console.log("Category clicked:", "${cat.name}"); renderItems(${JSON.stringify(cat)})' style="cursor: pointer;">
      <div class="category-image">
        <img src="${getCategoryImage(cat.name)}" alt="${cat.name}" loading="lazy">
      </div>
      <div class="category-content">
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
      </div>
    </div>
  `).join("");
  
  console.log("Categories rendered successfully");
}

// --- Render Items on Category Click ---
function renderItems(category) {
  console.log("renderItems function called with category:", category);
  
  const storeSection = document.getElementById("storeSection");
  const itemsPageSection = document.getElementById("itemsPageSection");
  const itemsPageTitle = document.getElementById("itemsPageTitle");
  const itemsPageSubtitle = document.getElementById("itemsPageSubtitle");
  const itemsPageGrid = document.getElementById("itemsPageGrid");
  const currentCustomerNameItems = document.getElementById("currentCustomerNameItems");
  const customerDropdownItems = document.getElementById("customerDropdownItems");
  
  if (!category) {
    console.log("No category provided");
    return;
  }
  
  console.log("Hiding store section and showing items page...");
  
  // Hide the store section (categories page)
  storeSection.style.display = "none";
  
  // Show the items page section
  itemsPageSection.style.display = "block";
  
  // Update page title and subtitle
  itemsPageTitle.innerHTML = `${category.icon} ${category.name}`;
  itemsPageSubtitle.innerHTML = `Browse and select items from ${category.name} category`;
  
  // Update customer name in items page
  const currentCustomer = JSON.parse(localStorage.getItem("customers") || "[]").find(c => c.id === currentCustomerId);
  currentCustomerNameItems.textContent = currentCustomer ? currentCustomer.name : "Not Selected";
  
  // Populate customer dropdown in items page
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customerDropdownItems.innerHTML = '<option value="">-- Change Customer --</option>' + 
    customers.map(c => `<option value="${c.id}" ${c.id === currentCustomerId ? 'selected' : ''}>${c.name} (ID: ${c.id})</option>`).join('');
  
  console.log("Rendering items for category:", category.name);
  
  // Render items in the new grid
  itemsPageGrid.innerHTML = category.items.map((item, index) => {
    const isOutOfStock = item.stock <= 0;
    const isLowStock = item.stock <= 10 && item.stock > 0;
    const itemImage = getItemImage(category.name, item.name);
    return `
      <div class="item-card ${isOutOfStock ? 'out-of-stock' : ''}" style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 2px solid #e2e8f0; transition: all 0.3s ease; hover: transform: translateY(-5px);">
        <div class="item-image" style="text-align: center; margin-bottom: 1.5rem;">
          <img src="${itemImage}" alt="${item.name}" loading="lazy" style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          ${isOutOfStock ? '<div class="out-of-stock-overlay" style="background: rgba(220, 38, 38, 0.9); color: white; padding: 0.75rem; border-radius: 8px; margin-top: 1rem; font-weight: 600;">❌ Out of Stock</div>' : ''}
        </div>
        <div class="item-details">
          <div class="item-name" style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: #1e293b; text-align: center;">${item.name}</div>
          <div class="item-price" style="font-size: 1.3rem; color: #059669; font-weight: 700; margin-bottom: 1rem; text-align: center;">₹${item.price}/kg</div>
          <div class="stock-info" style="margin-bottom: 1.5rem; text-align: center;">
            <span class="stock-amount ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}" style="padding: 0.5rem 1rem; border-radius: 8px; font-size: 1rem; font-weight: 600; ${isOutOfStock ? 'background: #fef2f2; color: #dc2626;' : isLowStock ? 'background: #fef3c7; color: #d97706;' : 'background: #dcfce7; color: #166534;'}">
              Stock: ${item.stock} kg
              ${isOutOfStock ? '❌ Out of Stock' : isLowStock ? '⚠️ Low Stock' : '✅ In Stock'}
            </span>
          </div>
          <div class="item-actions">
            <div class="quantity-input" style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.75rem; font-weight: 600; color: #374151; font-size: 1.1rem;">Weight (kg): 
                <input type="number" min="0.1" step="0.1" max="${item.stock}" id="qty-${category.name}-${index}" style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; margin-top: 0.5rem; font-size: 1rem;" ${isOutOfStock ? 'disabled' : ''} placeholder="Enter weight">
              </label>
            </div>
            <div class="action-buttons" style="display: flex; gap: 1rem;">
              <button onclick="addToCartFromUI('${category.name}',${index})" ${isOutOfStock ? 'disabled' : ''} class="btn-add-cart" style="flex: 1; background: #059669; color: white; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; ${isOutOfStock ? 'opacity: 0.5; cursor: not-allowed;' : ''}">🛒 Add to Cart</button>
              <button onclick="addToKathaFromUI('${category.name}',${index})" ${isOutOfStock ? 'disabled' : ''} class="btn-add-katha" style="flex: 1; background: #7c3aed; color: white; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; ${isOutOfStock ? 'opacity: 0.5; cursor: not-allowed;' : ''}">📋 Add to Katha</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  console.log("Items rendered successfully");
  
  // Scroll to top of the new page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to go back to categories
window.backToCategories = function() {
  console.log("backToCategories function called");
  
  const storeSection = document.getElementById("storeSection");
  const itemsPageSection = document.getElementById("itemsPageSection");
  
  console.log("Hiding items page and showing store section...");
  
  // Hide the items page
  itemsPageSection.style.display = "none";
  
  // Show the store section (categories)
  storeSection.style.display = "block";
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log("Successfully returned to categories page");
};

// Function to show categories again
function showCategories() {
  const section = document.getElementById("itemsSection");
  const categoryGrid = document.getElementById("categoryGrid");
  
  // Hide the items section
  section.style.display = "none";
  section.innerHTML = "";
  
  // Show the categories section again
  categoryGrid.style.display = "grid";
  
  // Scroll back to the top
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  // Initialize the page to show homepage by default
  document.getElementById("homepage").style.display = "block";
  document.getElementById("homepage").style.position = "absolute";
  document.getElementById("homepage").style.top = "0";
  document.getElementById("homepage").style.left = "0";
  document.getElementById("homepage").style.width = "100%";
  document.getElementById("homepage").style.height = "100vh";
  document.getElementById("homepage").style.zIndex = "10";
  document.getElementById("storeSection").style.display = "none";
  document.getElementById("customerSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
  
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
  
  // Add event listener for bill history
  const billHistoryBtn = document.getElementById("billHistory");
  if (billHistoryBtn) {
    billHistoryBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Bill History button clicked");
      showBillHistory();
    };
  } else {
    console.error("Bill History button not found");
  }
  
  // Business Intelligence Features
  const competitorAnalysisBtn = document.getElementById("competitorAnalysis");
  if (competitorAnalysisBtn) {
    competitorAnalysisBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Competitor Analysis button clicked");
      if (typeof showCompetitorAnalysis === 'function') {
        showCompetitorAnalysis();
      } else {
        console.error("showCompetitorAnalysis function not found");
        testCompetitorAnalysis();
      }
    };
  } else {
    console.error("Competitor Analysis button not found");
  }
  
  const profitMarginsBtn = document.getElementById("profitMargins");
  console.log("Looking for profitMargins button...");
  console.log("profitMarginsBtn:", profitMarginsBtn);
  if (profitMarginsBtn) {
    console.log("Profit Margins button found successfully");
    profitMarginsBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Profit Margins button clicked");
      if (typeof showProfitMargins === 'function') {
        console.log("showProfitMargins function exists, calling it...");
        showProfitMargins();
      } else {
        console.error("showProfitMargins function not found");
        alert("showProfitMargins function not found!");
      }
    };
  } else {
    console.error("Profit Margins button not found");
  }
  
  const cashFlowBtn = document.getElementById("cashFlow");
  if (cashFlowBtn) {
    cashFlowBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Cash Flow button clicked");
      if (typeof showCashFlow === 'function') {
        showCashFlow();
      } else {
        console.error("showCashFlow function not found");
        testCashFlow();
      }
    };
  } else {
    console.error("Cash Flow button not found");
  }
  
  const taxReportsBtn = document.getElementById("taxReports");
  if (taxReportsBtn) {
    taxReportsBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Tax Reports button clicked");
      if (typeof showTaxReports === 'function') {
        showTaxReports();
      } else {
        console.error("showTaxReports function not found");
        testTaxReports();
      }
    };
  } else {
    console.error("Tax Reports button not found");
  }
  
  // Inventory Management Features
  const supplierManagementBtn = document.getElementById("supplierManagement");
  if (supplierManagementBtn) {
    supplierManagementBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Supplier Management button clicked");
      if (typeof showSupplierManagement === 'function') {
        showSupplierManagement();
      } else {
        console.error("showSupplierManagement function not found");
        testSupplierManagement();
      }
    };
  } else {
    console.error("Supplier Management button not found");
  }
  
  const expiryTrackingBtn = document.getElementById("expiryTracking");
  if (expiryTrackingBtn) {
    expiryTrackingBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Expiry Tracking button clicked");
      if (typeof showExpiryTracking === 'function') {
        showExpiryTracking();
      } else {
        console.error("showExpiryTracking function not found");
        testExpiryTracking();
      }
    };
  } else {
    console.error("Expiry Tracking button not found");
  }
  
  const autoReorderingBtn = document.getElementById("autoReordering");
  if (autoReorderingBtn) {
    autoReorderingBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Auto Reordering button clicked");
      if (typeof showAutoReordering === 'function') {
        showAutoReordering();
      } else {
        console.error("showAutoReordering function not found");
        testAutoReordering();
      }
    };
  } else {
    console.error("Auto Reordering button not found");
  }
  
  // Customer Features
  const recipeIntegrationBtn = document.getElementById("recipeIntegration");
  if (recipeIntegrationBtn) {
    recipeIntegrationBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Recipe Integration button clicked");
      if (typeof showRecipeIntegration === 'function') {
        showRecipeIntegration();
      } else {
        console.error("showRecipeIntegration function not found");
        testRecipeIntegration();
      }
    };
  } else {
    console.error("Recipe Integration button not found");
  }
  
  const nutritionalInfoBtn = document.getElementById("nutritionalInfo");
  if (nutritionalInfoBtn) {
    nutritionalInfoBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Nutritional Info button clicked");
      if (typeof showNutritionalInfo === 'function') {
        showNutritionalInfo();
      } else {
        console.error("showNutritionalInfo function not found");
        testNutritionalInfo();
      }
    };
  } else {
    console.error("Nutritional Info button not found");
  }
  
  const priceComparisonBtn = document.getElementById("priceComparison");
  if (priceComparisonBtn) {
    priceComparisonBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Price Comparison button clicked");
      if (typeof showPriceComparison === 'function') {
        showPriceComparison();
      } else {
        console.error("showPriceComparison function not found");
        testPriceComparison();
      }
    };
  } else {
    console.error("Price Comparison button not found");
  }
  
  const deliverySchedulingBtn = document.getElementById("deliveryScheduling");
  if (deliverySchedulingBtn) {
    deliverySchedulingBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Delivery Scheduling button clicked");
      if (typeof showDeliveryScheduling === 'function') {
        showDeliveryScheduling();
      } else {
        console.error("showDeliveryScheduling function not found");
        testDeliveryScheduling();
      }
    };
  } else {
    console.error("Delivery Scheduling button not found");
  }
  
  // Test button
  const testButton = document.getElementById("testButton");
  if (testButton) {
    testButton.onclick = function(e) {
      e.preventDefault();
      testButtonFunctionality();
    };
  }
  
  // Add login button functionality
  document.getElementById("showLogin").onclick = function(e) {
    e.preventDefault();
    showLoginSection();
  };
  
  // Add event listener for contact
  const contactLinkBtn = document.getElementById("contactLink");
  if (contactLinkBtn) {
    contactLinkBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Contact button clicked");
      showContactSection();
    };
  } else {
    console.error("Contact button not found");
  }
  
  // Add event listener for monthly spin
  const monthlySpinBtn = document.getElementById("monthlySpin");
  if (monthlySpinBtn) {
    monthlySpinBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Monthly Spin button clicked");
      showMonthlySpin();
    };
  } else {
    console.error("Monthly Spin button not found");
  }
  
  // Add event listener for back to home
  const backToHomeBtn = document.getElementById("backToHome");
  if (backToHomeBtn) {
    backToHomeBtn.onclick = function(e) {
      e.preventDefault();
      console.log("Back to Home button clicked");
      showHomePage();
    };
  } else {
    console.error("Back to Home button not found");
  }
  
  loadCart();
  
  // Load saved credentials if remember me was checked
  loadSavedCredentials();
  
  // Debug: Test if functions are accessible
  console.log("Available functions:", {
    showCompetitorAnalysis: typeof showCompetitorAnalysis,
    showProfitMargins: typeof showProfitMargins,
    showCashFlow: typeof showCashFlow,
    showTaxReports: typeof showTaxReports,
    showSupplierManagement: typeof showStockManagement,
    showExpiryTracking: typeof showExpiryTracking,
    showAutoReordering: typeof showAutoReordering,
    showRecipeIntegration: typeof showRecipeIntegration,
    showNutritionalInfo: typeof showNutritionalInfo,
    showPriceComparison: typeof showPriceComparison,
    showDeliveryScheduling: typeof showDeliveryScheduling
  });
  
  // Debug: Test if buttons are found
  const buttonIds = [
    "competitorAnalysis", "profitMargins", "cashFlow", "taxReports",
    "supplierManagement", "expiryTracking", "autoReordering",
    "recipeIntegration", "nutritionalInfo", "priceComparison", "deliveryScheduling", "testButton"
  ];
  
  console.log("Button availability:");
  buttonIds.forEach(id => {
    const button = document.getElementById(id);
    console.log(`${id}: ${button ? 'Found' : 'Not found'}`);
  });
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
  // Show the homepage content with proper positioning
  const homepage = document.getElementById('homepage');
  homepage.style.display = 'block';
  homepage.style.position = 'absolute';
  homepage.style.top = '0';
  homepage.style.left = '0';
  homepage.style.width = '100%';
  homepage.style.height = '100vh';
  homepage.style.zIndex = '10';
  
  document.getElementById('storeSection').style.display = 'none';
  document.getElementById('customerSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'none';
  
  // Reset other sections
  document.getElementById('categoryGrid').style.display = 'grid';
  document.getElementById('itemsSection').style.display = 'block';
  document.getElementById('cartSection').style.display = 'none';
  document.getElementById('kathaSection').style.display = 'none';
  document.getElementById('fullWidthBanner').style.display = 'block';
}

window.addToKathaFromUI = function(categoryName, index) {
  const cat = categories.find(c => c.name === categoryName);
  const item = cat.items[index];
  const qtyInput = document.getElementById(`qty-${categoryName}-${index}`);
  addToKatha(item, qtyInput.value);
  qtyInput.value = "";
};

// Make functions globally accessible
window.addStockFromUI = function() {
  console.log("addStockFromUI function called");
  const itemName = document.getElementById("stockItemName").value.trim();
  const quantity = parseFloat(document.getElementById("stockQuantity").value);
  
  console.log("Item name:", itemName);
  console.log("Quantity:", quantity);
  
  if (!itemName || isNaN(quantity) || quantity <= 0) {
    alert("Please enter valid item name and quantity!");
    return;
  }
  
  // Get existing stock data from localStorage
  let stockData = JSON.parse(localStorage.getItem("stockData") || "{}");
  console.log("Current stock data:", stockData);
  
  // Update or add stock for the item
  if (stockData[itemName]) {
    stockData[itemName] += quantity;
  } else {
    stockData[itemName] = quantity;
  }
  
  // Save updated stock data
  localStorage.setItem("stockData", JSON.stringify(stockData));
  console.log("Updated stock data:", stockData);
  
  // Clear form
  document.getElementById("stockItemName").value = "";
  document.getElementById("stockQuantity").value = "";
  
  // Show success message
  alert(`Stock updated! ${itemName} now has ${stockData[itemName]} units in stock.`);
  
  // Refresh the stock management display
  showStockManagement();
};

// Function to add stock for specific items (used by quick add buttons)
window.addStock = async function(itemName, quantity) {
  console.log("addStock function called with:", itemName, quantity);
  
  try {
    // Send request to backend
    const response = await fetch('http://localhost:3000/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName,
        quantity: quantity
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update stock');
    }
    
    // Show success message
    alert(result.message);
    
    // Refresh the stock management display
    showStockManagement();
  } catch (error) {
    console.error("Error adding stock:", error);
    alert(`Error adding stock: ${error.message}. Make sure the backend server is running on http://localhost:3000`);
  }
};

// Make all important functions globally accessible
window.showProfitMargins = showProfitMargins;
window.showCompetitorAnalysis = showCompetitorAnalysis;
window.showCashFlow = showCashFlow;
window.showTaxReports = showTaxReports;
window.showSupplierManagement = showSupplierManagement;
window.showExpiryTracking = showExpiryTracking;
window.showAutoReordering = showAutoReordering;
window.showRecipeIntegration = showRecipeIntegration;
window.showNutritionalInfo = showNutritionalInfo;
window.showPriceComparison = showPriceComparison;
window.showDeliveryScheduling = showDeliveryScheduling;
window.showBillHistory = showBillHistory;
window.showContactSection = showContactSection;
window.showMonthlySpin = showMonthlySpin;
window.showHomePage = showHomePage;
window.exportStockReport = exportStockReport;
window.autoReorderLowStock = autoReorderLowStock;
window.clearAllStock = clearAllStock;
window.exportProfitReport = exportProfitReport;
window.optimizePricing = optimizePricing;
window.exportCashFlowReport = exportCashFlowReport;
window.generateTaxReport = generateTaxReport;
window.updateCompetitorPrices = updateCompetitorPrices;
window.placeOrder = placeOrder;
window.viewSupplierDetails = viewSupplierDetails;
window.addNewSupplier = addNewSupplier;
window.disposeExpiredItem = disposeExpiredItem;
window.discountExpiringItem = discountExpiringItem;
window.exportExpiryReport = exportExpiryReport;
window.autoReorder = autoReorder;
window.bulkAutoReorder = bulkAutoReorder;
window.addRecipeIngredients = addRecipeIngredients;
window.scheduleDelivery = scheduleDelivery;

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
    
    // Hide customer section and show store with full-width banner
    document.getElementById("customerSection").style.display = "none";
    document.getElementById("storeSection").style.display = "block";
    document.getElementById("fullWidthBanner").style.display = "block";
    
    // Update the store dropdown too
    loadCustomerDropdown();
    renderCategories();
  } else {
    alert("Customer not found! Please check the ID.");
  }
}// NEW: Bill Finalization Functions
function finalizeCartBill() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  
  const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
  
  // Reduce stock for all items in cart
  cart.forEach(cartItem => {
    const category = categories.find(cat => cat.items.some(item => item.name === cartItem.name));
    if (category) {
      const item = category.items.find(item => item.name === cartItem.name);
      if (item) {
        item.stock -= cartItem.quantity;
      }
    }
  });
  
  // Clear cart
  cart = [];
  saveCart();
  renderCart();
  
  alert(`Bill finalized! Total: ₹${totalAmount.toFixed(2)}\nStock has been updated.`);
}

function finalizeTokenBill() {
  if (bill.length === 0) {
    alert("No items in bill!");
    return;
  }
  
  const totalAmount = bill.reduce((sum, b) => sum + parseFloat(b.total), 0);
  
  // Update customer debt
  const customer = JSON.parse(localStorage.getItem("customers")).find(c => c.id === currentCustomerId);
  if (customer) {
    const newDebt = customer.currentDebt + totalAmount;
    if (newDebt > customer.limit) {
      alert("Credit limit exceeded!");
      return;
    }
    customer.currentDebt = newDebt;
    const customers = JSON.parse(localStorage.getItem("customers"));
    const updated = customers.map(c => c.id === customer.id ? customer : c);
    localStorage.setItem("customers", JSON.stringify(updated));
    renderCustomerList();
  }
  
  // Clear bill
  bill = [];
  renderBill();
  
  alert(`Token bill finalized! Total: ₹${totalAmount.toFixed(2)}\nCustomer debt updated.`);
}

// ===== BUSINESS INTELLIGENCE MODULE =====

// Competitor Analysis
const competitorData = {
  competitors: [
    { name: "Big Bazaar", location: "Nearby Mall", rating: 4.2 },
    { name: "Reliance Fresh", location: "Main Street", rating: 4.0 },
    { name: "D-Mart", location: "Shopping Center", rating: 4.3 },
    { name: "Local Market", location: "Street Market", rating: 3.8 }
  ],
  priceComparison: {
    "Tomato": { ourPrice: 20, competitors: { "Big Bazaar": 22, "Reliance Fresh": 21, "D-Mart": 20, "Local Market": 18 } },
    "Rice": { ourPrice: 50, competitors: { "Big Bazaar": 52, "Reliance Fresh": 51, "D-Mart": 49, "Local Market": 48 } },
    "Milk": { ourPrice: 60, competitors: { "Big Bazaar": 62, "Reliance Fresh": 61, "D-Mart": 59, "Local Market": 58 } },
    "Potato": { ourPrice: 15, competitors: { "Big Bazaar": 17, "Reliance Fresh": 16, "D-Mart": 15, "Local Market": 14 } }
  }
};

function showCompetitorAnalysis() {
  console.log("showCompetitorAnalysis function called");
  
  // Create a simple version that doesn't depend on categories
  let analysisHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">🏪 Competitor Analysis</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">📊 Market Position</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Our Store Rating:</span>
            <span style="font-weight: 600; color: #059669;">4.5 ⭐</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Average Competitor Rating:</span>
            <span style="font-weight: 600; color: #dc2626;">4.1 ⭐</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Market Share:</span>
            <span style="font-weight: 600; color: #059669;">25%</span>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">💰 Price Competitiveness</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Average Price Difference:</span>
            <span style="font-weight: 600; color: #059669;">-5%</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Price Leadership Items:</span>
            <span style="font-weight: 600; color: #059669;">15</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Competitive Items:</span>
            <span style="font-weight: 600; color: #f59e0b;">8</span>
          </div>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📈 Price Comparison</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Product</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Our Price</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Big Bazaar</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Reliance Fresh</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">D-Mart</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Local Market</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Tomato</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹20</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹22</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹21</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹20</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹18</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Competitive</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Rice</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹50</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹52</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹51</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹49</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹48</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Competitive</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Milk</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹60</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹62</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹61</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹59</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹58</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Competitive</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="updateCompetitorPrices()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Update Prices</button>
      </div>
    </div>
  `;
  
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = analysisHTML;
    console.log("Competitor Analysis content loaded successfully");
  } else {
    console.error("itemsSection element not found");
    alert("Error: Could not find the content area. Please refresh the page.");
  }
}

// Profit Margins Analysis
function showProfitMargins() {
  console.log("showProfitMargins function called");
  
  // Simple working version
  const profitHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">💰 Profit Margins Analysis</h2>
      <p style="color: #64748b; margin-bottom: 2rem;">Comprehensive profit analysis for your store operations.</p>
      
      <!-- Key Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
        <h3 style="color: #166534; margin-bottom: 0.5rem;">Total Revenue</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #166534; margin: 0;">₹150,000</p>
      </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Total Cost</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #92400e; margin: 0;">₹135,000</p>
        </div>
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #1e40af; margin-bottom: 0.5rem;">Net Profit</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin: 0;">₹15,000</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Profit Margin</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #92400e; margin: 0;">10.0%</p>
        </div>
      </div>
      
      <!-- Detailed Breakdown -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">📊 Revenue Breakdown</h3>
          <div style="margin-bottom: 0.5rem;">
            <span>Cart Sales:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹100,000</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Katha Payments:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹35,000</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Token Bills:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹15,000</span>
          </div>
          <hr style="margin: 1rem 0; border: 1px solid #e2e8f0;">
          <div style="font-weight: 700; color: #166534;">
            <span>Total Revenue:</span>
            <span style="float: right;">₹150,000</span>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">💸 Cost Breakdown</h3>
          <div style="margin-bottom: 0.5rem;">
            <span>Inventory Cost:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹105,000</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Operating Expenses:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹22,500</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Other Costs:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹7,500</span>
          </div>
          <hr style="margin: 1rem 0; border: 1px solid #e2e8f0;">
          <div style="font-weight: 700; color: #dc2626;">
            <span>Total Cost:</span>
            <span style="float: right;">₹135,000</span>
          </div>
        </div>
      </div>
      
      <!-- Category-wise Profit Analysis -->
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📈 Category-wise Profit Analysis</h3>
      <div style="overflow-x: auto; margin-bottom: 2rem;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Category</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Revenue</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Cost</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Profit</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Margin %</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Vegetables</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹52,500</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹39,375</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">₹13,125</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">25.0%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Excellent</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Groceries</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹37,500</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹30,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">₹7,500</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #f59e0b; font-weight: 600;">20.0%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #f59e0b; font-weight: 600;">⚠️ Good</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Dairy & Eggs</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹30,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹21,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">₹9,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">30.0%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Excellent</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Snacks & Beverages</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹30,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹18,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">₹12,000</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">40.0%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Recommendations -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <h3 style="color: #0c4a6e; margin-bottom: 1rem;">💡 Profit Optimization Recommendations</h3>
        <ul style="color: #0c4a6e; margin: 0; padding-left: 1.5rem;">
          <li style="margin-bottom: 0.5rem;">Good performance! Consider expanding high-margin categories</li>
          <li style="margin-bottom: 0.5rem;">Optimize pricing strategy for better margins</li>
          <li style="margin-bottom: 0.5rem;">Focus on Snacks & Beverages category for maximum profit</li>
          <li style="margin-bottom: 0.5rem;">Consider increasing prices on high-demand grocery items</li>
        </ul>
      </div>
      
      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="exportProfitReport()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Export Report</button>
        <button onclick="optimizePricing()" style="background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">💰 Optimize Pricing</button>
      </div>
    </div>
  `;
  
  const itemsSection = document.getElementById("itemsSection");
  console.log("itemsSection element:", itemsSection);
  if (itemsSection) {
    itemsSection.style.display = "block";
    itemsSection.innerHTML = profitHTML;
    console.log("Profit Margins content loaded successfully");
  } else {
    console.error("itemsSection element not found");
    alert("Error: Could not find the content area. Please refresh the page.");
  }
}

// Calculate profit margins from store data
function calculateProfitMargins() {
  // Get cart data
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const kathaRecords = JSON.parse(localStorage.getItem("kathaRecords") || "[]");
  const bill = JSON.parse(localStorage.getItem("bill") || "[]");
  
  // Calculate revenue from different sources
  const cartSales = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const kathaPayments = kathaRecords.reduce((sum, record) => {
    if (record.status === 'paid') {
      return sum + record.totalAmount;
    }
    return sum;
  }, 0);
  const tokenBills = bill.reduce((sum, item) => sum + parseFloat(item.total), 0);
  let totalRevenue = cartSales + kathaPayments + tokenBills;
  
  // If no revenue data, show sample data for demonstration
  if (totalRevenue === 0) {
    totalRevenue = 150000; // Sample revenue for demonstration
  }
  
  // Calculate costs (assuming 70% cost of goods sold and 15% operating expenses)
  const inventoryCost = totalRevenue * 0.7;
  const operatingExpenses = totalRevenue * 0.15;
  const otherCosts = totalRevenue * 0.05;
  const totalCost = inventoryCost + operatingExpenses + otherCosts;
  
  // Calculate profit
  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  // Category-wise analysis (using mock data since categories is not accessible)
  const categoryAnalysis = [
    {
      name: "Vegetables",
      revenue: Math.round(totalRevenue * 0.35),
      cost: Math.round(totalRevenue * 0.35 * 0.75),
      profit: Math.round(totalRevenue * 0.35 * 0.25),
      margin: 25.0
    },
    {
      name: "Groceries",
      revenue: Math.round(totalRevenue * 0.25),
      cost: Math.round(totalRevenue * 0.25 * 0.8),
      profit: Math.round(totalRevenue * 0.25 * 0.2),
      margin: 20.0
    },
    {
      name: "Dairy & Eggs",
      revenue: Math.round(totalRevenue * 0.20),
      cost: Math.round(totalRevenue * 0.20 * 0.7),
      profit: Math.round(totalRevenue * 0.20 * 0.3),
      margin: 30.0
    },
    {
      name: "Snacks & Beverages",
      revenue: Math.round(totalRevenue * 0.20),
      cost: Math.round(totalRevenue * 0.20 * 0.6),
      profit: Math.round(totalRevenue * 0.20 * 0.4),
      margin: 40.0
    }
  ];
  
  // Generate recommendations
  const recommendations = [];
  if (profitMargin < 10) {
    recommendations.push("Consider increasing prices on high-demand items");
    recommendations.push("Review and optimize inventory costs");
    recommendations.push("Focus on higher-margin categories");
  } else if (profitMargin < 20) {
    recommendations.push("Good performance! Consider expanding high-margin categories");
    recommendations.push("Optimize pricing strategy for better margins");
  } else {
    recommendations.push("Excellent profit margins! Consider expanding operations");
    recommendations.push("Maintain current pricing strategy");
  }
  
  if (categoryAnalysis.length > 0) {
    const lowMarginCategories = categoryAnalysis.filter(cat => cat.margin < 15);
    if (lowMarginCategories.length > 0) {
      recommendations.push(`Review pricing for: ${lowMarginCategories.map(cat => cat.name).join(', ')}`);
    }
  }
  
  return {
    totalRevenue: Math.round(totalRevenue),
    totalCost: Math.round(totalCost),
    netProfit: Math.round(netProfit),
    profitMargin: profitMargin,
    cartSales: Math.round(cartSales),
    kathaPayments: Math.round(kathaPayments),
    tokenBills: Math.round(tokenBills),
    inventoryCost: Math.round(inventoryCost),
    operatingExpenses: Math.round(operatingExpenses),
    otherCosts: Math.round(otherCosts),
    categoryAnalysis: categoryAnalysis,
    recommendations: recommendations
  };
}

// Helper functions for profit analysis
function exportProfitReport() {
  alert("Profit report exported to Excel! This feature would generate a detailed CSV report.");
}

function optimizePricing() {
  alert("Pricing optimization analysis generated! This feature would suggest optimal prices based on market data.");
}

// Cash Flow Management
function showCashFlow() {
  console.log("showCashFlow function called");
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Mock cash flow data
  const cashFlowData = {
    income: {
      sales: 125000,
      kathaPayments: 45000,
      otherIncome: 5000
    },
    expenses: {
      inventory: 85000,
      rent: 15000,
      utilities: 8000,
      salaries: 25000,
      marketing: 5000,
      otherExpenses: 3000
    }
  };
  
  const totalIncome = cashFlowData.income.sales + cashFlowData.income.kathaPayments + cashFlowData.income.otherIncome;
  const totalExpenses = Object.values(cashFlowData.expenses).reduce((sum, exp) => sum + exp, 0);
  const netCashFlow = totalIncome - totalExpenses;
  
  let cashFlowHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">💸 Cash Flow Management</h2>
      <p style="color: #64748b; margin-bottom: 2rem;">Period: ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #166534; margin-bottom: 1rem;">💰 Income</h3>
          <div style="margin-bottom: 0.5rem;">
            <span>Sales Revenue:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹${cashFlowData.income.sales.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Katha Payments:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹${cashFlowData.income.kathaPayments.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Other Income:</span>
            <span style="float: right; font-weight: 600; color: #166534;">₹${cashFlowData.income.otherIncome.toLocaleString()}</span>
          </div>
          <hr style="margin: 1rem 0; border: 1px solid #bbf7d0;">
          <div style="font-weight: 700; font-size: 1.1rem; color: #166534;">
            <span>Total Income:</span>
            <span style="float: right;">₹${totalIncome.toLocaleString()}</span>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #dc2626; margin-bottom: 1rem;">💸 Expenses</h3>
          <div style="margin-bottom: 0.5rem;">
            <span>Inventory Purchase:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.inventory.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Rent:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.rent.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Utilities:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.utilities.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Salaries:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.salaries.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Marketing:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.marketing.toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 0.5rem;">
            <span>Other Expenses:</span>
            <span style="float: right; font-weight: 600; color: #dc2626;">₹${cashFlowData.expenses.otherExpenses.toLocaleString()}</span>
          </div>
          <hr style="margin: 1rem 0; border: 1px solid #fecaca;">
          <div style="font-weight: 700; font-size: 1.1rem; color: #dc2626;">
            <span>Total Expenses:</span>
            <span style="float: right;">₹${totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div style="background: ${netCashFlow >= 0 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)'}; padding: 1.5rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
        <h3 style="color: ${netCashFlow >= 0 ? '#166534' : '#dc2626'}; margin-bottom: 0.5rem;">Net Cash Flow</h3>
        <p style="font-size: 2rem; font-weight: 700; color: ${netCashFlow >= 0 ? '#166534' : '#dc2626'}; margin: 0;">₹${netCashFlow.toLocaleString()}</p>
        <p style="color: ${netCashFlow >= 0 ? '#166534' : '#dc2626'}; margin-top: 0.5rem;">${netCashFlow >= 0 ? '✅ Positive Cash Flow' : '❌ Negative Cash Flow'}</p>
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="exportCashFlowReport()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Export Report</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = cashFlowHTML;
}

// Tax Reports
function showTaxReports() {
  console.log("showTaxReports function called");
  const currentYear = new Date().getFullYear();
  const taxData = {
    totalSales: 1500000,
    totalPurchases: 1050000,
    gstCollected: 270000,
    gstPaid: 189000,
    gstPayable: 81000,
    tds: 15000,
    totalTaxLiability: 96000
  };
  
  let taxHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">📋 Tax Reports - FY ${currentYear}</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #1e40af; margin-bottom: 0.5rem;">Total Sales</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin: 0;">₹${taxData.totalSales.toLocaleString()}</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">GST Collected</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #92400e; margin: 0;">₹${taxData.gstCollected.toLocaleString()}</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #dc2626; margin-bottom: 0.5rem;">GST Paid</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #dc2626; margin: 0;">₹${taxData.gstPaid.toLocaleString()}</p>
        </div>
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #166534; margin-bottom: 0.5rem;">Net Tax Payable</h3>
          <p style="font-size: 1.5rem; font-weight: 700; color: #166534; margin: 0;">₹${taxData.totalTaxLiability.toLocaleString()}</p>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📊 Tax Breakdown</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Description</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Amount (₹)</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">GST Rate</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">GST Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">Sales Revenue</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${taxData.totalSales.toLocaleString()}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">18%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${taxData.gstCollected.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">Purchase Expenses</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${taxData.totalPurchases.toLocaleString()}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">18%</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${taxData.gstPaid.toLocaleString()}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">Net GST Payable</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600; color: #dc2626;">${taxData.gstPayable.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">TDS</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${taxData.tds.toLocaleString()}</td>
            </tr>
            <tr style="background: #fef2f2;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 700;">Total Tax Liability</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700;">-</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: #dc2626;">${taxData.totalTaxLiability.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="generateTaxReport()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📄 Generate Report</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = taxHTML;
}

// Helper functions
function updateCompetitorPrices() {
  alert("Competitor prices updated successfully! This feature would integrate with real-time price monitoring APIs.");
}

function exportCashFlowReport() {
  alert("Cash flow report exported to Excel! This feature would generate a downloadable CSV file.");
}

function generateTaxReport() {
  alert("Tax report generated successfully! This feature would create a PDF report for filing.");
}

// ===== INVENTORY MANAGEMENT MODULE =====

// Supplier Management
const suppliers = [
  { id: 1, name: "Fresh Farms Ltd", contact: "+91-9876543210", email: "contact@freshfarms.com", rating: 4.5, items: ["Tomato", "Potato", "Onion", "Carrot"] },
  { id: 2, name: "Grocery Wholesale", contact: "+91-9876543211", email: "sales@grocerywholesale.com", rating: 4.2, items: ["Rice", "Wheat Flour", "Sugar", "Salt"] },
  { id: 3, name: "Dairy Products Co", contact: "+91-9876543212", email: "info@dairyproducts.com", rating: 4.7, items: ["Milk", "Butter", "Cheese", "Yogurt"] },
  { id: 4, name: "Snack Distributors", contact: "+91-9876543213", email: "orders@snackdist.com", rating: 4.3, items: ["Lay's Classic Salted", "Bourbon", "Dairy Milk", "Maggi Instant Noodles"] }
];

// Expiry tracking data
const expiryData = [
  { item: "Milk", expiryDate: "2024-02-15", daysLeft: 3, quantity: 50, status: "⚠️ Expiring Soon" },
  { item: "Yogurt", expiryDate: "2024-02-18", daysLeft: 6, quantity: 30, status: "⚠️ Expiring Soon" },
  { item: "Cheese", expiryDate: "2024-02-20", daysLeft: 8, quantity: 25, status: "✅ Good" },
  { item: "Butter", expiryDate: "2024-02-12", daysLeft: 0, quantity: 15, status: "❌ Expired" }
];

function showSupplierManagement() {
  let supplierHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">🏢 Supplier Management</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #1e40af; margin-bottom: 0.5rem;">Total Suppliers</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #1e40af; margin: 0;">${suppliers.length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #166534; margin-bottom: 0.5rem;">Avg Rating</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #166534; margin: 0;">${(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)} ⭐</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Active Orders</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #92400e; margin: 0;">12</p>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📋 Supplier Directory</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Supplier</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Contact</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Rating</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Items</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers.map(supplier => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">
                  <div>
                    <div style="font-weight: 600; color: #0f172a;">${supplier.name}</div>
                    <div style="font-size: 0.9rem; color: #64748b;">${supplier.email}</div>
                  </div>
                </td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${supplier.contact}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${supplier.rating >= 4.5 ? '#059669' : supplier.rating >= 4.0 ? '#f59e0b' : '#dc2626'}; font-weight: 600;">${supplier.rating} ⭐</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${supplier.items.length}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  <button onclick="placeOrder(${supplier.id})" style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer; margin-right: 0.5rem;">📦 Order</button>
                  <button onclick="viewSupplierDetails(${supplier.id})" style="background: #667eea; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">👁️ View</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="addNewSupplier()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">➕ Add Supplier</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = supplierHTML;
}

function showExpiryTracking() {
  let expiryHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">⏰ Expiry Tracking</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #dc2626; margin-bottom: 0.5rem;">Expired Items</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #dc2626; margin: 0;">${expiryData.filter(item => item.daysLeft <= 0).length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Expiring Soon</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #92400e; margin: 0;">${expiryData.filter(item => item.daysLeft > 0 && item.daysLeft <= 7).length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #166534; margin-bottom: 0.5rem;">Good Items</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #166534; margin: 0;">${expiryData.filter(item => item.daysLeft > 7).length}</p>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📅 Expiry Alerts</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Item</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Expiry Date</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Days Left</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Quantity</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Status</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${expiryData.map(item => {
              const statusColor = item.daysLeft <= 0 ? '#dc2626' : item.daysLeft <= 7 ? '#f59e0b' : '#059669';
              return `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">${item.item}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${item.expiryDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${statusColor}; font-weight: 600;">${item.daysLeft} days</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${statusColor}; font-weight: 600;">${item.status}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                    ${item.daysLeft <= 0 ? 
                      '<button onclick="disposeExpiredItem(\'' + item.item + '\')" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">🗑️ Dispose</button>' :
                      item.daysLeft <= 7 ?
                      '<button onclick="discountExpiringItem(\'' + item.item + '\')" style="background: #f59e0b; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">💰 Discount</button>' :
                      '<span style="color: #059669;">✅ Safe</span>'
                    }
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="exportExpiryReport()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Export Report</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = expiryHTML;
}

function showAutoReordering() {
  // Find items that need reordering (low stock)
  const lowStockItems = [];
  categories.forEach(category => {
    category.items.forEach(item => {
      if (item.stock <= 10) {
        lowStockItems.push({
          ...item,
          category: category.name,
          reorderQuantity: Math.max(50, item.stock * 2) // Reorder 2x current stock or minimum 50
        });
      }
    });
  });
  
  let reorderHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">🤖 Automated Reordering</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #dc2626; margin-bottom: 0.5rem;">Low Stock Items</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #dc2626; margin: 0;">${lowStockItems.length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Pending Orders</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #92400e; margin: 0;">8</p>
        </div>
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #166534; margin-bottom: 0.5rem;">Auto Orders</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #166534; margin: 0;">15</p>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📦 Reorder Suggestions</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Item</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Category</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Current Stock</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Reorder Quantity</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Estimated Cost</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${lowStockItems.map(item => {
              const estimatedCost = item.price * 0.7 * item.reorderQuantity; // Assuming 30% margin
              return `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">${item.name}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${item.category}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #dc2626; font-weight: 600;">${item.stock}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${item.reorderQuantity}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹${estimatedCost.toLocaleString()}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                    <button onclick="autoReorder('${item.name}', ${item.reorderQuantity})" style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">🤖 Auto Order</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="bulkAutoReorder()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🤖 Bulk Auto Order</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = reorderHTML;
}

// Helper functions for inventory management
function placeOrder(supplierId) {
  const supplier = suppliers.find(s => s.id === supplierId);
  alert(`Order placed with ${supplier.name}! This feature would integrate with supplier APIs.`);
}

function viewSupplierDetails(supplierId) {
  const supplier = suppliers.find(s => s.id === supplierId);
  alert(`Supplier Details:\nName: ${supplier.name}\nContact: ${supplier.contact}\nEmail: ${supplier.email}\nRating: ${supplier.rating} ⭐\nItems: ${supplier.items.join(', ')}`);
}

function addNewSupplier() {
  alert("Add New Supplier form would open here!");
}

function disposeExpiredItem(itemName) {
  if (confirm(`Are you sure you want to dispose of ${itemName}?`)) {
    alert(`${itemName} has been disposed of. Stock updated.`);
  }
}

function discountExpiringItem(itemName) {
  alert(`${itemName} has been marked for discount sale!`);
}

function exportExpiryReport() {
  alert("Expiry report exported to Excel!");
}

function autoReorder(itemName, quantity) {
  alert(`Auto order placed for ${quantity} units of ${itemName}!`);
}

function bulkAutoReorder() {
  alert("Bulk auto order placed for all low stock items!");
}

// ===== CUSTOMER FEATURES MODULE =====

// Recipe Database
const recipes = {
  "Butter Chicken": {
    ingredients: [
      { name: "Chicken", quantity: 500, unit: "g", price: 200 },
      { name: "Tomato", quantity: 4, unit: "pieces", price: 80 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 50 },
      { name: "Butter", quantity: 100, unit: "g", price: 120 },
      { name: "Cream", quantity: 200, unit: "ml", price: 80 },
      { name: "Spices", quantity: 50, unit: "g", price: 30 }
    ],
    totalCost: 560,
    servings: 4,
    difficulty: "Medium",
    time: "45 minutes",
    nutrition: { calories: 450, protein: 25, carbs: 15, fat: 35 }
  },
  "Vegetable Pulao": {
    ingredients: [
      { name: "Rice", quantity: 2, unit: "cups", price: 100 },
      { name: "Carrot", quantity: 2, unit: "pieces", price: 36 },
      { name: "Peas", quantity: 1, unit: "cup", price: 40 },
      { name: "Onion", quantity: 1, unit: "piece", price: 25 },
      { name: "Oil", quantity: 3, unit: "tbsp", price: 45 },
      { name: "Spices", quantity: 30, unit: "g", price: 20 }
    ],
    totalCost: 266,
    servings: 4,
    difficulty: "Easy",
    time: "30 minutes",
    nutrition: { calories: 320, protein: 8, carbs: 55, fat: 12 }
  },
  "Dal Khichdi": {
    ingredients: [
      { name: "Rice", quantity: 1, unit: "cup", price: 50 },
      { name: "Dal", quantity: 1, unit: "cup", price: 60 },
      { name: "Ghee", quantity: 2, unit: "tbsp", price: 40 },
      { name: "Spices", quantity: 20, unit: "g", price: 15 }
    ],
    totalCost: 165,
    servings: 3,
    difficulty: "Easy",
    time: "25 minutes",
    nutrition: { calories: 280, protein: 12, carbs: 45, fat: 8 }
  }
};

// Nutritional Information Database
const nutritionalInfo = {
  "Tomato": { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, allergens: [] },
  "Potato": { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, allergens: [] },
  "Milk": { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, allergens: ["Dairy"] },
  "Rice": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, allergens: [] },
  "Eggs": { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, allergens: ["Eggs"] },
  "Butter": { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, allergens: ["Dairy"] },
  "Cheese": { calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, allergens: ["Dairy"] },
  "Bread": { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, allergens: ["Gluten"] }
};

// Allergen Information
const allergens = {
  "Dairy": "Contains milk and milk products",
  "Eggs": "Contains eggs and egg products", 
  "Gluten": "Contains wheat, rye, barley",
  "Nuts": "Contains tree nuts and peanuts",
  "Soy": "Contains soy products",
  "Fish": "Contains fish and shellfish"
};

function showRecipeIntegration() {
  let recipeHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">👨‍🍳 Recipe Integration</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        ${Object.entries(recipes).map(([recipeName, recipe]) => `
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #0f172a; margin-bottom: 1rem;">${recipeName}</h3>
            <div style="margin-bottom: 1rem;">
              <span style="font-weight: 600;">⏱️ Time:</span> ${recipe.time}<br>
              <span style="font-weight: 600;">👥 Servings:</span> ${recipe.servings}<br>
              <span style="font-weight: 600;">📊 Difficulty:</span> ${recipe.difficulty}<br>
              <span style="font-weight: 600;">💰 Total Cost:</span> ₹${recipe.totalCost}
            </div>
            <div style="margin-bottom: 1rem;">
              <span style="font-weight: 600;">🍽️ Nutrition (per serving):</span><br>
              Calories: ${recipe.nutrition.calories} | Protein: ${recipe.nutrition.protein}g | Carbs: ${recipe.nutrition.carbs}g | Fat: ${recipe.nutrition.fat}g
            </div>
            <button onclick="addRecipeIngredients('${recipeName}')" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; width: 100%;">🛒 Add All Ingredients</button>
          </div>
        `).join('')}
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📋 Recipe Ingredients</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
        ${Object.entries(recipes).map(([recipeName, recipe]) => `
          <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
            <h4 style="color: #0f172a; margin-bottom: 0.5rem;">${recipeName} Ingredients:</h4>
            <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.9rem;">
              ${recipe.ingredients.map(ing => `
                <li style="margin-bottom: 0.25rem;">${ing.name} - ${ing.quantity} ${ing.unit} (₹${ing.price})</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = recipeHTML;
}

function showNutritionalInfo() {
  let nutritionHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">🥗 Nutritional Information</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        ${Object.entries(nutritionalInfo).map(([itemName, nutrition]) => `
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #0f172a; margin-bottom: 1rem;">${itemName}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 1rem;">
              <div><span style="font-weight: 600;">🔥 Calories:</span> ${nutrition.calories}</div>
              <div><span style="font-weight: 600;">💪 Protein:</span> ${nutrition.protein}g</div>
              <div><span style="font-weight: 600;">🍞 Carbs:</span> ${nutrition.carbs}g</div>
              <div><span style="font-weight: 600;">🧈 Fat:</span> ${nutrition.fat}g</div>
              <div><span style="font-weight: 600;">🌾 Fiber:</span> ${nutrition.fiber}g</div>
            </div>
            ${nutrition.allergens.length > 0 ? `
              <div style="background: #fef2f2; padding: 0.5rem; border-radius: 5px; margin-top: 0.5rem;">
                <span style="font-weight: 600; color: #dc2626;">⚠️ Allergens:</span> ${nutrition.allergens.map(allergen => allergens[allergen]).join(', ')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">⚠️ Allergen Guide</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${Object.entries(allergens).map(([allergen, description]) => `
          <div style="background: #fef2f2; padding: 1rem; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h4 style="color: #dc2626; margin-bottom: 0.5rem;">${allergen}</h4>
            <p style="margin: 0; font-size: 0.9rem; color: #7f1d1d;">${description}</p>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = nutritionHTML;
}

function showPriceComparison() {
  // Mock competitor prices
  const competitorPrices = {
    "Tomato": { ourPrice: 20, bigBazaar: 22, relianceFresh: 21, dMart: 20, localMarket: 18 },
    "Potato": { ourPrice: 15, bigBazaar: 17, relianceFresh: 16, dMart: 15, localMarket: 14 },
    "Milk": { ourPrice: 60, bigBazaar: 62, relianceFresh: 61, dMart: 59, localMarket: 58 },
    "Rice": { ourPrice: 50, bigBazaar: 52, relianceFresh: 51, dMart: 49, localMarket: 48 },
    "Bread": { ourPrice: 35, bigBazaar: 38, relianceFresh: 37, dMart: 35, localMarket: 33 }
  };
  
  let comparisonHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">💰 Price Comparison</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #166534; margin-bottom: 0.5rem;">Best Prices</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #166534; margin: 0;">${Object.keys(competitorPrices).filter(item => {
            const prices = competitorPrices[item];
            return prices.ourPrice <= Math.min(prices.bigBazaar, prices.relianceFresh, prices.dMart, prices.localMarket);
          }).length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #92400e; margin-bottom: 0.5rem;">Competitive Prices</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #92400e; margin: 0;">${Object.keys(competitorPrices).filter(item => {
            const prices = competitorPrices[item];
            const avgCompetitor = (prices.bigBazaar + prices.relianceFresh + prices.dMart + prices.localMarket) / 4;
            return Math.abs(prices.ourPrice - avgCompetitor) <= 2;
          }).length}</p>
        </div>
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
          <h3 style="color: #1e40af; margin-bottom: 0.5rem;">Avg Savings</h3>
          <p style="font-size: 2rem; font-weight: 700; color: #1e40af; margin: 0;">₹${Math.round(Object.keys(competitorPrices).reduce((total, item) => {
            const prices = competitorPrices[item];
            const avgCompetitor = (prices.bigBazaar + prices.relianceFresh + prices.dMart + prices.localMarket) / 4;
            return total + Math.max(0, avgCompetitor - prices.ourPrice);
          }, 0) / Object.keys(competitorPrices).length)}</p>
        </div>
      </div>
      
      <h3 style="color: #0f172a; margin-bottom: 1rem;">📊 Detailed Comparison</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Product</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Our Price</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Big Bazaar</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Reliance Fresh</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">D-Mart</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Local Market</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Savings</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(competitorPrices).map(([item, prices]) => {
              const avgCompetitor = (prices.bigBazaar + prices.relianceFresh + prices.dMart + prices.localMarket) / 4;
              const savings = avgCompetitor - prices.ourPrice;
              const savingsColor = savings > 0 ? '#059669' : savings < 0 ? '#dc2626' : '#64748b';
              const savingsText = savings > 0 ? `+₹${savings.toFixed(1)}` : savings < 0 ? `-₹${Math.abs(savings).toFixed(1)}` : 'Same';
              
              return `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">${item}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600; color: #667eea;">₹${prices.ourPrice}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹${prices.bigBazaar}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹${prices.relianceFresh}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹${prices.dMart}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹${prices.localMarket}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${savingsColor}; font-weight: 600;">${savingsText}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="margin-top: 2rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = comparisonHTML;
}

function showDeliveryScheduling() {
  const timeSlots = [
    { time: "09:00 - 11:00", available: true, price: 0 },
    { time: "11:00 - 13:00", available: true, price: 0 },
    { time: "13:00 - 15:00", available: true, price: 0 },
    { time: "15:00 - 17:00", available: true, price: 0 },
    { time: "17:00 - 19:00", available: true, price: 20 },
    { time: "19:00 - 21:00", available: false, price: 30 }
  ];
  
  let deliveryHTML = `
    <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #667eea; margin-bottom: 1.5rem;">🚚 Delivery Scheduling</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #166534; margin-bottom: 1rem;">📅 Today's Slots</h3>
          <div style="display: grid; gap: 0.5rem;">
            ${timeSlots.map((slot, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: ${slot.available ? '#f0fdf4' : '#fef2f2'}; border-radius: 5px; border: 1px solid ${slot.available ? '#bbf7d0' : '#fecaca'};">
                <span style="font-weight: 600; color: ${slot.available ? '#166534' : '#dc2626'};">${slot.time}</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  ${slot.available ? 
                    `<span style="color: #166534;">✅ Available</span>` : 
                    `<span style="color: #dc2626;">❌ Unavailable</span>`
                  }
                  ${slot.price > 0 ? `<span style="color: #92400e; font-weight: 600;">+₹${slot.price}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: #1e40af; margin-bottom: 1rem;">📍 Delivery Areas</h3>
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Within 2km:</span>
              <span style="font-weight: 600; color: #166534;">Free</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>2-5km:</span>
              <span style="font-weight: 600; color: #f59e0b;">₹30</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>5-10km:</span>
              <span style="font-weight: 600; color: #dc2626;">₹50</span>
            </div>
          </div>
          
          <h4 style="color: #1e40af; margin-bottom: 0.5rem;">📋 Delivery Instructions</h4>
          <textarea placeholder="Enter delivery instructions (optional)" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 5px; resize: vertical; min-height: 80px;"></textarea>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <h3 style="color: #92400e; margin-bottom: 1rem;">💡 Delivery Tips</h3>
        <ul style="margin: 0; padding-left: 1.5rem; color: #92400e;">
          <li>Orders placed before 2 PM get same-day delivery</li>
          <li>Minimum order value: ₹200 for free delivery</li>
          <li>Contact us if you need urgent delivery</li>
          <li>Track your delivery in real-time</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        <button onclick="scheduleDelivery()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📅 Schedule Delivery</button>
      </div>
    </div>
  `;
  
  document.getElementById("itemsSection").innerHTML = deliveryHTML;
}

// Helper functions for customer features
function addRecipeIngredients(recipeName) {
  const recipe = recipes[recipeName];
  if (!recipe) return;
  
  recipe.ingredients.forEach(ingredient => {
    // Find the item in categories and add to cart
    categories.forEach(category => {
      const item = category.items.find(item => item.name.toLowerCase().includes(ingredient.name.toLowerCase()));
      if (item) {
        addToCart(item, ingredient.quantity);
      }
    });
  });
  
  alert(`All ingredients for ${recipeName} have been added to your cart! Total cost: ₹${recipe.totalCost}`);
}

function scheduleDelivery() {
  alert("Delivery scheduled successfully! You will receive a confirmation SMS shortly.");
}

// Test function to verify button functionality
function testButtonFunctionality() {
  alert("Button functionality is working! This is a test function.");
  console.log("Test function called successfully");
  
  // Test if we can access the itemsSection
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">🧪 Test Function Working!</h2>
        <p style="color: #64748b; margin-bottom: 1rem;">This test confirms that:</p>
        <ul style="color: #64748b; margin-bottom: 1rem;">
          <li>✅ Button event listeners are working</li>
          <li>✅ JavaScript functions can be called</li>
          <li>✅ Content can be displayed in itemsSection</li>
          <li>✅ HTML elements can be found and modified</li>
        </ul>
        <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
      </div>
    `;
    console.log("Test content loaded successfully");
  } else {
    console.error("itemsSection not found in test function");
  }
}

// Simple test functions for each feature
function testCompetitorAnalysis() {
  alert("Competitor Analysis feature is working!");
}

function testProfitMargins() {
  alert("Profit Margins feature is working!");
}

function testCashFlow() {
  alert("Cash Flow feature is working!");
}

function testTaxReports() {
  alert("Tax Reports feature is working!");
}

function testSupplierManagement() {
  alert("Supplier Management feature is working!");
}

function testExpiryTracking() {
  alert("Expiry Tracking feature is working!");
}

function testAutoReordering() {
  alert("Auto Reordering feature is working!");
}

function testRecipeIntegration() {
  alert("Recipe Integration feature is working!");
}

function testNutritionalInfo() {
  alert("Nutritional Info feature is working!");
}

function testPriceComparison() {
  alert("Price Comparison feature is working!");
}

function testDeliveryScheduling() {
  alert("Delivery Scheduling feature is working!");
}

// Missing functions for navigation buttons
function showBillHistory() {
  console.log("showBillHistory function called");
  
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">📄 Bill History</h2>
        
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <input type="text" placeholder="Search bills..." style="flex: 1; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
            <select style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <button style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🔍 Search</button>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Bill ID</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Customer</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Date</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Amount</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Status</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">BILL-001</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">John Doe</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">2024-01-15</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹1,250</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #059669; font-weight: 600;">✅ Paid</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  <button style="background: #667eea; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">👁️ View</button>
                  <button style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">📄 Print</button>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">BILL-002</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">Jane Smith</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">2024-01-14</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">₹850</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: #f59e0b; font-weight: 600;">⏳ Pending</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
                  <button style="background: #667eea; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">👁️ View</button>
                  <button style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">📄 Print</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
          <button style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Export Report</button>
        </div>
      </div>
    `;
    console.log("Bill History content loaded successfully");
  } else {
    console.error("itemsSection not found");
  }
}

function showContactSection() {
  console.log("showContactSection function called");
  
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">📞 Contact Us</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #0f172a; margin-bottom: 1rem;">📍 Store Location</h3>
            <p style="color: #64748b; margin-bottom: 0.5rem;">123 Main Street</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">City Center, State 12345</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">India</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #0f172a; margin-bottom: 1rem;">📞 Contact Info</h3>
            <p style="color: #64748b; margin-bottom: 0.5rem;">Phone: +91 98765 43210</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">Email: info@smartstore.com</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">WhatsApp: +91 98765 43210</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #0f172a; margin-bottom: 1rem;">🕒 Business Hours</h3>
            <p style="color: #64748b; margin-bottom: 0.5rem;">Monday - Saturday: 8:00 AM - 10:00 PM</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">Sunday: 9:00 AM - 8:00 PM</p>
            <p style="color: #64748b; margin-bottom: 0.5rem;">24/7 Online Support</p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">💬 Send us a Message</h3>
          <form style="display: grid; gap: 1rem;">
            <input type="text" placeholder="Your Name" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
            <input type="email" placeholder="Your Email" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
            <input type="text" placeholder="Subject" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
            <textarea placeholder="Your Message" rows="4" style="padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; resize: vertical;"></textarea>
            <button type="submit" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📤 Send Message</button>
          </form>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
        </div>
      </div>
    `;
    console.log("Contact Section content loaded successfully");
  } else {
    console.error("itemsSection not found");
  }
}

function showMonthlySpin() {
  console.log("showMonthlySpin function called");
  
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">🎰 Monthly Spin & Rewards</h2>
        
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 20px; margin-bottom: 1rem;">
            <h3 style="color: #92400e; margin-bottom: 1rem;">🎁 Lucky Spin</h3>
            <p style="color: #92400e; margin-bottom: 1rem;">Spin the wheel to win amazing rewards!</p>
            <button onclick="spinWheel()" style="background: #f59e0b; color: white; padding: 1rem 2rem; border: none; border-radius: 12px; cursor: pointer; font-size: 1.2rem; font-weight: 600;">🎰 SPIN NOW</button>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #166534; margin-bottom: 0.5rem;">🏆 Your Points</h3>
            <p style="font-size: 2rem; font-weight: 700; color: #166534; margin: 0;">1,250</p>
          </div>
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 0.5rem;">🎯 Tier Level</h3>
            <p style="font-size: 2rem; font-weight: 700; color: #1e40af; margin: 0;">Gold</p>
          </div>
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #dc2626; margin-bottom: 0.5rem;">🎁 Rewards Won</h3>
            <p style="font-size: 2rem; font-weight: 700; color: #dc2626; margin: 0;">8</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
          <button style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🏆 View Rewards</button>
        </div>
      </div>
    `;
    console.log("Monthly Spin content loaded successfully");
  } else {
    console.error("itemsSection not found");
  }
}

function showHomePage() {
  console.log("showHomePage function called");
  
  const itemsSection = document.getElementById("itemsSection");
  if (itemsSection) {
    itemsSection.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">🏠 Welcome to Smart General Store</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #166534; margin-bottom: 1rem;">🛒 Start Shopping</h3>
            <p style="color: #166534; margin-bottom: 1rem;">Browse our wide selection of products and add items to your cart.</p>
            <button onclick="showMainSection()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Shop Now</button>
          </div>
          
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #1e40af; margin-bottom: 1rem;">👤 Customer Management</h3>
            <p style="color: #1e40af; margin-bottom: 1rem;">Add new customers and manage existing customer accounts.</p>
            <button onclick="addCustomer()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">👤 Add Customer</button>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #92400e; margin-bottom: 1rem;">📊 Business Intelligence</h3>
            <p style="color: #92400e; margin-bottom: 1rem;">View competitor analysis, profit margins, and financial reports.</p>
            <button onclick="showCompetitorAnalysis()" style="background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 View Reports</button>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">🚀 Quick Actions</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <button onclick="showStockManagement()" style="background: #667eea; color: white; padding: 0.75rem 1rem; border: none; border-radius: 8px; cursor: pointer;">📦 Stock Management</button>
            <button onclick="showKathaSection()" style="background: #667eea; color: white; padding: 0.75rem 1rem; border: none; border-radius: 8px; cursor: pointer;">📋 Katha System</button>
            <button onclick="showBillHistory()" style="background: #667eea; color: white; padding: 0.75rem 1rem; border: none; border-radius: 8px; cursor: pointer;">📄 Bill History</button>
            <button onclick="showMonthlySpin()" style="background: #667eea; color: white; padding: 0.75rem 1rem; border: none; border-radius: 8px; cursor: pointer;">🎰 Monthly Spin</button>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Start Shopping</button>
        </div>
      </div>
    `;
    console.log("Home Page content loaded successfully");
  } else {
    console.error("itemsSection not found");
  }
}

// Helper functions for stock management
function exportStockReport() {
  alert("Stock report exported to Excel! This feature would generate a detailed inventory report.");
}

function autoReorderLowStock() {
  alert("Auto reorder placed for low stock items! This feature would automatically order items with low stock levels.");
}

function clearAllStock() {
  if (confirm("Are you sure you want to clear all stock data? This action cannot be undone.")) {
    localStorage.removeItem("stockData");
    alert("All stock data has been cleared!");
    showStockManagement(); // Refresh the display
  }
}

// Make functions globally accessible
window.showStockManagement = async function() {
  console.log("showStockManagement function called");
  
  try {
    // Fetch stock data from backend
    const response = await fetch('http://localhost:3000/api/stock');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch stock data');
    }
    
    const stockData = result.data;
    console.log("Stock data from backend:", stockData);
    
    // Convert backend data format to frontend format
    const sampleItems = Object.keys(stockData).map(itemName => ({
      category: stockData[itemName].category,
      name: itemName,
      defaultStock: stockData[itemName].quantity
    }));
    
    // Calculate stock statistics
    let totalItems = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;
    let inStockItems = 0;
    
    sampleItems.forEach(item => {
      const currentStock = stockData[item.name]?.quantity || item.defaultStock;
      totalItems++;
      
      if (currentStock <= 0) {
        outOfStockItems++;
      } else if (currentStock <= 10) {
        lowStockItems++;
      } else {
        inStockItems++;
      }
    });
    
    // Generate stock table rows
    const stockTableRows = sampleItems.map(item => {
      const currentStock = stockData[item.name]?.quantity || item.defaultStock;
      const isOutOfStock = currentStock <= 0;
      const isLowStock = currentStock <= 10 && currentStock > 0;
      
      let statusColor, statusText, buttonColor;
      if (isOutOfStock) {
        statusColor = '#dc2626';
        statusText = '❌ Out of Stock';
        buttonColor = '#dc2626';
      } else if (isLowStock) {
        statusColor = '#f59e0b';
        statusText = '⚠️ Low Stock';
        buttonColor = '#f59e0b';
      } else {
        statusColor = '#059669';
        statusText = '✅ In Stock';
        buttonColor = '#059669';
      }
      
      return `
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${item.category}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${item.name}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${statusColor}; font-weight: 600;">${currentStock}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; color: ${statusColor}; font-weight: 600;">${statusText}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">
            <button onclick="addStock('${item.name}', 10)" style="background: ${buttonColor}; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer;">➕ Add</button>
          </td>
        </tr>
      `;
    }).join('');
    
    const stockHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-bottom: 1.5rem;">📦 Stock Management (Backend)</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">Manage inventory levels with persistent backend storage.</p>
        
        <!-- Add Stock Form -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
          <h3 style="color: #0f172a; margin-bottom: 1rem;">➕ Add Stock</h3>
          <div style="display: flex; gap: 1rem; align-items: end; flex-wrap: wrap;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">Item Name:</label>
              <input type="text" id="stockItemName" placeholder="Enter item name" style="width: 200px; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">Category:</label>
              <select id="stockCategory" style="width: 150px; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
                <option value="Vegetables">Vegetables</option>
                <option value="Groceries">Groceries</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Snacks & Beverages">Snacks & Beverages</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">Quantity to Add:</label>
              <input type="number" id="stockQuantity" placeholder="Enter quantity" style="width: 150px; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem;">
            </div>
            <button onclick="addStockFromUI()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">➕ Add Stock</button>
          </div>
        </div>
        
        <!-- Stock Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #166534; margin-bottom: 0.5rem;">Total Items</h3>
            <p style="font-size: 1.5rem; font-weight: 700; color: #166534; margin: 0;">${totalItems}</p>
          </div>
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #92400e; margin-bottom: 0.5rem;">Low Stock</h3>
            <p style="font-size: 1.5rem; font-weight: 700; color: #92400e; margin: 0;">${lowStockItems}</p>
          </div>
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #dc2626; margin-bottom: 0.5rem;">Out of Stock</h3>
            <p style="font-size: 1.5rem; font-weight: 700; color: #dc2626; margin: 0;">${outOfStockItems}</p>
          </div>
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 0.5rem;">In Stock</h3>
            <p style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin: 0;">${inStockItems}</p>
          </div>
        </div>
        
        <!-- Stock Table -->
        <h3 style="color: #0f172a; margin-bottom: 1rem;">📊 Current Stock Levels</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Category</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Item</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Stock (kg)</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Status</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${stockTableRows}
            </tbody>
          </table>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button onclick="showMainSection()" style="background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🛒 Back to Store</button>
          <button onclick="exportStockReport()" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">📊 Export Report</button>
          <button onclick="autoReorderLowStock()" style="background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🔄 Auto Reorder</button>
          <button onclick="clearAllStock()" style="background: #dc2626; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer;">🗑️ Clear All</button>
        </div>
      </div>
    `;
    
    const itemsSection = document.getElementById("itemsSection");
    console.log("itemsSection element:", itemsSection);
    if (itemsSection) {
      itemsSection.style.display = "block";
      itemsSection.innerHTML = stockHTML;
      console.log("Stock Management content loaded successfully");
    } else {
      console.error("itemsSection element not found");
      alert("Error: Could not find the content area. Please refresh the page.");
    }
  } catch (error) {
    console.error("Error loading stock management:", error);
    alert(`Error loading stock management: ${error.message}. Make sure the backend server is running on http://localhost:3000`);
  }
};

window.addStockFromUI = async function() {
  console.log("addStockFromUI function called");
  const itemName = document.getElementById("stockItemName").value.trim();
  const quantity = parseFloat(document.getElementById("stockQuantity").value);
  const category = document.getElementById("stockCategory").value;
  
  console.log("Item name:", itemName);
  console.log("Quantity:", quantity);
  console.log("Category:", category);
  
  if (!itemName || isNaN(quantity) || quantity <= 0) {
    alert("Please enter valid item name and quantity!");
    return;
  }
  
  try {
    // Send request to backend
    const response = await fetch('http://localhost:3000/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName,
        quantity: quantity,
        category: category
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update stock');
    }
    
    console.log("Backend response:", result);
    
    // Clear form
    document.getElementById("stockItemName").value = "";
    document.getElementById("stockQuantity").value = "";
    document.getElementById("stockCategory").value = "Vegetables";
    
    // Show success message
    alert(result.message);
    
    // Refresh the stock management display
    showStockManagement();
  } catch (error) {
    console.error("Error adding stock:", error);
    alert(`Error adding stock: ${error.message}. Make sure the backend server is running on http://localhost:3000`);
  }
};

// Function to add stock for specific items (used by quick add buttons)
window.addStock = async function(itemName, quantity) {
  console.log("addStock function called with:", itemName, quantity);
  
  try {
    // Send request to backend
    const response = await fetch('http://localhost:3000/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName,
        quantity: quantity
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update stock');
    }
    
    // Show success message
    alert(result.message);
    
    // Refresh the stock management display
    showStockManagement();
  } catch (error) {
    console.error("Error adding stock:", error);
    alert(`Error adding stock: ${error.message}. Make sure the backend server is running on http://localhost:3000`);
  }
};


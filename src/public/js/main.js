// Main JavaScript
const API_BASE = '/api';
let authToken = localStorage.getItem('authToken');

// API Helper
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    showAlert(result.message || 'An error occurred', 'danger');
    throw new Error(result.message);
  }

  return result;
}

// Alert Helper
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.insertBefore(alertDiv, document.body.firstChild);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const result = await apiCall('/auth/login', 'POST', { email, password });
        authToken = result.token;
        localStorage.setItem('authToken', authToken);
        showAlert('Login successful', 'success');
        window.location.href = '/';
      } catch (error) {
        console.error(error);
      }
    });
  }

  // Register
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
      };

      try {
        const result = await apiCall('/auth/register', 'POST', formData);
        authToken = result.token;
        localStorage.setItem('authToken', authToken);
        showAlert('Registration successful', 'success');
        window.location.href = '/';
      } catch (error) {
        console.error(error);
      }
    });
  }
});

// Load Products
async function loadProducts() {
  try {
    const result = await apiCall('/products');
    const productsContainer = document.getElementById('productsContainer');

    if (productsContainer && result.data && result.data.products) {
      productsContainer.innerHTML = result.data.products
        .map((product) => `
          <div class="col-md-4 mb-4">
            <div class="card product-card">
              <div class="product-image">📦</div>
              <div class="product-info">
                <h5 class="product-name">${product.name}</h5>
                <p class="product-price">$${product.price}</p>
                <p class="text-muted small">${product.description.substring(0, 50)}...</p>
                <button class="btn btn-sm btn-primary" onclick="addToCart('${product._id}')">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `)
        .join('');
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Add to Cart
async function addToCart(productId) {
  if (!authToken) {
    showAlert('Please login to add items to cart', 'warning');
    window.location.href = '/login';
    return;
  }

  try {
    await apiCall('/cart/add', 'POST', {
      productId,
      quantity: 1,
    });
    showAlert('Item added to cart', 'success');
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// Load Cart
async function loadCart() {
  if (!authToken) return;

  try {
    const result = await apiCall('/cart');
    const cartItemsContainer = document.getElementById('cartItems');

    if (cartItemsContainer && result.cart && result.cart.items) {
      cartItemsContainer.innerHTML = result.cart.items
        .map(
          (item) => `
          <tr>
            <td>${item.productId.name}</td>
            <td>$${item.productId.price}</td>
            <td>
              <input type="number" min="1" value="${item.quantity}" 
                onchange="updateQuantity('${item.productId._id}', this.value)">
            </td>
            <td>$${(item.productId.price * item.quantity).toFixed(2)}</td>
            <td>
              <button class="btn btn-sm btn-danger" 
                onclick="removeFromCart('${item.productId._id}')">
                Remove
              </button>
            </td>
          </tr>
        `
        )
        .join('');

      // Update totals
      document.getElementById('subtotal').textContent = `$${result.cart.totalPrice.toFixed(2)}`;
      document.getElementById('total').textContent = `$${(result.cart.totalPrice + 0 + 0).toFixed(2)}`;
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Update Quantity
async function updateQuantity(productId, quantity) {
  try {
    await apiCall('/cart/update-quantity', 'PUT', {
      productId,
      quantity: parseInt(quantity),
    });
    loadCart();
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
}

// Remove from Cart
async function removeFromCart(productId) {
  try {
    await apiCall('/cart/remove', 'POST', { productId });
    loadCart();
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

// Load Admin Dashboard
async function loadAdminDashboard() {
  if (!authToken) return;

  try {
    const result = await apiCall('/admin/dashboard');
    const stats = result.statistics;

    document.getElementById('totalCustomers').textContent = stats.totalCustomers;
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalRevenue').textContent = `$${stats.totalRevenue.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Logout
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  loadAdminDashboard();
});

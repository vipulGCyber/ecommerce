// =====================================================
// MAIN JAVASCRIPT - ECOMMERCE PLATFORM
// =====================================================

const API_BASE = '/api';
let authToken = localStorage.getItem('authToken');
let currentEditingId = null;

// =====================================================
// API HELPER FUNCTIONS
// =====================================================

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

// =====================================================
// UI HELPER FUNCTIONS
// =====================================================

function showAlert(message, type = 'info', timeout = 5000) {
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
  }, timeout);
}

function setLoading(elementId, isLoading = true) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (isLoading) {
    element.disabled = true;
    element.classList.add('loading');
    element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
  } else {
    element.disabled = false;
    element.classList.remove('loading');
  }
}

function openModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

function closeModal(modalId) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
  if (modal) modal.hide();
}

// =====================================================
// AUTHENTICATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginBtn = loginForm.querySelector('button[type="submit"]');
      setLoading(loginBtn.id, true);

      try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await apiCall('/auth/login', 'POST', { email, password });
        authToken = result.token;
        localStorage.setItem('authToken', authToken);
        showAlert('Login successful! Redirecting...', 'success', 2000);
        setTimeout(() => (window.location.href = '/'), 2000);
      } catch (error) {
        console.error(error);
        setLoading(loginBtn.id, false);
      }
    });
  }

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const registerBtn = registerForm.querySelector('button[type="submit"]');
      setLoading(registerBtn.id, true);

      try {
        const formData = {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          password: document.getElementById('password').value,
          confirmPassword: document.getElementById('confirmPassword').value,
        };

        const result = await apiCall('/auth/register', 'POST', formData);
        authToken = result.token;
        localStorage.setItem('authToken', authToken);
        showAlert('Registration successful! Redirecting...', 'success', 2000);
        setTimeout(() => (window.location.href = '/'), 2000);
      } catch (error) {
        console.error(error);
        setLoading(registerBtn.id, false);
      }
    });
  }
});

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

async function loadProducts() {
  try {
    const result = await apiCall('/products');
    const productsContainer = document.getElementById('productsContainer');

    if (productsContainer && result.data) {
      productsContainer.innerHTML = result.data
        .map((product) => `
          <div class="col-md-4 mb-4 fade-in">
            <div class="card product-card">
              <div class="product-image">📦</div>
              <div class="product-info">
                <h5 class="product-name">${product.name}</h5>
                <p class="product-description">${product.description || 'No description'}</p>
                <div class="product-price">
                  <span class="product-price-current">$${product.price.toFixed(2)}</span>
                  ${product.discountPrice ? `<span class="product-price-original">$${product.discountPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-stock mb-2">
                  <span class="badge ${product.stock > 10 ? 'badge-stock-high' : 'badge-stock-low'}">
                    Stock: ${product.stock}
                  </span>
                </div>
                <div class="product-actions">
                  <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        `)
        .join('');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showAlert('Failed to load products', 'danger');
  }
}

async function loadAdminProducts() {
  if (!authToken) return;

  try {
    const result = await apiCall('/admin/products');
    const table = document.getElementById('productsTable');

    if (table && result.products) {
      table.innerHTML = result.products
        .map((product) => `
          <tr class="fade-in">
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="badge badge-${product.stock > 10 ? 'success' : 'warning'}">${product.stock}</span></td>
            <td>
              <div class="table-actions">
                <button class="btn btn-sm btn-warning" onclick="editProduct('${product._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
              </div>
            </td>
          </tr>
        `)
        .join('');
    }
  } catch (error) {
    console.error('Error loading admin products:', error);
  }
}

function editProduct(productId) {
  currentEditingId = productId;
  // Fetch product details and populate form
  apiCall(`/products/${productId}`).then((result) => {
    document.getElementById('editProductName').value = result.product.name;
    document.getElementById('editProductPrice').value = result.product.price;
    document.getElementById('editProductStock').value = result.product.stock;
    document.getElementById('editProductDescription').value = result.product.description;
    openModal('editProductModal');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const editProductForm = document.getElementById('editProductForm');
  if (editProductForm) {
    editProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const formData = {
          name: document.getElementById('editProductName').value,
          price: parseFloat(document.getElementById('editProductPrice').value),
          stock: parseInt(document.getElementById('editProductStock').value),
          description: document.getElementById('editProductDescription').value,
        };

        await apiCall(`/products/${currentEditingId}`, 'PUT', formData);
        showAlert('Product updated successfully', 'success');
        closeModal('editProductModal');
        loadAdminProducts();
      } catch (error) {
        console.error(error);
      }
    });
  }
});

async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await apiCall(`/products/${productId}`, 'DELETE');
      showAlert('Product deleted successfully', 'success');
      loadAdminProducts();
    } catch (error) {
      console.error(error);
    }
  }
}

// =====================================================
// SHOPPING CART
// =====================================================

async function addToCart(productId) {
  if (!authToken) {
    showAlert('Please login to add items to cart', 'warning');
    setTimeout(() => (window.location.href = '/login'), 1500);
    return;
  }

  try {
    await apiCall('/cart/add', 'POST', {
      productId,
      quantity: 1,
    });
    showAlert('Item added to cart', 'success', 2000);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

async function loadCart() {
  if (!authToken) return;

  try {
    const result = await apiCall('/cart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');

    if (cartItemsContainer && result.data && result.data.items) {
      if (result.data.items.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
      } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        cartItemsContainer.innerHTML = result.data.items
          .map(
            (item) => `
          <div class="cart-item fade-in">
            <div class="cart-item-image">🛍️</div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.productId.name}</div>
              <div class="cart-item-price">$${item.productId.price.toFixed(2)}</div>
              <div class="quantity-control">
                <button class="btn btn-sm btn-secondary" onclick="decrementQuantity('${item.productId._id}')">−</button>
                <input type="number" value="${item.quantity}" readonly>
                <button class="btn btn-sm btn-secondary" onclick="incrementQuantity('${item.productId._id}')">+</button>
              </div>
            </div>
            <div>
              <div style="font-size: 1.2rem; font-weight: bold; color: #28a745; margin-bottom: 0.5rem;">
                $${(item.productId.price * item.quantity).toFixed(2)}
              </div>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.productId._id}')">
                Remove
              </button>
            </div>
          </div>
        `
          )
          .join('');

        // Update totals
        const subtotal = result.data.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        if (document.getElementById('subtotal')) document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        if (document.getElementById('tax')) document.getElementById('tax').textContent = tax.toFixed(2);
        if (document.getElementById('total')) document.getElementById('total').textContent = total.toFixed(2);
      }
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

function incrementQuantity(productId) {
  const currentQty = parseInt(event.target.parentElement.querySelector('input').value);
  updateQuantity(productId, currentQty + 1);
}

function decrementQuantity(productId) {
  const currentQty = parseInt(event.target.parentElement.querySelector('input').value);
  if (currentQty > 1) {
    updateQuantity(productId, currentQty - 1);
  }
}

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

async function removeFromCart(productId) {
  if (confirm('Remove this item from cart?')) {
    try {
      await apiCall('/cart/remove', 'POST', { productId });
      loadCart();
      showAlert('Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }
}

// =====================================================
// ORDERS MANAGEMENT
// =====================================================

async function loadOrders() {
  if (!authToken) return;

  try {
    const result = await apiCall('/orders');
    const ordersTable = document.getElementById('ordersTable');

    if (ordersTable && result.orders) {
      ordersTable.innerHTML = result.orders
        .map(
          (order) => `
        <tr class="fade-in">
          <td>${order.orderNumber}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td><span class="badge badge-${order.status === 'delivered' ? 'success' : 'warning'}">${order.status}</span></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="viewOrder('${order._id}')">View</button>
          </td>
        </tr>
      `
        )
        .join('');
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

async function loadAdminOrders() {
  if (!authToken) return;

  try {
    const result = await apiCall('/admin/orders');
    const ordersTable = document.getElementById('adminOrdersTable');

    if (ordersTable && result.orders) {
      ordersTable.innerHTML = result.orders
        .map(
          (order) => `
        <tr class="fade-in">
          <td>${order.orderNumber}</td>
          <td>${order.userId.email}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td><span class="badge badge-${order.status === 'delivered' ? 'success' : 'warning'}">${order.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-info" onclick="editOrder('${order._id}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="cancelOrder('${order._id}')">Cancel</button>
            </div>
          </td>
        </tr>
      `
        )
        .join('');
    }
  } catch (error) {
    console.error('Error loading admin orders:', error);
  }
}

function viewOrder(orderId) {
  // Navigate to order details
  window.location.href = `/order/${orderId}`;
}

// =====================================================
// ADMIN DASHBOARD
// =====================================================

async function loadAdminDashboard() {
  if (!authToken) return;

  try {
    const result = await apiCall('/admin/dashboard');
    const stats = result.stats || {};

    const updateStat = (elementId, value) => {
      const element = document.getElementById(elementId);
      if (element) element.textContent = value;
    };

    updateStat('totalCustomers', stats.totalCustomers || 0);
    updateStat('totalProducts', stats.totalProducts || 0);
    updateStat('totalOrders', stats.totalOrders || 0);
    updateStat('totalRevenue', `$${(stats.totalRevenue || 0).toFixed(2)}`);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// =====================================================
// USER AUTHENTICATION
// =====================================================

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('authToken');
    authToken = null;
    showAlert('Logged out successfully', 'info', 1500);
    setTimeout(() => (window.location.href = '/login'), 1500);
  }
}

function checkAuth() {
  const authRequired = document.body.dataset.authRequired === 'true';
  if (authRequired && !authToken) {
    window.location.href = '/login';
  }
}

// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadProducts();
  loadCart();
  loadOrders();
  loadAdminDashboard();
  loadAdminProducts();
  loadAdminOrders();
});

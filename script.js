// JoyShree E-commerce Store - Complete JavaScript

// Sample product data for natural, aromatic products
const products = [
  {
    id: 1,
    name: "Sandalwood Incense Sticks",
    price: 199,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Handcrafted incense sticks made from pure sandalwood for a calming aroma."
  },
  {
    id: 2,
    name: "Lavender Soy Candle",
    price: 349,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Natural soy candle infused with lavender essential oil for relaxation."
  },
  {
    id: 3,
    name: "Herbal Bath Soap",
    price: 129,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description: "Gentle bath soap made with herbal extracts and nourishing oils."
  },
  {
    id: 4,
    name: "Rose Aroma Oil",
    price: 249,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    description: "Pure rose aroma oil for diffusers and personal care."
  },
  {
    id: 5,
    name: "Jasmine Essential Oil",
    price: 299,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
    description: "Pure jasmine essential oil for aromatherapy and meditation."
  },
  {
    id: 6,
    name: "Natural Beeswax Candles",
    price: 399,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
    description: "Hand-poured beeswax candles with natural honey scent."
  }
];

// Cart state management
let cart = [];

// DOM Elements
let productsGrid, cartItems, cartSubtotal, cartTax, cartTotal, checkoutBtn;
let checkoutSection, orderSummary, payNowBtn, paymentModal;

/**
 * Initialize the application
 */
function initializeApp() {
  // Get DOM elements
  productsGrid = document.getElementById('productsGrid');
  cartItems = document.getElementById('cartItems');
  cartSubtotal = document.getElementById('cartSubtotal');
  cartTax = document.getElementById('cartTax');
  cartTotal = document.getElementById('cartTotal');
  checkoutBtn = document.getElementById('checkoutBtn');
  checkoutSection = document.getElementById('checkoutSection');
  orderSummary = document.getElementById('orderSummary');
  payNowBtn = document.getElementById('payNowBtn');
  paymentModal = document.getElementById('paymentModal');

  // Render initial state
  renderProducts();
  updateCartDisplay();
  
  console.log('JoyShree E-commerce Store initialized successfully!');
}

/**
 * Render all products in the grid
 */
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">₹${product.price}</div>
        <div class="product-description">${product.description}</div>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Add a product to the shopping cart
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCartDisplay();
  showCart();
  
  // Show success feedback
  showToast(`${product.name} added to cart!`);
}

/**
 * Update the cart display with current items
 */
function updateCartDisplay() {
  if (!cartItems || !checkoutBtn) return;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-center text-gray-500">Your cart is empty</p>';
    checkoutBtn.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" title="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" title="Increase quantity">+</button>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 8px; color: #ef4444;" title="Remove item">×</button>
          </div>
        </div>
      </div>
    `).join('');
    checkoutBtn.style.display = 'block';
  }
  
  updateCartTotals();
}

/**
 * Update the quantity of an item in the cart
 * @param {number} productId - The product ID
 * @param {number} change - The change in quantity (+1 or -1)
 */
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartDisplay();
  }
}

/**
 * Remove an item from the cart
 * @param {number} productId - The product ID to remove
 */
function removeFromCart(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showToast(`${item.name} removed from cart`);
  }
}

/**
 * Calculate and update cart totals
 */
function updateCartTotals() {
  if (!cartSubtotal || !cartTax || !cartTotal) return;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  
  cartSubtotal.textContent = `₹${subtotal}`;
  cartTax.textContent = `₹${Math.round(tax)}`;
  cartTotal.textContent = `₹${Math.round(total)}`;
}

/**
 * Show the shopping cart sidebar
 */
function showCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    cartContainer.classList.add('open');
  }
}

/**
 * Close the shopping cart sidebar
 */
function closeCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    cartContainer.classList.remove('open');
  }
}

/**
 * Show the checkout section
 */
function showCheckout() {
  if (!checkoutSection) return;
  
  checkoutSection.classList.remove('hidden');
  updateOrderSummary();
  closeCart();
  
  // Scroll to checkout section
  checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide the checkout section
 */
function hideCheckout() {
  if (!checkoutSection) return;
  
  checkoutSection.classList.add('hidden');
}

/**
 * Update the order summary display
 */
function updateOrderSummary() {
  if (!orderSummary) return;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  
  orderSummary.innerHTML = `
    <div class="mt-4">
      ${cart.map(item => `
        <div class="flex justify-between py-2 border-b">
          <span>${item.name} × ${item.quantity}</span>
          <span>₹${item.price * item.quantity}</span>
        </div>
      `).join('')}
      <div class="flex justify-between py-2 font-semibold">
        <span>Subtotal:</span>
        <span>₹${subtotal}</span>
      </div>
      <div class="flex justify-between py-2">
        <span>Tax (18%):</span>
        <span>₹${Math.round(tax)}</span>
      </div>
      <div class="flex justify-between py-2 text-lg font-bold border-t">
        <span>Total:</span>
        <span>₹${Math.round(total)}</span>
      </div>
    </div>
  `;
}

/**
 * Process the payment (simulated)
 */
function processPayment() {
  const form = document.getElementById('checkoutForm');
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  
  if (!payNowBtn) return;
  
  // Simulate payment processing
  payNowBtn.textContent = 'Processing...';
  payNowBtn.disabled = true;
  
  // Show processing feedback
  showToast('Processing payment...');
  
  setTimeout(() => {
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      showModal('success', 'Payment Successful!', 'Your order has been placed successfully. You will receive a confirmation email shortly.');
      cart = [];
      updateCartDisplay();
      hideCheckout();
      
      // Reset form
      form.reset();
    } else {
      showModal('error', 'Payment Failed', 'Please try again or use a different payment method.');
    }
    
    payNowBtn.textContent = 'Pay Now';
    payNowBtn.disabled = false;
  }, 2000);
}

/**
 * Show a modal with payment result
 * @param {string} type - 'success' or 'error'
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 */
function showModal(type, title, message) {
  if (!paymentModal) return;
  
  const icon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  
  if (icon && modalTitle && modalMessage) {
    icon.className = `modal-icon ${type}`;
    icon.textContent = type === 'success' ? '✓' : '✗';
    modalTitle.textContent = title;
    modalMessage.textContent = message;
  }
  
  paymentModal.classList.add('show');
}

/**
 * Close the payment modal
 */
function closeModal() {
  if (!paymentModal) return;
  paymentModal.classList.remove('show');
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.remove('translate-x-full');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
  }, 3000);
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 */
function searchProducts(query) {
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
  
  if (productsGrid) {
    productsGrid.innerHTML = filteredProducts.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-price">₹${product.price}</div>
          <div class="product-description">${product.description}</div>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Clear the cart
 */
function clearCart() {
  cart = [];
  updateCartDisplay();
  showToast('Cart cleared');
}

/**
 * Get cart item count
 * @returns {number} Total number of items in cart
 */
function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Update cart badge in navigation
 */
function updateCartBadge() {
  const cartLink = document.querySelector('a[onclick="showCart()"]');
  const itemCount = getCartItemCount();
  
  if (cartLink) {
    if (itemCount > 0) {
      cartLink.innerHTML = `Cart (${itemCount})`;
    } else {
      cartLink.innerHTML = 'Cart';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.showCart = showCart;
window.closeCart = closeCart;
window.showCheckout = showCheckout;
window.hideCheckout = hideCheckout;
window.processPayment = processPayment;
window.closeModal = closeModal;
window.searchProducts = searchProducts;
window.clearCart = clearCart; 
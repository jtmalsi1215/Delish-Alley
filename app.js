
(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const products = document.querySelectorAll('[data-category]');
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.getAttribute('data-filter');
      filterButtons.forEach(function (btn) { btn.classList.remove('active'); });
      button.classList.add('active');
      products.forEach(function (product) {
        const category = product.getAttribute('data-category');
        product.style.display = filter === 'all' || category === filter ? '' : 'none';
      });
    });
  });

  const orderForm = document.querySelector('#orderForm');
  const summaryProduct = document.querySelector('[data-summary-product]');
  const summaryQty = document.querySelector('[data-summary-qty]');
  const summaryTotal = document.querySelector('[data-summary-total]');
  const summaryPickup = document.querySelector('[data-summary-pickup]');
  const prices = {
    'Classic Chocolate Chip Cookies': 120,
    'Oreo S\'mores Cookies': 145,
    'Chocolate Chip Nutella Cookies': 150,
    'Biscoff Stuffed Cookies': 155,
    'Strawberry Chips Cookies': 135,
    'Biscoff Chips': 140,
    'Banana Loaf': 180,
    'Cookie Snack Pack': 110,
    'Chip Bundle': 399,
    'Perfect Gift Box': 450
  };
  function updateSummary() {
    if (!orderForm) return;
    const product = orderForm.product ? orderForm.product.value : 'Classic Chocolate Chip Cookies';
    const qty = Math.max(parseInt(orderForm.quantity ? orderForm.quantity.value : '1', 10) || 1, 1);
    const pickup = orderForm.fulfillment ? orderForm.fulfillment.value : 'Pickup';
    const total = (prices[product] || 0) * qty;
    if (summaryProduct) summaryProduct.textContent = product || 'Select a product';
    if (summaryQty) summaryQty.textContent = String(qty);
    if (summaryPickup) summaryPickup.textContent = pickup || 'Pickup';
    if (summaryTotal) summaryTotal.textContent = '₱' + total.toLocaleString('en-PH');
  }
  if (orderForm) {
    ['change', 'input'].forEach(function (eventName) { orderForm.addEventListener(eventName, updateSummary); });
    updateSummary();
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }
      const data = Object.fromEntries(new FormData(orderForm).entries());
      data.total = summaryTotal ? summaryTotal.textContent : '';
      localStorage.setItem('delishOrder', JSON.stringify(data));
      window.location.href = 'final-shit.html';
    });
  }

  const reviewBox = document.querySelector('[data-order-review]');
  if (reviewBox) {
    const saved = localStorage.getItem('delishOrder');
    if (saved) {
      try {
        const order = JSON.parse(saved);
        reviewBox.innerHTML = `
          <div class="summary-line"><span>Name</span><strong>${escapeHtml(order.fullName || 'Customer')}</strong></div>
          <div class="summary-line"><span>Product</span><strong>${escapeHtml(order.product || '')}</strong></div>
          <div class="summary-line"><span>Quantity</span><strong>${escapeHtml(order.quantity || '1')}</strong></div>
          <div class="summary-line"><span>Fulfillment</span><strong>${escapeHtml(order.fulfillment || 'Pickup')}</strong></div>
          <div class="summary-line"><span>Contact</span><strong>${escapeHtml(order.phone || '')}</strong></div>
          <div class="summary-line"><span>Total</span><strong>${escapeHtml(order.total || '')}</strong></div>`;
      } catch (error) {
        reviewBox.textContent = 'Your order summary is ready.';
      }
    }
  }

  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      showToast('Login preview only. Connect this form to your backend when ready.');
    });
  }

  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char];
    });
  }
})();

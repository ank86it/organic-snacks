/*
  ORGANIC SNACKS STORE
  Stage 17a - Owner Panel JavaScript (with Order Search & Filters)
*/

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

const ADMIN_SESSION_KEY = "organicSnacksAdminPassword";

let currentAdminPassword = "";
let adminOrdersData = [];
let adminProductsData = [];

document.addEventListener("DOMContentLoaded", function () {
  setupAdminLogin();
  setupTabSwitching();
  setupOrderFilterEvents();

  // Auto-login if session exists
  const savedPass = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (savedPass) {
    currentAdminPassword = savedPass;
    fetchAdminDashboardData();
  }
});

/* LOGIN LOGIC */
function setupAdminLogin() {
  const loginForm = document.getElementById("admin-login-form");
  const logoutBtn = document.getElementById("admin-logout-button");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const passInput = document.getElementById("admin-password-input").value.trim();
      if (!passInput) return;

      verifyAndLogin(passInput);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      currentAdminPassword = "";
      location.reload();
    });
  }
}

async function verifyAndLogin(password) {
  showLoginMsg("Verifying password...");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "admin-login", password: password })
    });

    const rawText = await res.text();

    if (rawText.trim().startsWith("<")) {
      showLoginMsg("Google Server Error. Please refresh and try again.");
      return;
    }

    const data = JSON.parse(rawText);

    if (data.success) {
      currentAdminPassword = password;
      sessionStorage.setItem(ADMIN_SESSION_KEY, password);
      showLoginMsg("");
      fetchAdminDashboardData();
    } else {
      showLoginMsg(data.message || "Invalid Password.");
    }
  } catch (e) {
    showLoginMsg("Login error: " + e.message);
  }
}

/* FETCH ALL DATA */
async function fetchAdminDashboardData() {
  document.getElementById("admin-login-section").style.display = "none";
  document.getElementById("admin-dashboard-section").style.display = "block";
  document.getElementById("admin-logout-button").style.display = "inline-block";

  showOrdersMsg("Loading order and inventory records from Google Sheets...");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "admin-get-data", password: currentAdminPassword })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Session expired or password incorrect.");
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      location.reload();
      return;
    }

    adminOrdersData = data.orders || [];
    adminProductsData = data.products || [];

    renderStats();
    renderOrdersTable();
    renderStockTable();

    showOrdersMsg("");
  } catch (e) {
    showOrdersMsg("Error fetching admin data: " + e.message);
  }
}

/* RENDER STATS */
function renderStats() {
  document.getElementById("stat-total-orders").textContent = adminOrdersData.length;

  const pendingCount = adminOrdersData.filter(
    o => String(o["Payment Status"]).toLowerCase().includes("pending")
  ).length;

  document.getElementById("stat-pending-payments").textContent = pendingCount;
  document.getElementById("stat-total-products").textContent = adminProductsData.length;
}

/* SETUP ORDER FILTER EVENT LISTENERS */
function setupOrderFilterEvents() {
  const searchInput = document.getElementById("admin-order-search");
  const orderStatusFilter = document.getElementById("admin-order-status-filter");
  const paymentStatusFilter = document.getElementById("admin-payment-status-filter");

  if (searchInput) searchInput.addEventListener("input", renderOrdersTable);
  if (orderStatusFilter) orderStatusFilter.addEventListener("change", renderOrdersTable);
  if (paymentStatusFilter) paymentStatusFilter.addEventListener("change", renderOrdersTable);
}

/* RENDER ORDERS TABLE (WITH FILTERING) */
function renderOrdersTable() {
  const tbody = document.getElementById("admin-orders-tbody");
  tbody.innerHTML = "";

  const searchVal = (document.getElementById("admin-order-search")?.value || "").toLowerCase().trim();
  const orderStatusVal = (document.getElementById("admin-order-status-filter")?.value || "all").toLowerCase();
  const payStatusVal = (document.getElementById("admin-payment-status-filter")?.value || "all").toLowerCase();

  // Filter Orders
  const filteredOrders = adminOrdersData.filter(order => {
    const orderId = String(order["Order ID"] || "").toLowerCase();
    const name = String(order["Customer Name"] || "").toLowerCase();
    const phone = String(order["Phone"] || "").toLowerCase();
    const items = String(order["Product Details"] || "").toLowerCase();

    const matchesSearch =
      !searchVal ||
      orderId.includes(searchVal) ||
      name.includes(searchVal) ||
      phone.includes(searchVal) ||
      items.includes(searchVal);

    const orderStatus = String(order["Order Status"] || "").toLowerCase();
    const matchesOrderStatus =
      orderStatusVal === "all" || orderStatus === orderStatusVal;

    const payStatus = String(order["Payment Status"] || "").toLowerCase();
    const matchesPayStatus =
      payStatusVal === "all" || payStatus === payStatusVal;

    return matchesSearch && matchesOrderStatus && matchesPayStatus;
  });

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">No matching orders found.</td></tr>`;
    return;
  }

  filteredOrders.forEach(order => {
    const tr = document.createElement("tr");

    const orderId = order["Order ID"] || "";
    const date = formatDate(order["Order Date"]);
    const customer = `${order["Customer Name"] || ""}<br><small>${order["Phone"] || ""}</small><br><small style="color:#666;">${order["Address"] || ""}</small>`;
    const items = order["Product Details"] || "";
    const total = order["Total Amount"] || 0;
    const paymentMethod = order["Payment Method"] || "N/A";
    const paymentStatus = order["Payment Status"] || "Payment Pending";
    const orderStatus = order["Order Status"] || "Order Placed";
    const trackingNo = order["Tracking Number"] || "";

    tr.innerHTML = `
      <td><strong>${escapeHTML(orderId)}</strong><br><small>${date}</small></td>
      <td>${customer}</td>
      <td><small>${escapeHTML(items)}</small></td>
      <td><strong>₹${formatMoney(total)}</strong><br><small>(${paymentMethod})</small></td>
      <td>
        <select class="admin-select payment-select">
          <option value="Payment Pending" ${paymentStatus === 'Payment Pending' ? 'selected' : ''}>Payment Pending</option>
          <option value="Payment Confirmed" ${paymentStatus === 'Payment Confirmed' ? 'selected' : ''}>Payment Confirmed</option>
          <option value="Failed" ${paymentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
          <option value="Refunded" ${paymentStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
        </select>
      </td>
      <td>
        <select class="admin-select status-select">
          <option value="Order Placed" ${orderStatus === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
          <option value="Payment Confirmed" ${orderStatus === 'Payment Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Preparing" ${orderStatus === 'Preparing' ? 'selected' : ''}>Preparing</option>
          <option value="Packed" ${orderStatus === 'Packed' ? 'selected' : ''}>Packed</option>
          <option value="Shipped" ${orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Out for Delivery" ${orderStatus === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
          <option value="Delivered" ${orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <input type="text" class="admin-input tracking-input" value="${escapeAttribute(trackingNo)}" placeholder="Courier ID">
      </td>
      <td>
        <button class="primary-button save-order-btn" style="padding:6px 12px; font-size:0.8rem;">Save</button>
      </td>
    `;

    const saveBtn = tr.querySelector(".save-order-btn");
    saveBtn.addEventListener("click", function () {
      const newPayStatus = tr.querySelector(".payment-select").value;
      const newOrderStatus = tr.querySelector(".status-select").value;
      const newTracking = tr.querySelector(".tracking-input").value.trim();

      saveOrderUpdate(orderId, newPayStatus, newOrderStatus, newTracking, saveBtn);
    });

    tbody.appendChild(tr);
  });
}

async function saveOrderUpdate(orderId, payStatus, orderStatus, tracking, buttonEl) {
  buttonEl.disabled = true;
  buttonEl.textContent = "Saving...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "admin-update-order",
        password: currentAdminPassword,
        orderId: orderId,
        paymentStatus: payStatus,
        orderStatus: orderStatus,
        trackingNumber: tracking
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Order " + orderId + " updated successfully!");
      // Update local array data
      const localOrd = adminOrdersData.find(o => String(o["Order ID"]) === String(orderId));
      if (localOrd) {
        localOrd["Payment Status"] = payStatus;
        localOrd["Order Status"] = orderStatus;
        localOrd["Tracking Number"] = tracking;
      }
      renderStats();
    } else {
      alert("Error: " + data.message);
    }
  } catch (e) {
    alert("Update failed: " + e.message);
  } finally {
    buttonEl.disabled = false;
    buttonEl.textContent = "Save";
  }
}

/* RENDER STOCK TABLE */
function renderStockTable() {
  const tbody = document.getElementById("admin-stock-tbody");
  tbody.innerHTML = "";

  adminProductsData.forEach(prod => {
    const tr = document.createElement("tr");

    const id = prod["Product ID"] || "";
    const name = prod["Product Name"] || "";
    const category = prod["Category"] || "";
    const price = prod["Price"] || 0;
    const fatUsed = prod["Oil/Ghee/Butter Used"] || "N/A";
    const currentStock = prod["Stock"] !== undefined ? prod["Stock"] : 0;

    tr.innerHTML = `
      <td><strong>${escapeHTML(id)}</strong></td>
      <td>${escapeHTML(name)}</td>
      <td>${escapeHTML(category)}</td>
      <td>₹${formatMoney(price)}</td>
      <td>${escapeHTML(fatUsed)}</td>
      <td><span class="stock-badge">${currentStock}</span></td>
      <td>
        <div style="display:flex; gap:6px;">
          <input type="number" class="admin-input stock-input" value="${currentStock}" min="0" style="width:70px;">
          <button class="secondary-button save-stock-btn" style="padding:6px 12px; font-size:0.8rem;">Update</button>
        </div>
      </td>
    `;

    const saveStockBtn = tr.querySelector(".save-stock-btn");
    saveStockBtn.addEventListener("click", function () {
      const newStockVal = tr.querySelector(".stock-input").value;
      saveStockUpdate(id, newStockVal, saveStockBtn);
    });

    tbody.appendChild(tr);
  });
}

async function saveStockUpdate(productId, newStock, buttonEl) {
  buttonEl.disabled = true;
  buttonEl.textContent = "Updating...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "admin-update-stock",
        password: currentAdminPassword,
        productId: productId,
        newStock: newStock
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Stock for " + productId + " updated to " + newStock + "!");
      fetchAdminDashboardData();
    } else {
      alert("Error: " + data.message);
    }
  } catch (e) {
    alert("Stock update failed: " + e.message);
  } finally {
    buttonEl.disabled = false;
    buttonEl.textContent = "Update";
  }
}

/* TAB SWITCHING */
function setupTabSwitching() {
  const tabOrdersBtn = document.getElementById("tab-orders-btn");
  const tabInventoryBtn = document.getElementById("tab-inventory-btn");
  const tabOrdersContent = document.getElementById("tab-orders-content");
  const tabInventoryContent = document.getElementById("tab-inventory-content");
  const refreshBtn = document.getElementById("refresh-orders-btn");

  if (tabOrdersBtn && tabInventoryBtn) {
    tabOrdersBtn.addEventListener("click", function () {
      tabOrdersBtn.classList.add("active");
      tabInventoryBtn.classList.remove("active");
      tabOrdersContent.style.display = "block";
      tabInventoryContent.style.display = "none";
    });

    tabInventoryBtn.addEventListener("click", function () {
      tabInventoryBtn.classList.add("active");
      tabOrdersBtn.classList.remove("active");
      tabInventoryContent.style.display = "block";
      tabOrdersContent.style.display = "none";
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      fetchAdminDashboardData();
    });
  }
}

/* UTILS */
function showLoginMsg(msg) {
  const el = document.getElementById("admin-login-message");
  if (el) el.textContent = msg;
}

function showOrdersMsg(msg) {
  const el = document.getElementById("admin-orders-message");
  if (el) el.textContent = msg;
}

function formatDate(raw) {
  if (!raw) return "N/A";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return String(raw);
  }
}

function formatMoney(val) {
  return (Number(val) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function escapeHTML(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttribute(str) {
  return escapeHTML(str);
}

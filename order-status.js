/*
  ORGANIC SNACKS STORE
  Stage 17 - Order Tracking & Status
  
  Connects to Google Apps Script via JSONP
  Action: action=order-status&orderId=...&phone=...
*/

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

const CART_STORAGE_KEY = "organicSnacksCart";

let trackingForm;
let trackingMessage;
let trackingResultsSection;
let trackingDetailsBox;
let trackingCartCount;

document.addEventListener("DOMContentLoaded", function () {
  trackingForm = document.getElementById("tracking-form");
  trackingMessage = document.getElementById("tracking-message");
  trackingResultsSection = document.getElementById("tracking-results-section");
  trackingDetailsBox = document.getElementById("tracking-details-box");
  trackingCartCount = document.getElementById("tracking-cart-count");

  setupMobileMenu();
  updateTrackingCartCount();
  setupTrackingForm();
  checkUrlParams();
});

function setupMobileMenu() {
  const menuButton = document.getElementById("menu-button");
  const navLinks = document.getElementById("nav-links");

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

function updateTrackingCartCount() {
  if (!trackingCartCount) return;
  try {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    trackingCartCount.textContent = total;
  } catch (e) {
    trackingCartCount.textContent = 0;
  }
}

function setupTrackingForm() {
  if (!trackingForm) return;

  trackingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderId = document.getElementById("tracking-order-id").value.trim();
    const phone = document.getElementById("tracking-phone").value.trim();

    if (!orderId) {
      showTrackingMessage("Please enter your Order ID.");
      return;
    }

    if (!phone) {
      showTrackingMessage("Please enter your Phone Number.");
      return;
    }

    fetchOrderStatus(orderId, phone);
  });
}

// Auto-fill from URL parameters if accessed like order-status.html?order=ORD-2025-123&phone=9999999999
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order") || params.get("orderId");
  const phone = params.get("phone");

  if (orderId) {
    document.getElementById("tracking-order-id").value = orderId;
  }
  if (phone) {
    document.getElementById("tracking-phone").value = phone;
  }

  if (orderId && phone) {
    fetchOrderStatus(orderId, phone);
  }
}

function fetchOrderStatus(orderId, phone) {
  showTrackingMessage("Searching for order " + orderId + "...");

  if (trackingResultsSection) {
    trackingResultsSection.hidden = true;
  }

  const callbackName = "organicTrackingCallback_" + Date.now();

  window[callbackName] = function (data) {
    try {
      if (!data || data.success !== true || !data.order) {
        throw new Error(data && data.message ? data.message : "Order not found. Please verify your details.");
      }

      renderOrderDetails(data.order);
      showTrackingMessage("");
    } catch (error) {
      console.error("Tracking Error:", error);
      showTrackingMessage(error.message);
    } finally {
      const script = document.getElementById(callbackName);
      if (script) script.remove();
      delete window[callbackName];
    }
  };

  const script = document.createElement("script");
  script.id = callbackName;
  script.async = true;
  script.src =
    API_URL +
    "?action=order-status" +
    "&orderId=" + encodeURIComponent(orderId) +
    "&phone=" + encodeURIComponent(phone) +
    "&callback=" + encodeURIComponent(callbackName) +
    "&v=" + Date.now();

  script.onerror = function () {
    showTrackingMessage("Unable to connect to order tracking service. Please try again.");
    script.remove();
    delete window[callbackName];
  };

  document.body.appendChild(script);
}

function renderOrderDetails(order) {
  if (!trackingDetailsBox || !trackingResultsSection) return;

  const orderId = order["Order ID"] || "";
  const orderDate = formatDate(order["Order Date"]);
  const customerName = order["Customer Name"] || "";
  const productDetails = order["Product Details"] || "";
  const totalAmount = order["Total Amount"] || 0;
  const paymentMethod = order["Payment Method"] || "Not specified";
  const paymentStatus = order["Payment Status"] || "Payment Pending";
  const orderStatus = order["Order Status"] || "Order Placed";
  const trackingNumber = order["Tracking Number"] || "Not dispatched yet";

  const progressPercentage = getProgressPercentage(orderStatus);

  trackingDetailsBox.innerHTML = `
    <div class="tracking-summary-card">
      
      <div class="tracking-header-row">
        <div>
          <span class="eyebrow">ORDER RECORD</span>
          <h3>${escapeHTML(orderId)}</h3>
          <p class="order-date-text">Placed on ${escapeHTML(orderDate)}</p>
        </div>
        <span class="status-badge ${getStatusBadgeClass(orderStatus)}">
          ${escapeHTML(orderStatus)}
        </span>
      </div>

      <!-- VISUAL PROGRESS TIMELINE -->
      <div class="tracking-timeline-wrapper">
        <div class="timeline-bar-bg">
          <div class="timeline-bar-fill" style="width: ${progressPercentage}%;"></div>
        </div>

        <div class="timeline-steps">
          <div class="timeline-step ${isStepActive(orderStatus, 1) ? 'active' : ''}">
            <div class="step-circle">1</div>
            <span>Placed</span>
          </div>
          <div class="timeline-step ${isStepActive(orderStatus, 2) ? 'active' : ''}">
            <div class="step-circle">2</div>
            <span>Confirmed</span>
          </div>
          <div class="timeline-step ${isStepActive(orderStatus, 3) ? 'active' : ''}">
            <div class="step-circle">3</div>
            <span>Preparing</span>
          </div>
          <div class="timeline-step ${isStepActive(orderStatus, 4) ? 'active' : ''}">
            <div class="step-circle">4</div>
            <span>Shipped</span>
          </div>
          <div class="timeline-step ${isStepActive(orderStatus, 5) ? 'active' : ''}">
            <div class="step-circle">5</div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      <!-- ORDER BREAKDOWN -->
      <div class="tracking-data-grid">
        <div class="tracking-data-item">
          <strong>Customer:</strong>
          <span>${escapeHTML(customerName)}</span>
        </div>

        <div class="tracking-data-item">
          <strong>Payment Method:</strong>
          <span>${escapeHTML(paymentMethod)}</span>
        </div>

        <div class="tracking-data-item">
          <strong>Payment Status:</strong>
          <span class="payment-status-tag">${escapeHTML(paymentStatus)}</span>
        </div>

        <div class="tracking-data-item">
          <strong>Courier Tracking #:</strong>
          <span>${escapeHTML(trackingNumber)}</span>
        </div>
      </div>

      <div class="tracking-products-box">
        <strong>Items Ordered:</strong>
        <p>${escapeHTML(productDetails)}</p>
      </div>

      <div class="tracking-total-row">
        <span>Total Paid/Due:</span>
        <strong>₹${formatMoney(totalAmount)}</strong>
      </div>

    </div>
  `;

  trackingResultsSection.hidden = false;
  trackingResultsSection.scrollIntoView({ behavior: "smooth" });
}

function getProgressPercentage(status) {
  const s = String(status).toLowerCase();
  if (s.includes("delivered")) return 100;
  if (s.includes("shipped") || s.includes("out for delivery")) return 75;
  if (s.includes("preparing") || s.includes("packed")) return 50;
  if (s.includes("confirmed") || s.includes("accepted")) return 25;
  return 10; // Order Placed
}

function isStepActive(status, stepIndex) {
  const currentPct = getProgressPercentage(status);
  const thresholds = [0, 10, 25, 50, 75, 100];
  return currentPct >= thresholds[stepIndex];
}

function getStatusBadgeClass(status) {
  const s = String(status).toLowerCase();
  if (s.includes("delivered")) return "availability-in";
  if (s.includes("cancelled")) return "availability-out";
  if (s.includes("shipped")) return "availability-limited";
  return "availability-special";
}

function showTrackingMessage(msg) {
  if (trackingMessage) trackingMessage.textContent = msg;
}

function formatDate(rawDate) {
  if (!rawDate) return "N/A";
  try {
    const d = new Date(rawDate);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return String(rawDate);
  }
}

function formatMoney(val) {
  return (Number(val) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(str) {
  return escapeHTML(str);
}

/*
  ORGANIC SNACKS STORE
  Stage 13/14 - Checkout, Dynamic UPI Payment & Order Submission
*/

const CHECKOUT_CART_KEY = "organicSnacksCart";
const CHECKOUT_DETAILS_KEY = "organicSnacksCheckoutDetails";
const CHECKOUT_API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

// STORE UPI DETAILS
const STORE_UPI_ID = "ank86it@okicici";
const STORE_NAME = "Organic Snacks Store";

let checkoutForm;
let checkoutMessage;
let checkoutItemsContainer;
let checkoutCartCount;
let checkoutQuantity;
let checkoutSubtotal;
let checkoutTotal;

let paymentOptions;
let upiPaymentBox;
let paymentLinkBox;
let codPaymentBox;

document.addEventListener("DOMContentLoaded", function () {
  checkoutForm = document.getElementById("checkout-form");
  checkoutMessage = document.getElementById("checkout-message");
  checkoutItemsContainer = document.getElementById("checkout-items-container");
  checkoutCartCount = document.getElementById("checkout-cart-count");
  checkoutQuantity = document.getElementById("checkout-quantity");
  checkoutSubtotal = document.getElementById("checkout-subtotal");
  checkoutTotal = document.getElementById("checkout-total");

  paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  upiPaymentBox = document.getElementById("upi-payment-box");
  paymentLinkBox = document.getElementById("payment-link-box");
  codPaymentBox = document.getElementById("cod-payment-box");

  setupCheckoutMenu();
  setupPaymentOptions();
  setupCheckoutForm();
  renderCheckout();
});

function setupCheckoutMenu() {
  const menuButton = document.getElementById("menu-button");
  const navLinks = document.getElementById("nav-links");

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupPaymentOptions() {
  if (!paymentOptions || paymentOptions.length === 0) return;

  paymentOptions.forEach(function (option) {
    option.addEventListener("change", function () {
      updatePaymentDisplay(option.value);
    });
  });
}

function updatePaymentDisplay(method) {
  if (upiPaymentBox) upiPaymentBox.hidden = method !== "UPI";
  if (paymentLinkBox) paymentLinkBox.hidden = method !== "Payment Link";
  if (codPaymentBox) codPaymentBox.hidden = method !== "Cash on Delivery";
}

function setupCheckoutForm() {
  if (!checkoutForm) return;
  checkoutForm.addEventListener("submit", handleCheckoutSubmit);
}

function getCheckoutCart() {
  try {
    const savedCart = localStorage.getItem(CHECKOUT_CART_KEY);
    if (!savedCart) return [];
    const cart = JSON.parse(savedCart);
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function renderCheckout() {
  const cart = getCheckoutCart();
  updateCheckoutCartCount(cart);

  if (!cart || cart.length === 0) {
    showCheckoutMessage("Your cart is empty. Please add a product first.");
    disableCheckoutForm();
    updateCheckoutSummary([]);
    return;
  }

  enableCheckoutForm();
  renderCheckoutItems(cart);
  updateCheckoutSummary(cart);
}

function renderCheckoutItems(cart) {
  if (!checkoutItemsContainer) return;
  checkoutItemsContainer.innerHTML = "";

  cart.forEach(function (item) {
    const itemElement = document.createElement("div");
    itemElement.className = "checkout-item";

    const productName = item.productName || "Organic Snack";
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const imageUrl = item.imageUrl || "https://placehold.co/180x140/e6f8ed/114b35?text=Snack";
    const itemTotal = price * quantity;

    itemElement.innerHTML = `
      <img class="checkout-item-image" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(productName)}" loading="lazy">
      <div class="checkout-item-info">
        <strong>${escapeHTML(productName)}</strong>
        <span>Quantity: ${quantity}</span>
        <span>₹${formatMoney(itemTotal)}</span>
      </div>
    `;

    checkoutItemsContainer.appendChild(itemElement);
  });
}

function updateCheckoutSummary(cart) {
  let totalQuantity = 0;
  let subtotal = 0;

  cart.forEach(function (item) {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    totalQuantity += quantity;
    subtotal += price * quantity;
  });

  if (checkoutQuantity) checkoutQuantity.textContent = totalQuantity;
  if (checkoutSubtotal) checkoutSubtotal.textContent = "₹" + formatMoney(subtotal);
  if (checkoutTotal) checkoutTotal.textContent = "₹" + formatMoney(subtotal);

  // Generate QR Code & GPay Button Link with Cart Subtotal
  updateDynamicUpiPayment(subtotal);
}

function updateDynamicUpiPayment(amount) {
  const qrImg = document.getElementById("upi-qr-image");
  const payBtn = document.getElementById("upi-pay-button");
  const qrAmtText = document.getElementById("upi-qr-amount-text");

  const finalAmount = Number(amount) || 0;

  if (qrAmtText) {
    qrAmtText.textContent = "₹" + formatMoney(finalAmount);
  }

  // UPI deep link with exact amount pre-filled
  let upiUri = `upi://pay?pa=${encodeURIComponent(STORE_UPI_ID)}&pn=${encodeURIComponent(STORE_NAME)}&cu=INR`;
  if (finalAmount > 0) {
    upiUri += `&am=${finalAmount}`;
  }

  if (payBtn) {
    payBtn.href = upiUri;
  }

  if (qrImg) {
    // Generate high-resolution scannable QR Code using QR Server API
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x220&data=${encodeURIComponent(upiUri)}`;
  }
}

function updateCheckoutCartCount(cart) {
  if (!checkoutCartCount) return;
  const totalQuantity = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  checkoutCartCount.textContent = totalQuantity;
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();

  const cart = getCheckoutCart();
  if (!cart || cart.length === 0) {
    showCheckoutMessage("Your cart is empty. Please add a product first.");
    return;
  }

  const formData = new FormData(checkoutForm);

  const customerDetails = {
    customerName: String(formData.get("customerName") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    address: [formData.get("address"), formData.get("city"), formData.get("state"), formData.get("postalCode")].filter(Boolean).join(", "),
    notes: String(formData.get("notes") || "").trim(),
    paymentMethod: String(formData.get("paymentMethod") || "").trim(),
    paymentReference: String(formData.get("paymentReference") || "").trim()
  };

  const validationError = validateCheckoutDetails(customerDetails);
  if (validationError) {
    showCheckoutMessage(validationError);
    return;
  }

  const orderItems = cart.map(item => ({
    productId: item.productId,
    quantity: Number(item.quantity) || 1,
    customNotes: item.customNotes || "",
    preferredDate: item.preferredDate || ""
  }));

  const orderData = {
    action: "create-order",
    customerName: customerDetails.customerName,
    phone: customerDetails.phone,
    email: customerDetails.email,
    address: customerDetails.address,
    paymentMethod: customerDetails.paymentMethod,
    paymentReference: customerDetails.paymentReference,
    notes: customerDetails.notes,
    items: orderItems
  };

  const submitButton = checkoutForm.querySelector(".checkout-submit-button");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting Order...";
  }

  showCheckoutMessage("Checking stock and submitting your order...");

  try {
    const response = await fetch(CHECKOUT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!result || result.success !== true) {
      throw new Error(result && result.message ? result.message : "Order creation failed.");
    }

    localStorage.removeItem(CHECKOUT_CART_KEY);
    showOrderSuccess(result);
  } catch (error) {
    console.error("Order submission error:", error);
    showCheckoutMessage("Order submission failed: " + error.message);

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Review Payment and Order";
    }
  }
}

function validateCheckoutDetails(details) {
  if (!details.customerName) return "Please enter your full name.";
  if (!details.phone) return "Please enter your phone number.";
  if (details.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
  if (!details.address) return "Please enter your delivery address.";
  if (!details.paymentMethod) return "Please select a payment method.";

  // Enforce UPI Transaction Reference for UPI payments
  if (details.paymentMethod === "UPI" && !details.paymentReference) {
    return "Please complete the UPI payment and enter your Transaction Reference Number / UTR.";
  }

  return "";
}


function showOrderSuccess(result) {
  if (!checkoutForm) return;

  checkoutForm.innerHTML = `
    <div class="order-success-box">
      <div class="order-success-icon">✓</div>
      <h2>Order Submitted Successfully</h2>
      <p>Thank you for your order!</p>
      <div class="order-success-details">
        <p><strong>Order ID:</strong> ${escapeHTML(result.orderId)}</p>
        <p><strong>Total Amount:</strong> ₹${formatMoney(result.totalAmount)}</p>
        <p><strong>Payment Status:</strong> ${escapeHTML(result.paymentStatus)}</p>
        <p><strong>Order Status:</strong> ${escapeHTML(result.orderStatus)}</p>
      </div>
      <p class="order-success-note">Your payment will be verified by the store owner.</p>
      <a class="primary-button" href="index.html">Return to Home</a>
    </div>
  `;

  showCheckoutMessage("");
}

function disableCheckoutForm() {
  if (!checkoutForm) return;
  checkoutForm.querySelectorAll("input, textarea, select, button").forEach(c => c.disabled = true);
}

function enableCheckoutForm() {
  if (!checkoutForm) return;
  checkoutForm.querySelectorAll("input, textarea, select, button").forEach(c => c.disabled = false);
}

function showCheckoutMessage(msg) {
  if (checkoutMessage) checkoutMessage.textContent = msg;
}

function formatMoney(val) {
  return (Number(val) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function escapeHTML(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttribute(str) {
  return escapeHTML(str);
}


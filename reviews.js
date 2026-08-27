/*
  ORGANIC SNACKS STORE
  Stage 18 - Customer Reviews Page JavaScript
*/

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

const CART_STORAGE_KEY = "organicSnacksCart";

let reviewForm;
let reviewMsg;
let approvedContainer;
let approvedMsg;
let reviewsCartCount;

document.addEventListener("DOMContentLoaded", function () {
  reviewForm = document.getElementById("review-submission-form");
  reviewMsg = document.getElementById("review-form-message");
  approvedContainer = document.getElementById("approved-reviews-container");
  approvedMsg = document.getElementById("approved-reviews-message");
  reviewsCartCount = document.getElementById("reviews-cart-count");

  setupMobileMenu();
  updateCartBadge();
  setupReviewForm();
  loadApprovedReviews();
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

function updateCartBadge() {
  if (!reviewsCartCount) return;
  try {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    reviewsCartCount.textContent = total;
  } catch (e) {
    reviewsCartCount.textContent = 0;
  }
}

/* LOAD APPROVED REVIEWS VIA JSONP */
function loadApprovedReviews() {
  showApprovedMsg("Loading verified reviews...");

  const callbackName = "organicApprovedReviews_" + Date.now();

  window[callbackName] = function (data) {
    try {
      if (!data || data.success !== true) {
        throw new Error(data && data.message ? data.message : "Unable to load reviews.");
      }
      renderApprovedReviews(data.reviews || []);
      showApprovedMsg("");
    } catch (e) {
      console.error(e);
      showApprovedMsg("Error loading reviews: " + e.message);
    } finally {
      const script = document.getElementById(callbackName);
      if (script) script.remove();
      delete window[callbackName];
    }
  };

  const script = document.createElement("script");
  script.id = callbackName;
  script.async = true;
  script.src = API_URL + "?action=reviews&callback=" + encodeURIComponent(callbackName) + "&v=" + Date.now();

  script.onerror = function () {
    showApprovedMsg("Unable to connect to reviews service.");
    script.remove();
    delete window[callbackName];
  };

  document.body.appendChild(script);
}

function renderApprovedReviews(reviews) {
  if (!approvedContainer) return;
  approvedContainer.innerHTML = "";

  if (!reviews || reviews.length === 0) {
    showApprovedMsg("No approved reviews yet. Be the first to post feedback for your order!");
    return;
  }

  reviews.forEach(rev => {
    const card = document.createElement("article");
    card.className = "article-card";

    const name = rev["Customer Name"] || "Verified Customer";
    const rating = Number(rev["Rating"]) || 5;
    const text = rev["Review Text"] || "";
    const date = formatDate(rev["Review Date"]);
    const stars = "⭐".repeat(rating);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <strong>${escapeHTML(name)}</strong>
        <span style="font-size:1.1rem;">${stars}</span>
      </div>
      <p style="margin:0 0 10px; color:var(--text);">${escapeHTML(text)}</p>
      <small style="color:var(--muted);">${date}</small>
    `;

    approvedContainer.appendChild(card);
  });
}

/* SUBMIT REVIEW */
function setupReviewForm() {
  if (!reviewForm) return;

  reviewForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const orderId = document.getElementById("review-order-id").value.trim();
    const customerName = document.getElementById("review-customer-name").value.trim();
    const rating = document.getElementById("review-rating").value;
    const reviewText = document.getElementById("review-text").value.trim();
    const submitBtn = document.getElementById("review-submit-btn");

    if (!orderId || !customerName || !reviewText) {
      showFormMsg("Please complete all required fields.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting Review...";
    showFormMsg("Verifying Order ID and saving feedback...");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "save-review",
          orderId: orderId,
          customerName: customerName,
          rating: rating,
          reviewText: reviewText
        })
      });

      const data = await res.json();

      if (data.success) {
        showFormMsg(data.message);
        reviewForm.reset();
      } else {
        showFormMsg("Error: " + data.message);
      }
    } catch (err) {
      showFormMsg("Submission error: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Review for Approval";
    }
  });
}

function showFormMsg(msg) {
  if (reviewMsg) reviewMsg.textContent = msg;
}

function showApprovedMsg(msg) {
  if (approvedMsg) approvedMsg.textContent = msg;
}

function formatDate(raw) {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch (e) {
    return String(raw);
  }
}

function escapeHTML(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

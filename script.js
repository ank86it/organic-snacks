const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

const productContainer =
  document.getElementById("product-container");

const productMessage =
  document.getElementById("product-message");


document.addEventListener("DOMContentLoaded", function() {
  loadProducts();
});


async function loadProducts() {
  try {
    showMessage("Loading products...");

    const response = await fetch(
      API_URL + "?action=products"
    );

    if (!response.ok) {
      throw new Error("Unable to connect to the product service.");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Unable to load products."
      );
    }

    displayProducts(data.products);

  } catch (error) {
    showMessage(
      "Products could not be loaded. Please try again later."
    );

    console.error(error);
  }
}


function displayProducts(products) {
  productContainer.innerHTML = "";

  if (!products || products.length === 0) {
    showMessage("No products are currently available.");
    return;
  }

  products.forEach(function(product) {
    const card = createProductCard(product);
    productContainer.appendChild(card);
  });

  productMessage.textContent =
    products.length + " products available";
}


function createProductCard(product) {
  const card = document.createElement("article");

  card.className = "product-card";

  const imageUrl =
    product["Image URL"] ||
    "https://placehold.co/600x400/eaf6ee/174d35?text=Organic+Snack";

  const productName =
    product["Product Name"] || "Organic Snack";

  const category =
    product["Category"] || "";

  const description =
    product["Description"] || "";

  const ingredients =
    product["Ingredients"] || "Ingredients not added yet.";

  const benefits =
    product["Benefits"] || "Information coming soon.";

  const preparation =
    product["Oil/Ghee/Butter Used"] ||
    "Preparation information coming soon.";

  const weight =
    product["Weight"] || "";

  const price =
    product["Price"] || 0;

  const availability =
    product["Availability"] || "Check availability";

  const specialOrder =
    String(product["Special Order"]).toLowerCase() === "yes";

  const availabilityClass =
    getAvailabilityClass(availability);

  card.innerHTML = `
    <img
      class="product-image"
      src="${escapeAttribute(imageUrl)}"
      alt="${escapeAttribute(productName)}"
      loading="lazy"
    >

    <div class="product-card-content">
      <span class="product-category">
        ${escapeHTML(category)}
      </span>

      <h3>
        ${escapeHTML(productName)}
      </h3>

      <p class="product-description">
        ${escapeHTML(description)}
      </p>

      <div class="product-information">
        <p>
          <strong>Ingredients:</strong>
          ${escapeHTML(ingredients)}
        </p>

        <p>
          <strong>Benefits:</strong>
          ${escapeHTML(benefits)}
        </p>

        <p>
          <strong>Preparation:</strong>
          ${escapeHTML(preparation)}
        </p>
      </div>

      <div class="product-meta">
        <span>${escapeHTML(String(weight))}</span>

        <strong>
          ₹${escapeHTML(String(price))}
        </strong>
      </div>

      <span class="availability ${availabilityClass}">
        ${escapeHTML(availability)}
      </span>

      ${
        specialOrder
          ? `
            <span class="special-order-label">
              Special Order Available
            </span>
          `
          : ""
      }

      <button
        class="details-button"
        type="button"
        onclick="showProductMessage('${escapeAttribute(productName)}')"
      >
        View Information
      </button>
    </div>
  `;

  return card;
}


function getAvailabilityClass(availability) {
  const value =
    String(availability).toLowerCase();

  if (value.includes("out")) {
    return "availability-out";
  }

  if (value.includes("limited")) {
    return "availability-limited";
  }

  if (value.includes("special")) {
    return "availability-special";
  }

  return "availability-in";
}


function showProductMessage(productName) {
  alert(
    productName +
    " details are displayed on this page."
  );
}


function showMessage(message) {
  if (productMessage) {
    productMessage.textContent = message;
  }
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
  return escapeHTML(value);
}

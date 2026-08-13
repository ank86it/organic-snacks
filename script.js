/*
  ORGANIC SNACKS STORE
  Product display and filtering script

  This file connects the GitHub website to:
  Google Apps Script → Google Sheets
*/


/* ==================================================
   1. APPS SCRIPT WEB APP URL
================================================== */

const API_URL =
  "PASTE-YOUR-COMPLETE-APPS-SCRIPT-WEB-APP-URL-HERE";


/* ==================================================
   2. PAGE ELEMENTS
================================================== */

let productContainer;
let productMessage;
let productSearch;
let categoryFilter;


/* ==================================================
   3. START WEBSITE
================================================== */

document.addEventListener("DOMContentLoaded", function() {
  productContainer =
    document.getElementById("product-container");

  productMessage =
    document.getElementById("product-message");

  productSearch =
    document.getElementById("product-search");

  categoryFilter =
    document.getElementById("category-filter");

  setupMenu();
  setupProductFilters();
  loadProducts();
});


/* ==================================================
   4. MOBILE MENU
================================================== */

function setupMenu() {
  const menuButton =
    document.getElementById("menu-button");

  const navLinks =
    document.getElementById("nav-links");

  if (!menuButton || !navLinks) {
    return;
  }

  menuButton.addEventListener("click", function() {
    navLinks.classList.toggle("nav-open");
  });

  const links =
    navLinks.querySelectorAll("a");

  links.forEach(function(link) {
    link.addEventListener("click", function() {
      navLinks.classList.remove("nav-open");
    });
  });
}


/* ==================================================
   5. PRODUCT FILTERS
================================================== */

function setupProductFilters() {
  if (productSearch) {
    productSearch.addEventListener(
      "input",
      filterProductCards
    );
  }

  if (categoryFilter) {
    categoryFilter.addEventListener(
      "change",
      filterProductCards
    );
  }
}


/* ==================================================
   6. LOAD PRODUCTS FROM APPS SCRIPT
================================================== */

async function loadProducts() {
  if (!API_URL ||
      API_URL.includes("PASTE-YOUR")) {
    showMessage(
      "Please add your Apps Script Web App URL in script.js."
    );

    return;
  }

  if (!productContainer) {
    console.error(
      "Element with ID product-container was not found."
    );

    return;
  }

  try {
    showMessage("Loading products...");

    const requestUrl =
      API_URL + "?action=products";

    const response =
      await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(
        "The product service could not be reached."
      );
    }

    const data =
      await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Products could not be loaded."
      );
    }

    displayProducts(data.products || []);

  } catch (error) {
    console.error("Product loading error:", error);

    productContainer.innerHTML = "";

    showMessage(
      "Products could not be loaded. Please try again later."
    );
  }
}


/* ==================================================
   7. DISPLAY PRODUCTS
================================================== */

function displayProducts(products) {
  if (!productContainer) {
    return;
  }

  productContainer.innerHTML = "";

  if (!products || products.length === 0) {
    showMessage(
      "No products are currently available."
    );

    return;
  }

  products.forEach(function(product) {
    const card =
      createProductCard(product);

    productContainer.appendChild(card);
  });

  showMessage(
    products.length + " products available"
  );
}


/* ==================================================
   8. CREATE PRODUCT CARD
================================================== */

function createProductCard(product) {
  const card =
    document.createElement("article");

  card.className =
    "product-card";

  /*
    This attribute is required by the category filter.
    Example:
    data-category="ketchup"
  */

  card.setAttribute(
    "data-category",
    String(
      product["Category"] || ""
    ).toLowerCase()
  );

  const productId =
    product["Product ID"] || "";

  const imageUrl =
    product["Image URL"] ||
    "https://placehold.co/600x400/eaf6ee/174d35?text=Organic+Snack";

  const productName =
    product["Product Name"] ||
    "Organic Snack";

  const category =
    product["Category"] ||
    "Snack";

  const description =
    product["Description"] ||
    "Product information coming soon.";

  const ingredients =
    product["Ingredients"] ||
    "Ingredients information coming soon.";

  const benefits =
    product["Benefits"] ||
    "Product information coming soon.";

  const preparation =
    product["Oil/Ghee/Butter Used"] ||
    "Preparation information coming soon.";

  const weight =
    product["Weight"] ||
    "";

  const price =
    product["Price"] || 0;

  const shelfLife =
    product["Shelf Life"] ||
    "Please check the product label.";

  const storage =
    product["Storage"] ||
    "Store according to the product label.";

  const availability =
    product["Availability"] ||
    getAvailability(
      product["Stock"],
      product["Special Order"]
    );

  const specialOrder =
    String(
      product["Special Order"] || ""
    ).toLowerCase() === "yes";

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

        <p>
          <strong>Shelf Life:</strong>
          ${escapeHTML(shelfLife)}
        </p>

        <p>
          <strong>Storage:</strong>
          ${escapeHTML(storage)}
        </p>

      </div>

      <div class="product-meta">

        <span>
          ${escapeHTML(String(weight))}
        </span>

        <strong>
          ₹${escapeHTML(String(price))}
        </strong>

      </div>

      <span
        class="availability ${availabilityClass}"
      >
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
        data-product-id="${escapeAttribute(productId)}"
      >
        View Information
      </button>

    </div>
  `;

  const detailsButton =
    card.querySelector(".details-button");

  if (detailsButton) {
    detailsButton.addEventListener(
      "click",
      function() {
        showProductMessage(productName);
      }
    );
  }

  const productImage =
    card.querySelector(".product-image");

  if (productImage) {
    productImage.addEventListener(
      "error",
      function() {
        productImage.src =
          "https://placehold.co/600x400/eaf6ee/174d35?text=Organic+Snack";
      }
    );
  }

  return card;
}


/* ==================================================
   9. PRODUCT AVAILABILITY
================================================== */

function getAvailability(stock, specialOrder) {
  const currentStock =
    Number(stock) || 0;

  const isSpecialOrder =
    String(
      specialOrder || ""
    ).toLowerCase() === "yes";

  if (
    isSpecialOrder &&
    currentStock <= 0
  ) {
    return "Special Order";
  }

  if (currentStock <= 0) {
    return "Out of Stock";
  }

  if (currentStock <= 5) {
    return "Limited Stock";
  }

  return "In Stock";
}


/* ==================================================
   10. AVAILABILITY CSS CLASS
================================================== */

function getAvailabilityClass(availability) {
  const value =
    String(availability || "").toLowerCase();

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


/* ==================================================
   11. SEARCH AND CATEGORY FILTER
================================================== */

function filterProductCards() {
  const searchValue =
    productSearch
      ? productSearch.value.toLowerCase().trim()
      : "";

  const categoryValue =
    categoryFilter
      ? categoryFilter.value.toLowerCase()
      : "all";

  const cards =
    document.querySelectorAll(".product-card");

  let visibleCount = 0;

  cards.forEach(function(card) {
    const cardText =
      card.textContent.toLowerCase();

    const cardCategory =
      card.getAttribute("data-category") || "";

    const matchesSearch =
      cardText.includes(searchValue);

    const matchesCategory =
      categoryValue === "all" ||
      cardCategory.includes(categoryValue);

    if (
      matchesSearch &&
      matchesCategory
    ) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  if (cards.length === 0) {
    return;
  }

  if (visibleCount === 0) {
    showMessage("No matching products found.");
  } else {
    showMessage(
      visibleCount + " products shown"
    );
  }
}


/* ==================================================
   12. PRODUCT INFORMATION MESSAGE
================================================== */

function showProductMessage(productName) {
  alert(
    productName +
    " details are displayed on this page."
  );
}


/* ==================================================
   13. DISPLAY PAGE MESSAGES
================================================== */

function showMessage(message) {
  if (productMessage) {
    productMessage.textContent = message;
  }
}


/* ==================================================
   14. HTML SAFETY FUNCTIONS
================================================== */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
  return escapeHTML(value);
}

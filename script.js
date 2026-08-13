/*
  ORGANIC SNACKS STORE
  Product display using JSONP

  Website:
  GitHub Pages

  Backend:
  Google Apps Script

  Database:
  Google Sheets
*/


/* ==================================================
   1. APPS SCRIPT WEB APP URL
================================================== */

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";


/* ==================================================
   2. PAGE VARIABLES
================================================== */

let productContainer;
let productMessage;
let productSearch;
let categoryFilter;


/* ==================================================
   3. START WEBSITE
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    productContainer =
      document.getElementById(
        "product-container"
      );

    productMessage =
      document.getElementById(
        "product-message"
      );

    productSearch =
      document.getElementById(
        "product-search"
      );

    categoryFilter =
      document.getElementById(
        "category-filter"
      );

    setupMenu();
    setupProductFilters();
    loadProducts();
  }
);


/* ==================================================
   4. MOBILE MENU
================================================== */

function setupMenu() {
  const menuButton =
    document.getElementById(
      "menu-button"
    );

  const navLinks =
    document.getElementById(
      "nav-links"
    );

  if (!menuButton || !navLinks) {
    return;
  }

  menuButton.addEventListener(
    "click",
    function() {
      const isOpen =
        navLinks.classList.toggle(
          "nav-open"
        );

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    }
  );

  const links =
    navLinks.querySelectorAll("a");

  links.forEach(function(link) {
    link.addEventListener(
      "click",
      function() {
        navLinks.classList.remove(
          "nav-open"
        );

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  });
}


/* ==================================================
   5. SEARCH AND FILTER EVENTS
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
   6. LOAD PRODUCTS USING JSONP
================================================== */

function loadProducts() {
  if (
    !API_URL ||
    API_URL.includes("PASTE-YOUR") ||
    !API_URL.endsWith("/exec")
  ) {
    showMessage(
      "Please add a valid Apps Script Web App URL in script.js."
    );

    return;
  }

  if (!productContainer) {
    console.error(
      "product-container was not found in index.html."
    );

    return;
  }

  showMessage("Loading products...");

  const callbackName =
    "organicProductsCallback_" +
    Date.now();

  window[callbackName] =
    function(data) {
      try {
        if (
          !data ||
          data.success !== true
        ) {
          throw new Error(
            data && data.message
              ? data.message
              : "Products could not be loaded."
          );
        }

        displayProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );

      } catch (error) {
        console.error(
          "Product loading error:",
          error
        );

        productContainer.innerHTML =
          "";

        showMessage(
          "Error: " + error.message
        );

      } finally {
        const oldScript =
          document.getElementById(
            callbackName
          );

        if (oldScript) {
          oldScript.remove();
        }

        delete window[callbackName];
      }
    };

  const requestScript =
    document.createElement("script");

  requestScript.id =
    callbackName;

  requestScript.src =
    API_URL +
    "?action=products&callback=" +
    encodeURIComponent(callbackName);

  requestScript.onerror =
    function() {
      console.error(
        "Apps Script JSONP request failed."
      );

      if (productContainer) {
        productContainer.innerHTML =
          "";
      }

      showMessage(
        "Unable to connect to the product service."
      );

      requestScript.remove();
      delete window[callbackName];
    };

  document.body.appendChild(
    requestScript
  );
}


/* ==================================================
   7. DISPLAY PRODUCTS
================================================== */

function displayProducts(products) {
  if (!productContainer) {
    return;
  }

  productContainer.innerHTML =
    "";

  if (
    !products ||
    products.length === 0
  ) {
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
    products.length +
    " products available"
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
    Required for category filtering.
  */

  card.setAttribute(
    "data-category",
    String(
      product["Category"] || ""
    ).toLowerCase()
  );

  const productId =
    product["Product ID"] || "";

  const productName =
    product["Product Name"] ||
    "Organic Snack";

  const category =
    product["Category"] ||
    "Snack";

  const imageUrl =
    product["Image URL"] ||
    "https://placehold.co/800x520/e6f8ed/114b35?text=Organic+Snack";

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
    "Please check the product label.";

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
    getAvailabilityClass(
      availability
    );

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
        data-product-id="${escapeAttribute(productId)}"
      >
        View Information
      </button>

    </div>
  `;

  const detailsButton =
    card.querySelector(
      ".details-button"
    );

  if (detailsButton) {
    detailsButton.addEventListener(
      "click",
      function() {
        showProductMessage(
          productName,
          productId
        );
      }
    );
  }

  const productImage =
    card.querySelector(
      ".product-image"
    );

  if (productImage) {
    productImage.addEventListener(
      "error",
      function() {
        productImage.src =
          "https://placehold.co/800x520/e6f8ed/114b35?text=Organic+Snack";
      }
    );
  }

  return card;
}


/* ==================================================
   9. AVAILABILITY
================================================== */

function getAvailability(
  stock,
  specialOrder
) {
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

function getAvailabilityClass(
  availability
) {
  const value =
    String(
      availability || ""
    ).toLowerCase();

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
   11. FILTER PRODUCTS
================================================== */

function filterProductCards() {
  const searchValue =
    productSearch
      ? productSearch.value
          .toLowerCase()
          .trim()
      : "";

  const categoryValue =
    categoryFilter
      ? categoryFilter.value
          .toLowerCase()
      : "all";

  const cards =
    document.querySelectorAll(
      ".product-card"
    );

  let visibleCount = 0;

  cards.forEach(function(card) {
    const cardText =
      card.textContent
        .toLowerCase();

    const cardCategory =
      card.getAttribute(
        "data-category"
      ) || "";

    const matchesSearch =
      cardText.includes(
        searchValue
      );

    const matchesCategory =
      categoryValue === "all" ||
      cardCategory.includes(
        categoryValue
      );

    if (
      matchesSearch &&
      matchesCategory
    ) {
      card.style.display =
        "";

      visibleCount++;
    } else {
      card.style.display =
        "none";
    }
  });

  if (cards.length === 0) {
    return;
  }

  if (visibleCount === 0) {
    showMessage(
      "No matching products found."
    );
  } else {
    showMessage(
      visibleCount +
      " products shown"
    );
  }
}


/* ==================================================
   12. PRODUCT BUTTON
================================================== */

function showProductMessage(
  productName,
  productId
) {
  alert(
    productName +
    " is product ID " +
    productId +
    ". Detailed ordering will be added next."
  );
}


/* ==================================================
   13. STATUS MESSAGE
================================================== */

function showMessage(message) {
  if (productMessage) {
    productMessage.textContent =
      message;
  }
}


/* ==================================================
   14. HTML SAFETY
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

/*
  ORGANIC SNACKS STORE
  Stage 10 Product Detail Page

  Reads:
  product.html?id=P001

  Connects to:
  Google Apps Script Web App
*/


/* ==================================================
   1. APPS SCRIPT WEB APP URL
================================================== */

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";


/* ==================================================
   2. PAGE VARIABLES
================================================== */

let productPageMessage;
let productDetailContainer;
let productVideoContainer;
let relatedProductsContainer;

let currentProduct = null;


/* ==================================================
   3. START PRODUCT PAGE
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    productPageMessage =
      document.getElementById(
        "product-page-message"
      );

    productDetailContainer =
      document.getElementById(
        "product-detail-container"
      );

    productVideoContainer =
      document.getElementById(
        "product-video-container"
      );

    relatedProductsContainer =
      document.getElementById(
        "related-products-container"
      );

    setupProductPageMenu();

    loadProductDetails();
  }
);


/* ==================================================
   4. MOBILE MENU
================================================== */

function setupProductPageMenu() {
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
   5. GET PRODUCT ID FROM URL
================================================== */

function getProductIdFromUrl() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");
}


/* ==================================================
   6. LOAD PRODUCT DETAILS
================================================== */

function loadProductDetails() {
  if (
    !API_URL ||
    API_URL.includes("PASTE-YOUR") ||
    !API_URL.endsWith("/exec")
  ) {
    showPageMessage(
      "A valid Apps Script Web App URL is required."
    );

    return;
  }

  if (!productDetailContainer) {
    console.error(
      "product-detail-container was not found."
    );

    return;
  }

  const productId =
    getProductIdFromUrl();

  if (!productId) {
    showPageMessage(
      "Product ID is missing."
    );

    hideProductSections();

    return;
  }

  showPageMessage(
    "Loading product details..."
  );

  createJsonpRequest(
    "product",
    "productId",
    productId,
    "organicProductDetailCallback",
    function(data) {
      if (
        !data ||
        data.success !== true ||
        !data.product
      ) {
        throw new Error(
          data && data.message
            ? data.message
            : "Product not found."
        );
      }

      currentProduct =
        data.product;

      displayProductDetails(
        currentProduct
      );

      loadRelatedProducts(
        currentProduct
      );

      showPageMessage("");
    },
    function(error) {
      console.error(
        "Product detail error:",
        error
      );

      productDetailContainer.innerHTML =
        "";

      hideProductSections();

      showPageMessage(
        "Unable to load product information. Please try again later."
      );
    }
  );
}


/* ==================================================
   7. DISPLAY PRODUCT DETAILS
================================================== */

function displayProductDetails(product) {
  const productId =
    product["Product ID"] || "";

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

  const stock =
    product["Stock"] || 0;

  const availability =
    product["Availability"] ||
    getAvailability(
      stock,
      product["Special Order"]
    );

  const shelfLife =
    product["Shelf Life"] ||
    "Please check the product label.";

  const storage =
    product["Storage"] ||
    "Please check the product label.";

  const imageUrl =
    product["Image URL"] ||
    "https://placehold.co/900x650/e6f8ed/114b35?text=Organic+Snack";

  const isSpecialOrder =
    String(
      product["Special Order"] || ""
    ).toLowerCase() === "yes";

  const availabilityClass =
    getAvailabilityClass(
      availability
    );

  productDetailContainer.innerHTML = `
    <div class="product-detail-image-column">

      <img
        id="product-main-image"
        class="product-detail-image"
        src="${escapeAttribute(imageUrl)}"
        alt="${escapeAttribute(productName)}"
      >

      <p class="product-id-label">
        Product ID:
        ${escapeHTML(productId)}
      </p>

    </div>

    <div class="product-detail-content">

      <span class="product-detail-category">
        ${escapeHTML(category)}
      </span>

      <h1 class="product-detail-title">
        ${escapeHTML(productName)}
      </h1>

      <p class="product-detail-description">
        ${escapeHTML(description)}
      </p>

      <div class="product-detail-price-row">

        <strong class="product-detail-price">
          ₹${escapeHTML(String(price))}
        </strong>

        <span class="product-detail-weight">
          ${escapeHTML(String(weight))}
        </span>

      </div>

      <div class="product-detail-status-row">

        <span
          class="availability ${availabilityClass}"
        >
          ${escapeHTML(availability)}
        </span>

        ${
          isSpecialOrder
            ? `
              <span class="special-order-label">
                Special Order Available
              </span>
            `
            : ""
        }

      </div>

      <div class="product-detail-information">

        <div class="detail-information-block">
          <h2>Ingredients</h2>

          <p>
            ${escapeHTML(ingredients)}
          </p>
        </div>

        <div class="detail-information-block">
          <h2>Product Benefits</h2>

          <p>
            ${escapeHTML(benefits)}
          </p>
        </div>

        <div class="detail-information-block">
          <h2>Preparation</h2>

          <p>
            ${escapeHTML(preparation)}
          </p>
        </div>

        <div class="detail-information-block">
          <h2>Shelf Life</h2>

          <p>
            ${escapeHTML(shelfLife)}
          </p>
        </div>

        <div class="detail-information-block">
          <h2>Storage</h2>

          <p>
            ${escapeHTML(storage)}
          </p>
        </div>

      </div>

      ${
        isSpecialOrder
          ? `
            <div class="special-order-notice">
              <strong>
                Special Order Product
              </strong>

              <p>
                This product may require advance preparation.
                Please contact us for quantity, preparation time
                and delivery information.
              </p>
            </div>
          `
          : ""
      }

      <div class="product-detail-actions">

        <a
          class="primary-button"
          href="index.html#contact"
        >
          Contact Us
        </a>

        <a
          class="secondary-button"
          href="index.html#products"
        >
          Back to Products
        </a>

      </div>

    </div>
  `;

  const mainImage =
    document.getElementById(
      "product-main-image"
    );

  if (mainImage) {
    mainImage.addEventListener(
      "error",
      function() {
        mainImage.src =
          "https://placehold.co/900x650/e6f8ed/114b35?text=Organic+Snack";
      }
    );
  }

  displayProductVideo(product);
}


/* ==================================================
   8. DISPLAY PRODUCT VIDEO
================================================== */

function displayProductVideo(product) {
  const videoSection =
    document.getElementById(
      "product-video-section"
    );

  if (!productVideoContainer) {
    return;
  }

  const videoUrl =
    product["Video URL"] || "";

  const embedUrl =
    getYouTubeEmbedUrl(videoUrl);

  productVideoContainer.innerHTML =
    "";

  if (!embedUrl) {
    productVideoContainer.innerHTML = `
      <div class="video-missing">
        Product video will be added soon.
      </div>
    `;

    return;
  }

  productVideoContainer.innerHTML = `
    <div class="product-video-frame">
      <iframe
        src="${escapeAttribute(embedUrl)}"
        title="${escapeAttribute(
          product["Product Name"] || "Product Video"
        )}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;

  if (videoSection) {
    videoSection.style.display =
      "block";
  }
}


/* ==================================================
   9. LOAD RELATED PRODUCTS
================================================== */

function loadRelatedProducts(product) {
  if (!relatedProductsContainer) {
    return;
  }

  relatedProductsContainer.innerHTML =
    `
      <p class="product-message">
        Loading related products...
      </p>
    `;

  createJsonpRequest(
    "products",
    "",
    "",
    "organicRelatedProductsCallback",
    function(data) {
      if (
        !data ||
        data.success !== true
      ) {
        throw new Error(
          "Related products could not be loaded."
        );
      }

      const products =
        Array.isArray(data.products)
          ? data.products
          : [];

      const currentId =
        String(
          product["Product ID"] || ""
        );

      const currentCategory =
        String(
          product["Category"] || ""
        ).toLowerCase();

      const relatedProducts =
        products
          .filter(function(item) {
            const itemId =
              String(
                item["Product ID"] || ""
              );

            const itemCategory =
              String(
                item["Category"] || ""
              ).toLowerCase();

            return (
              itemId !== currentId &&
              itemCategory === currentCategory
            );
          })
          .slice(0, 3);

      displayRelatedProducts(
        relatedProducts
      );
    },
    function(error) {
      console.error(
        "Related product error:",
        error
      );

      displayRelatedProducts([]);
    }
  );
}


/* ==================================================
   10. DISPLAY RELATED PRODUCTS
================================================== */

function displayRelatedProducts(products) {
  if (!relatedProductsContainer) {
    return;
  }

  relatedProductsContainer.innerHTML =
    "";

  if (
    !products ||
    products.length === 0
  ) {
    relatedProductsContainer.innerHTML = `
      <p class="product-message">
        No related products available.
      </p>
    `;

    return;
  }

  products.forEach(function(product) {
    const card =
      createRelatedProductCard(product);

    relatedProductsContainer.appendChild(
      card
    );
  });
}


/* ==================================================
   11. RELATED PRODUCT CARD
================================================== */

function createRelatedProductCard(product) {
  const card =
    document.createElement("article");

  card.className =
    "product-card related-product-card";

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

  const price =
    product["Price"] || 0;

  const availability =
    product["Availability"] ||
    getAvailability(
      product["Stock"],
      product["Special Order"]
    );

  const productUrl =
    "product.html?id=" +
    encodeURIComponent(productId);

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

      <div class="product-meta">
        <span>
          ${escapeHTML(
            String(product["Weight"] || "")
          )}
        </span>

        <strong>
          ₹${escapeHTML(String(price))}
        </strong>
      </div>

      <span class="availability ${getAvailabilityClass(availability)}">
        ${escapeHTML(availability)}
      </span>

      <a
        class="details-button"
        href="${escapeAttribute(productUrl)}"
      >
        View Product
      </a>

    </div>
  `;

  const image =
    card.querySelector(
      ".product-image"
    );

  if (image) {
    image.addEventListener(
      "error",
      function() {
        image.src =
          "https://placehold.co/800x520/e6f8ed/114b35?text=Organic+Snack";
      }
    );
  }

  return card;
}


/* ==================================================
   12. GENERIC JSONP REQUEST
================================================== */

function createJsonpRequest(
  action,
  parameterName,
  parameterValue,
  callbackBaseName,
  onSuccess,
  onError
) {
  const callbackName =
    callbackBaseName +
    "_" +
    Date.now();

  window[callbackName] =
    function(data) {
      try {
        onSuccess(data);
      } catch (error) {
        console.error(
          "JSONP response error:",
          error
        );

        onError(error);
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

  requestScript.async =
    true;

  let requestUrl =
    API_URL +
    "?action=" +
    encodeURIComponent(action);

  if (
    parameterName &&
    parameterValue
  ) {
    requestUrl +=
      "&" +
      encodeURIComponent(parameterName) +
      "=" +
      encodeURIComponent(parameterValue);
  }

  requestUrl +=
    "&callback=" +
    encodeURIComponent(callbackName) +
    "&v=" +
    Date.now();

  requestScript.src =
    requestUrl;

  requestScript.onerror =
    function() {
      console.error(
        "JSONP request failed:",
        requestUrl
      );

      onError(
        new Error(
          "JSONP request failed."
        )
      );

      requestScript.remove();
      delete window[callbackName];
    };

  document.body.appendChild(
    requestScript
  );
}


/* ==================================================
   13. AVAILABILITY
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
   14. AVAILABILITY CSS CLASS
================================================== */

function getAvailabilityClass(
  availability
) {
  const value =
    String(
      availability || ""
    ).toLowerCase();

  if (
    value.includes("out")
  ) {
    return "availability-out";
  }

  if (
    value.includes("limited")
  ) {
    return "availability-limited";
  }

  if (
    value.includes("special")
  ) {
    return "availability-special";
  }

  return "availability-in";
}


/* ==================================================
   15. YOUTUBE URL CONVERTER
================================================== */

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return "";
  }

  const value =
    String(url).trim();

  let videoId =
    "";

  if (
    value.includes("watch?v=")
  ) {
    videoId =
      value
        .split("watch?v=")[1]
        .split("&")[0];
  } else if (
    value.includes("youtu.be/")
  ) {
    videoId =
      value
        .split("youtu.be/")[1]
        .split("?")[0];
  } else if (
    value.includes("/embed/")
  ) {
    videoId =
      value
        .split("/embed/")[1]
        .split("?")[0];
  }

  if (!videoId) {
    return "";
  }

  return (
    "https://www.youtube.com/embed/" +
    encodeURIComponent(videoId)
  );
}


/* ==================================================
   16. PAGE MESSAGES
================================================== */

function showPageMessage(message) {
  if (productPageMessage) {
    productPageMessage.textContent =
      message;
  }
}


function hideProductSections() {
  const videoSection =
    document.getElementById(
      "product-video-section"
    );

  const relatedSection =
    document.getElementById(
      "related-products-section"
    );

  if (videoSection) {
    videoSection.style.display =
      "none";
  }

  if (relatedSection) {
    relatedSection.style.display =
      "none";
  }
}


/* ==================================================
   17. HTML SAFETY
================================================== */

function escapeHTML(value) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


function escapeAttribute(value) {
  return escapeHTML(value);
}

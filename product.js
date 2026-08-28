/*
  ORGANIC SNACKS STORE
  Stage 19 - Product Detail Page (with Special Order Customization)
*/

const API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";

let productPageMessage;
let productDetailContainer;
let productVideoContainer;
let relatedProductsContainer;

let currentProduct = null;

document.addEventListener("DOMContentLoaded", function () {
  productPageMessage = document.getElementById("product-page-message");
  productDetailContainer = document.getElementById("product-detail-container");
  productVideoContainer = document.getElementById("product-video-container");
  relatedProductsContainer = document.getElementById("related-products-container");

  setupProductPageMenu();
  loadProductDetails();
});

function setupProductPageMenu() {
  const menuButton = document.getElementById("menu-button");
  const navLinks = document.getElementById("nav-links");

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("nav-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadProductDetails() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    showPageMessage("Product ID is missing.");
    hideProductSections();
    return;
  }

  showPageMessage("Loading product details...");

  createJsonpRequest(
    "product",
    "productId",
    productId,
    "organicProductDetailCallback",
    function (data) {
      if (!data || data.success !== true || !data.product) {
        throw new Error(data && data.message ? data.message : "Product not found.");
      }

      currentProduct = data.product;
      displayProductDetails(currentProduct);
      loadRelatedProducts(currentProduct);
      showPageMessage("");
    },
    function (error) {
      console.error("Product detail error:", error);
      productDetailContainer.innerHTML = "";
      hideProductSections();
      showPageMessage("Unable to load product information. Please try again later.");
    }
  );
}

function displayProductDetails(product) {
  const productId = product["Product ID"] || "";
  const productName = product["Product Name"] || "Organic Snack";
  const category = product["Category"] || "Snack";
  const description = product["Description"] || "Product information coming soon.";
  const ingredients = product["Ingredients"] || "Ingredients information coming soon.";
  const benefits = product["Benefits"] || "Product information coming soon.";
  const preparation = product["Oil/Ghee/Butter Used"] || "Preparation information coming soon.";
  const weight = product["Weight"] || "";
  const price = product["Price"] || 0;
  const stock = product["Stock"] || 0;

  const availability = product["Availability"] || getAvailability(stock, product["Special Order"]);
  const shelfLife = product["Shelf Life"] || "Please check the product label.";
  const storage = product["Storage"] || "Please check the product label.";
  const imageUrl = product["Image URL"] || "https://placehold.co/900x650/e6f8ed/114b35?text=Organic+Snack";

  const isSpecialOrder = String(product["Special Order"] || "").toLowerCase() === "yes";
  const availabilityClass = getAvailabilityClass(availability);

  // Set minimum delivery date (e.g. 2 days in future)
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const minDateStr = today.toISOString().split("T")[0];

  productDetailContainer.innerHTML = `
    <div class="product-detail-image-column">
      <img
        id="product-main-image"
        class="product-detail-image"
        src="${escapeAttribute(imageUrl)}"
        alt="${escapeAttribute(productName)}"
      >
      <p class="product-id-label">Product ID: ${escapeHTML(productId)}</p>
    </div>

    <div class="product-detail-content">
      <span class="product-detail-category">${escapeHTML(category)}</span>
      <h1 class="product-detail-title">${escapeHTML(productName)}</h1>
      <p class="product-detail-description">${escapeHTML(description)}</p>

      <div class="product-detail-price-row">
        <strong class="product-detail-price">₹${escapeHTML(String(price))}</strong>
        <span class="product-detail-weight">${escapeHTML(String(weight))}</span>
      </div>

      <div class="product-detail-status-row">
        <span class="availability ${availabilityClass}">${escapeHTML(availability)}</span>
        ${isSpecialOrder ? `<span class="special-order-label">Special Batch Order</span>` : ""}
      </div>

      ${
        isSpecialOrder
          ? `
            <div class="special-order-notice">
              <strong>⭐ Special Fresh Batch Order</strong>
              <p>This item is prepared fresh upon receiving your order. Standard preparation time is 2-3 business days.</p>
              
              <div style="margin-top: 15px; display:flex; flex-direction:column; gap:10px;">
                <div class="form-group">
                  <label for="detail-custom-notes">Customization Request (Optional)</label>
                  <input id="detail-custom-notes" type="text" placeholder="e.g. Less sugar, festival box, extra cardamom">
                </div>

                <div class="form-group">
                  <label for="detail-preferred-date">Preferred Preparation / Dispatch Date</label>
                  <input id="detail-preferred-date" type="date" min="${minDateStr}">
                </div>
              </div>
            </div>
          `
          : ""
      }

      <div class="product-detail-information">
        <div class="detail-information-block">
          <h2>Ingredients</h2>
          <p>${escapeHTML(ingredients)}</p>
        </div>

        <div class="detail-information-block">
          <h2>Product Benefits</h2>
          <p>${escapeHTML(benefits)}</p>
        </div>

        <div class="detail-information-block">
          <h2>Preparation & Oil/Fat</h2>
          <p>${escapeHTML(preparation)}</p>
        </div>

        <div class="detail-information-block">
          <h2>Shelf Life & Storage</h2>
          <p><strong>Shelf Life:</strong> ${escapeHTML(shelfLife)}<br><strong>Storage:</strong> ${escapeHTML(storage)}</p>
        </div>
      </div>

      <div class="product-detail-actions">
        ${
          stock > 0 || isSpecialOrder
            ? `<button id="detail-add-to-cart" class="primary-button" type="button">Add to Cart</button>`
            : `<button class="primary-button" type="button" disabled>Currently Out of Stock</button>`
        }
        <a class="secondary-button" href="cart.html">View Cart</a>
        <a class="secondary-button" href="index.html#contact">Contact Us</a>
        <a class="secondary-button" href="index.html#products">Back to Products</a>
      </div>
    </div>
  `;

  const mainImage = document.getElementById("product-main-image");
  if (mainImage) {
    mainImage.addEventListener("error", function () {
      mainImage.src = "https://placehold.co/900x650/e6f8ed/114b35?text=Organic+Snack";
    });
  }

  const detailAddToCart = document.getElementById("detail-add-to-cart");
  if (detailAddToCart) {
    detailAddToCart.addEventListener("click", function () {
      addProductToCartFromDetail(product);
    });
  }

  displayProductVideo(product);
}

function addProductToCartFromDetail(product) {
  const cartKey = "organicSnacksCart";
  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch (error) {
    cart = [];
  }

  const productId = String(product["Product ID"] || "");
  const stock = Number(product["Stock"]) || 0;
  const isSpecial = String(product["Special Order"] || "").toLowerCase() === "yes";

  if (!productId) {
    alert("Product ID is missing.");
    return;
  }

  if (stock <= 0 && !isSpecial) {
    alert("This product is currently out of stock.");
    return;
  }

  const customNotes = document.getElementById("detail-custom-notes")?.value.trim() || "";
  const preferredDate = document.getElementById("detail-preferred-date")?.value || "";

  const existingItem = cart.find(item => String(item.productId) === productId);

  if (existingItem) {
    const currentQty = Number(existingItem.quantity) || 0;
    if (!isSpecial && currentQty >= stock) {
      alert("Only " + stock + " item(s) are currently available in immediate stock.");
      return;
    }
    existingItem.quantity = currentQty + 1;
    if (customNotes) existingItem.customNotes = customNotes;
    if (preferredDate) existingItem.preferredDate = preferredDate;
  } else {
    cart.push({
      productId: productId,
      productName: product["Product Name"] || "",
      category: product["Category"] || "",
      price: Number(product["Price"]) || 0,
      weight: product["Weight"] || "",
      quantity: 1,
      stock: stock,
      imageUrl: product["Image URL"] || "",
      availability: product["Availability"] || "In Stock",
      isSpecialOrder: isSpecial,
      customNotes: customNotes,
      preferredDate: preferredDate
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(product["Product Name"] + " added to your cart!");
  updateDetailCartCount(cart);
}

function updateDetailCartCount(cart) {
  const cartCount = document.getElementById("detail-cart-count");
  if (!cartCount) return;
  const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  cartCount.textContent = total;
}

function displayProductVideo(product) {
  const videoSection = document.getElementById("product-video-section");
  if (!productVideoContainer) return;

  const videoUrl = product["Video URL"] || "";
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  productVideoContainer.innerHTML = "";

  if (!embedUrl) {
    productVideoContainer.innerHTML = `<div class="video-missing">Product video will be added soon.</div>`;
    return;
  }

  productVideoContainer.innerHTML = `
    <div class="product-video-frame">
      <iframe
        src="${escapeAttribute(embedUrl)}"
        title="${escapeAttribute(product["Product Name"] || "Product Video")}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;

  if (videoSection) videoSection.style.display = "block";
}

function loadRelatedProducts(product) {
  if (!relatedProductsContainer) return;

  relatedProductsContainer.innerHTML = `<p class="product-message">Loading related products...</p>`;

  createJsonpRequest(
    "products",
    "",
    "",
    "organicRelatedProductsCallback",
    function (data) {
      if (!data || data.success !== true) throw new Error("Related products failed.");

      const products = Array.isArray(data.products) ? data.products : [];
      const currentId = String(product["Product ID"] || "");
      const currentCategory = String(product["Category"] || "").toLowerCase();

      const related = products
        .filter(item => String(item["Product ID"]) !== currentId && String(item["Category"]).toLowerCase() === currentCategory)
        .slice(0, 3);

      displayRelatedProducts(related);
    },
    function () {
      displayRelatedProducts([]);
    }
  );
}

function displayRelatedProducts(products) {
  if (!relatedProductsContainer) return;
  relatedProductsContainer.innerHTML = "";

  if (!products || products.length === 0) {
    relatedProductsContainer.innerHTML = `<p class="product-message">No related products available.</p>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card related-product-card";
    const productId = product["Product ID"] || "";
    const productName = product["Product Name"] || "Organic Snack";
    const category = product["Category"] || "Snack";
    const imageUrl = product["Image URL"] || "https://placehold.co/800x520/e6f8ed/114b35?text=Organic+Snack";
    const price = product["Price"] || 0;
    const availability = product["Availability"] || getAvailability(product["Stock"], product["Special Order"]);
    const productUrl = "product.html?id=" + encodeURIComponent(productId);

    card.innerHTML = `
      <img class="product-image" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(productName)}" loading="lazy">
      <div class="product-card-content">
        <span class="product-category">${escapeHTML(category)}</span>
        <h3>${escapeHTML(productName)}</h3>
        <div class="product-meta">
          <span>${escapeHTML(String(product["Weight"] || ""))}</span>
          <strong>₹${formatMoney(price)}</strong>
        </div>
        <span class="availability ${getAvailabilityClass(availability)}">${escapeHTML(availability)}</span>
        <a class="details-button" href="${escapeAttribute(productUrl)}">View Product</a>
      </div>
    `;

    relatedProductsContainer.appendChild(card);
  });
}

function createJsonpRequest(action, paramName, paramVal, callbackBase, onSuccess, onError) {
  const callbackName = callbackBase + "_" + Date.now();

  window[callbackName] = function (data) {
    try {
      onSuccess(data);
    } catch (e) {
      onError(e);
    } finally {
      const script = document.getElementById(callbackName);
      if (script) script.remove();
      delete window[callbackName];
    }
  };

  const script = document.createElement("script");
  script.id = callbackName;
  script.async = true;

  let url = API_URL + "?action=" + encodeURIComponent(action);
  if (paramName && paramVal) {
    url += "&" + encodeURIComponent(paramName) + "=" + encodeURIComponent(paramVal);
  }
  url += "&callback=" + encodeURIComponent(callbackName) + "&v=" + Date.now();

  script.src = url;
  script.onerror = function () {
    onError(new Error("JSONP request failed."));
    script.remove();
    delete window[callbackName];
  };

  document.body.appendChild(script);
}

function getAvailability(stock, specialOrder) {
  const currentStock = Number(stock) || 0;
  const isSpecial = String(specialOrder || "").toLowerCase() === "yes";
  if (isSpecial && currentStock <= 0) return "Special Order";
  if (currentStock <= 0) return "Out of Stock";
  if (currentStock <= 5) return "Limited Stock";
  return "In Stock";
}

function getAvailabilityClass(availability) {
  const v = String(availability || "").toLowerCase();
  if (v.includes("out")) return "availability-out";
  if (v.includes("limited")) return "availability-limited";
  if (v.includes("special")) return "availability-special";
  return "availability-in";
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const v = String(url).trim();
  let videoId = "";
  if (v.includes("watch?v=")) videoId = v.split("watch?v=")[1].split("&")[0];
  else if (v.includes("youtu.be/")) videoId = v.split("youtu.be/")[1].split("?")[0];
  else if (v.includes("/embed/")) videoId = v.split("/embed/")[1].split("?")[0];
  return videoId ? "https://www.youtube.com/embed/" + encodeURIComponent(videoId) : "";
}

function showPageMessage(msg) {
  if (productPageMessage) productPageMessage.textContent = msg;
}

function hideProductSections() {
  const v = document.getElementById("product-video-section");
  const r = document.getElementById("related-products-section");
  if (v) v.style.display = "none";
  if (r) r.style.display = "none";
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

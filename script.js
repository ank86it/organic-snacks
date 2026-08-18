/*
  ORGANIC SNACKS STORE
  Stage 9 Frontend JavaScript

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

let featuredContainer;
let featuredMessage;

let videoContainer;
let videoMessage;

let articleContainer;
let articleMessage;

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

    featuredContainer =
      document.getElementById(
        "featured-container"
      );

    featuredMessage =
      document.getElementById(
        "featured-message"
      );

    videoContainer =
      document.getElementById(
        "video-container"
      );

    videoMessage =
      document.getElementById(
        "video-message"
      );

    articleContainer =
      document.getElementById(
        "article-container"
      );

    articleMessage =
      document.getElementById(
        "article-message"
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

        loadHomepageCartCount();

    loadProducts();
    loadArticles();
    loadVideos();
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
   5. SEARCH AND CATEGORY FILTER
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
   6. LOAD PRODUCTS
================================================== */

function loadProducts() {
  if (
    !API_URL ||
    API_URL.includes("PASTE-YOUR") ||
    !API_URL.endsWith("/exec")
  ) {
    showProductMessage(
      "Please add a valid Apps Script Web App URL."
    );

    return;
  }

  showProductMessage(
    "Loading products..."
  );

  createJsonpRequest(
    "products",
    "organicProductsCallback",
    function(data) {
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

      const products =
        Array.isArray(data.products)
          ? data.products
          : [];

      displayProducts(products);
      displayFeaturedProducts(products);
    },
    function() {
      if (productContainer) {
        productContainer.innerHTML = "";
      }

      if (featuredContainer) {
        featuredContainer.innerHTML = "";
      }

      showProductMessage(
        "Unable to connect to the product service."
      );

      showFeaturedMessage(
        "Featured products could not be loaded."
      );
    }
  );
}


/* ==================================================
   7. DISPLAY ALL PRODUCTS
================================================== */

function displayProducts(products) {
  if (!productContainer) {
    return;
  }

  productContainer.innerHTML = "";

  if (
    !products ||
    products.length === 0
  ) {
    showProductMessage(
      "No products are currently available."
    );

    return;
  }

  products.forEach(function(product) {
    const card =
      createProductCard(product);

    productContainer.appendChild(card);
  });

  showProductMessage(
    products.length +
    " products available"
  );
}


/* ==================================================
   8. DISPLAY FEATURED PRODUCTS
================================================== */

function displayFeaturedProducts(products) {
  if (!featuredContainer) {
    return;
  }

  featuredContainer.innerHTML = "";

  if (
    !products ||
    products.length === 0
  ) {
    showFeaturedMessage(
      "Featured products will be added soon."
    );

    return;
  }

  /*
    The first three active products are featured
    in this first version.
  */

  const featuredProducts =
    products.slice(0, 3);

  featuredProducts.forEach(function(product) {
    const card =
      createProductCard(
        product,
        true
      );

    featuredContainer.appendChild(card);
  });

  showFeaturedMessage(
    featuredProducts.length +
    " featured products"
  );
}


/* ==================================================
   9. CREATE PRODUCT CARD
================================================== */
function createProductCard(
  product,
  compactCard
) {
  const card =
    document.createElement("article");

  card.className =
    compactCard
      ? "product-card featured-card"
      : "product-card";

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
  Number(product["Price"]) || 0;

const stock =
  Number(product["Stock"]) || 0;

const unavailable =
  stock <= 0;

const availability =
  product["Availability"] ||
  getAvailability(
    stock,
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

  card.setAttribute(
    "data-category",
    String(category).toLowerCase()
  );

  const detailedInformation =
    compactCard
      ? ""
      : `
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
      `;

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

      <p class="product-description">
        ${escapeHTML(description)}
      </p>

      ${
        detailedInformation
          ? `
            <div class="product-information">
              ${detailedInformation}
            </div>
          `
          : ""
      }

      <div class="product-meta">

        <span>
          ${escapeHTML(String(weight))}
        </span>

        <strong>
          ₹${formatMoney(price)}
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

      <div class="product-card-actions">

        <a
          class="details-button"
          href="${escapeAttribute(productUrl)}"
        >
          ${compactCard ? "View Product" : "View Information"}
        </a>

        <button
          class="add-to-cart-button"
          type="button"
          data-action="add-to-cart"
          ${unavailable ? "disabled" : ""}
        >
          ${unavailable ? "Unavailable" : "Add to Cart"}
        </button>

      </div>

    </div>
  `;

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

  const addToCartButton =
    card.querySelector(
      '[data-action="add-to-cart"]'
    );

  if (addToCartButton) {
    addToCartButton.addEventListener(
      "click",
      function() {
        addProductToCart(product);
      }
    );
  }

  return card;
}


/* ==================================================
   10. LOAD ARTICLES
================================================== */

function loadArticles() {
  if (!articleContainer) {
    return;
  }

  showArticleMessage(
    "Loading articles..."
  );

  createJsonpRequest(
    "articles",
    "organicArticlesCallback",
    function(data) {
      if (
        !data ||
        data.success !== true
      ) {
        throw new Error(
          data && data.message
            ? data.message
            : "Articles could not be loaded."
        );
      }

      const articles =
        Array.isArray(data.records)
          ? data.records
          : [];

      displayArticles(articles);
    },
    function() {
      articleContainer.innerHTML =
        "";

      showArticleMessage(
        "Unable to load articles."
      );
    }
  );
}


/* ==================================================
   11. DISPLAY ARTICLES
================================================== */

function displayArticles(articles) {
  if (!articleContainer) {
    return;
  }

  articleContainer.innerHTML = "";

  if (
    !articles ||
    articles.length === 0
  ) {
    showArticleMessage(
      "Articles will be added soon."
    );

    return;
  }

  articles.forEach(function(article) {
    const card =
      createArticleCard(article);

    articleContainer.appendChild(card);
  });

  showArticleMessage(
    articles.length +
    " articles available"
  );
}


/* ==================================================
   12. CREATE ARTICLE CARD
================================================== */

function createArticleCard(article) {
  const card =
    document.createElement("article");

  card.className =
    "article-card";

  const articleId =
    article["Article ID"] || "";

  const title =
    article["Title"] ||
    "Organic Snacks Article";

  const summary =
    article["Summary"] ||
    "Read more about organic snacks.";

  const shortContent =
    article["Content"] ||
    "";

  const articleUrl =
    article["Article URL"] || "";

  const imageUrl =
    article["Image URL"] || "";

  const articleButton =
    articleUrl
      ? `
        <a
          class="details-button article-button"
          href="${escapeAttribute(articleUrl)}"
        >
          Read Full Article
        </a>
      `
      : `
        <span class="article-url-missing">
          Full article link coming soon.
        </span>
      `;

  card.innerHTML = `
    ${
      imageUrl
        ? `
          <img
            class="article-image"
            src="${escapeAttribute(imageUrl)}"
            alt="${escapeAttribute(title)}"
            loading="lazy"
          >
        `
        : `
          <div class="article-image-placeholder">
            📚
          </div>
        `
    }

    <span class="article-number">
      ${escapeHTML(articleId)}
    </span>

    <h3>
      ${escapeHTML(title)}
    </h3>

    <p class="article-summary">
      ${escapeHTML(summary)}
    </p>

    ${
      shortContent
        ? `
          <p class="article-short-content">
            ${escapeHTML(shortContent)}
          </p>
        `
        : ""
    }

    ${articleButton}
  `;

  const articleImage =
    card.querySelector(".article-image");

  if (articleImage) {
    articleImage.addEventListener(
      "error",
      function() {
        articleImage.remove();

        const placeholder =
          document.createElement("div");

        placeholder.className =
          "article-image-placeholder";

        placeholder.textContent =
          "📚";

        card.insertBefore(
          placeholder,
          card.firstChild
        );
      }
    );
  }

  return card;
}

/* ==================================================
   13. LOAD VIDEOS
================================================== */

function loadVideos() {
  if (!videoContainer) {
    return;
  }

  showVideoMessage(
    "Loading videos..."
  );

  createJsonpRequest(
    "videos",
    "organicVideosCallback",
    function(data) {
      if (
        !data ||
        data.success !== true
      ) {
        throw new Error(
          data && data.message
            ? data.message
            : "Videos could not be loaded."
        );
      }

      const videos =
        Array.isArray(data.records)
          ? data.records
          : [];

      displayVideos(videos);
    },
    function() {
      videoContainer.innerHTML =
        "";

      showVideoMessage(
        "Unable to load videos."
      );
    }
  );
}


/* ==================================================
   14. DISPLAY VIDEOS
================================================== */

function displayVideos(videos) {
  if (!videoContainer) {
    return;
  }

  videoContainer.innerHTML = "";

  if (
    !videos ||
    videos.length === 0
  ) {
    showVideoMessage(
      "Videos will be added soon."
    );

    return;
  }

  videos.forEach(function(video) {
    const card =
      createVideoCard(video);

    videoContainer.appendChild(card);
  });

  showVideoMessage(
    videos.length +
    " videos available"
  );
}


/* ==================================================
   15. CREATE VIDEO CARD
================================================== */

function createVideoCard(video) {
  const card =
    document.createElement("article");

  card.className =
    "video-card";

  const title =
    video["Title"] ||
    "Organic Snacks Video";

  const description =
    video["Description"] ||
    "Learn more about our products.";

  const videoUrl =
    video["YouTube URL"] ||
    "";

  const embedUrl =
    getYouTubeEmbedUrl(
      videoUrl
    );

  card.innerHTML = `
    <div class="video-frame">

      ${
        embedUrl
          ? `
            <iframe
              src="${escapeAttribute(embedUrl)}"
              title="${escapeAttribute(title)}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          `
          : `
            <div class="video-missing">
              Video link coming soon
            </div>
          `
      }

    </div>

    <div class="video-card-content">

      <h3>
        ${escapeHTML(title)}
      </h3>

      <p>
        ${escapeHTML(description)}
      </p>

    </div>
  `;

  return card;
}


/* ==================================================
   16. YOUTUBE URL CONVERTER
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
   17. GENERIC JSONP REQUEST
================================================== */

function createJsonpRequest(
  action,
  callbackName,
  onSuccess,
  onError
) {
  const uniqueCallbackName =
    callbackName + "_" + Date.now();

  window[uniqueCallbackName] =
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
            uniqueCallbackName
          );

        if (oldScript) {
          oldScript.remove();
        }

        delete window[uniqueCallbackName];
      }
    };

  const requestScript =
    document.createElement("script");

  requestScript.id =
    uniqueCallbackName;

  requestScript.async =
    true;

  requestScript.src =
    API_URL +
    "?action=" +
    encodeURIComponent(action) +
    "&callback=" +
    encodeURIComponent(
      uniqueCallbackName
    ) +
    "&v=" +
    Date.now();

  requestScript.onerror =
    function() {
      console.error(
        "JSONP request failed:",
        requestScript.src
      );

      onError(
        new Error(
          "JSONP request failed."
        )
      );

      requestScript.remove();
      delete window[uniqueCallbackName];
    };

  document.body.appendChild(
    requestScript
  );
}


/* ==================================================
   18. AVAILABILITY
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
   19. AVAILABILITY CSS CLASS
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
   20. FILTER PRODUCT CARDS
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
      "#product-container .product-card"
    );

  let visibleCount =
    0;

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

  if (
    cards.length === 0
  ) {
    return;
  }

  if (
    visibleCount === 0
  ) {
    showProductMessage(
      "No matching products found."
    );
  } else {
    showProductMessage(
      visibleCount +
      " products shown"
    );
  }
}


/* ==================================================
   21. MESSAGE FUNCTIONS
================================================== */

function showProductMessage(message) {
  if (productMessage) {
    productMessage.textContent =
      message;
  }
}


function showFeaturedMessage(message) {
  if (featuredMessage) {
    featuredMessage.textContent =
      message;
  }
}


function showArticleMessage(message) {
  if (articleMessage) {
    articleMessage.textContent =
      message;
  }
}


function showVideoMessage(message) {
  if (videoMessage) {
    videoMessage.textContent =
      message;
  }
}


/* ==================================================
   22. PRODUCT INFORMATION BUTTON
================================================== */

function showProductMessageBox(
  productName,
  productId
) {
  alert(
    productName +
    " is product ID " +
    productId +
    "."
  );
}


/* ==================================================
   23. HTML SAFETY
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
/* ==================================================
   CART FUNCTIONS FOR HOMEPAGE
================================================== */

const CART_STORAGE_KEY =
  "organicSnacksCart";


function addProductToCart(product) {
  let cart = [];

  try {
    cart =
      JSON.parse(
        localStorage.getItem(
          CART_STORAGE_KEY
        )
      ) || [];
  } catch (error) {
    cart = [];
  }

  const productId =
    String(
      product["Product ID"] || ""
    );

  const productName =
    product["Product Name"] ||
    "Organic Snack";

  const stock =
    Number(product["Stock"]) || 0;

  const price =
    Number(product["Price"]) || 0;

  if (!productId) {
    alert("Product ID is missing.");
    return;
  }

  if (stock <= 0) {
    alert(
      "This product is currently unavailable."
    );

    return;
  }

  const existingItem =
    cart.find(function(item) {
      return String(
        item.productId
      ) === productId;
    });

  if (existingItem) {
    const currentQuantity =
      Number(
        existingItem.quantity
      ) || 0;

    if (
      currentQuantity >= stock
    ) {
      alert(
        "Only " +
        stock +
        " item(s) are currently available."
      );

      return;
    }

    existingItem.quantity =
      currentQuantity + 1;

  } else {
    cart.push({
      productId: productId,

      productName: productName,

      category:
        product["Category"] || "",

      price: price,

      weight:
        product["Weight"] || "",

      quantity: 1,

      stock: stock,

      imageUrl:
        product["Image URL"] || "",

      availability:
        product["Availability"] ||
        getAvailability(
          stock,
          product["Special Order"]
        )
    });
  }

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );

  updateHomepageCartCount(cart);

  alert(
    productName +
    " added to your cart."
  );
}


function updateHomepageCartCount(cart) {
  const cartCount =
    document.getElementById(
      "homepage-cart-count"
    );

  if (!cartCount) {
    return;
  }

  const totalQuantity =
    cart.reduce(function(
      total,
      item
    ) {
      return total +
        (Number(item.quantity) || 0);
    }, 0);

  cartCount.textContent =
    totalQuantity;
}


function loadHomepageCartCount() {
  let cart = [];

  try {
    cart =
      JSON.parse(
        localStorage.getItem(
          CART_STORAGE_KEY
        )
      ) || [];
  } catch (error) {
    cart = [];
  }

  updateHomepageCartCount(cart);
}


function formatMoney(value) {
  return (
    Number(value) || 0
  ).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );
}

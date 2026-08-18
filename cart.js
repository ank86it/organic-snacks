/*
  ORGANIC SNACKS STORE
  Stage 11 - Shopping Cart

  Storage key:
  organicSnacksCart

  This stage handles:
  - Loading cart items
  - Displaying cart items
  - Increasing quantity
  - Decreasing quantity
  - Removing items
  - Clearing the cart
  - Calculating subtotal
  - Updating cart count
*/


/* ==================================================
   1. CART CONFIGURATION
================================================== */

const CART_STORAGE_KEY =
  "organicSnacksCart";


/* ==================================================
   2. PAGE VARIABLES
================================================== */

let cartItemsContainer;
let cartMessage;
let cartCount;
let summaryQuantity;
let summarySubtotal;
let summaryTotal;
let clearCartButton;
let checkoutButton;


/* ==================================================
   3. START CART PAGE
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    cartItemsContainer =
      document.getElementById(
        "cart-items-container"
      );

    cartMessage =
      document.getElementById(
        "cart-message"
      );

    cartCount =
      document.getElementById(
        "cart-count"
      );

    summaryQuantity =
      document.getElementById(
        "summary-quantity"
      );

    summarySubtotal =
      document.getElementById(
        "summary-subtotal"
      );

    summaryTotal =
      document.getElementById(
        "summary-total"
      );

    clearCartButton =
      document.getElementById(
        "clear-cart-button"
      );

    checkoutButton =
      document.getElementById(
        "checkout-button"
      );

    setupMobileMenu();
    setupCartEvents();
    renderCart();
  }
);


/* ==================================================
   4. MOBILE MENU
================================================== */

function setupMobileMenu() {
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

  navLinks
    .querySelectorAll("a")
    .forEach(function(link) {
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
   5. CART EVENTS
================================================== */

function setupCartEvents() {
  if (clearCartButton) {
    clearCartButton.addEventListener(
      "click",
      clearCart
    );
  }

 if (checkoutButton) {
  checkoutButton.addEventListener(
    "click",
    function() {
      const cart = getCart();

      if (!cart || cart.length === 0) {
        showCartMessage(
          "Your cart is empty. Please add a product first."
        );

        return;
      }

      window.location.href = "checkout.html";
    }
  );
}

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener(
      "click",
      handleCartItemClick
    );
  }
}


/* ==================================================
   6. LOAD CART FROM LOCAL STORAGE
================================================== */

function getCart() {
  try {
    const savedCart =
      localStorage.getItem(
        CART_STORAGE_KEY
      );

    if (!savedCart) {
      return [];
    }

    const parsedCart =
      JSON.parse(savedCart);

    return Array.isArray(parsedCart)
      ? parsedCart
      : [];

  } catch (error) {
    console.error(
      "Could not read cart:",
      error
    );

    return [];
  }
}


/* ==================================================
   7. SAVE CART TO LOCAL STORAGE
================================================== */

function saveCart(cart) {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );
}


/* ==================================================
   8. DISPLAY CART
================================================== */

function renderCart() {
  const cart =
    getCart();

  updateCartCount(cart);

  if (!cartItemsContainer) {
    return;
  }

  cartItemsContainer.innerHTML =
    "";

  if (
    !cart ||
    cart.length === 0
  ) {
    renderEmptyCart();
    updateCartSummary([]);
    return;
  }

  cart.forEach(function(item) {
    const cartItem =
      createCartItem(item);

    cartItemsContainer.appendChild(
      cartItem
    );
  });

  updateCartSummary(cart);

  showCartMessage(
    cart.length + " product type" +
    (cart.length === 1 ? "" : "s") +
    " in your cart"
  );
}


/* ==================================================
   9. CREATE CART ITEM
================================================== */

function createCartItem(item) {
  const wrapper =
    document.createElement("article");

  wrapper.className =
    "cart-item";

  const productId =
    item.productId || "";

  const productName =
    item.productName ||
    "Organic Snack";

  const imageUrl =
    item.imageUrl ||
    "https://placehold.co/240x180/e6f8ed/114b35?text=Organic+Snack";

  const price =
    Number(item.price) || 0;

  const quantity =
    Math.max(
      1,
      Number(item.quantity) || 1
    );

  const weight =
    item.weight || "";

  const availability =
    item.availability || "";

  const itemTotal =
    price * quantity;

  wrapper.setAttribute(
    "data-product-id",
    productId
  );

  wrapper.innerHTML = `
    <div class="cart-item-image-wrapper">
      <img
        class="cart-item-image"
        src="${escapeAttribute(imageUrl)}"
        alt="${escapeAttribute(productName)}"
        loading="lazy"
      >
    </div>

    <div class="cart-item-details">

      <span class="product-category">
        ${escapeHTML(item.category || "Snack")}
      </span>

      <h3>
        ${escapeHTML(productName)}
      </h3>

      <p class="cart-item-weight">
        ${escapeHTML(String(weight))}
      </p>

      <p class="cart-item-price">
        ₹${formatMoney(price)} each
      </p>

      ${
        availability
          ? `
            <span class="availability availability-in">
              ${escapeHTML(availability)}
            </span>
          `
          : ""
      }

    </div>

    <div class="cart-item-controls">

      <div class="quantity-controls">

        <button
          class="quantity-button"
          type="button"
          data-action="decrease"
          data-product-id="${escapeAttribute(productId)}"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <span class="quantity-value">
          ${quantity}
        </span>

        <button
          class="quantity-button"
          type="button"
          data-action="increase"
          data-product-id="${escapeAttribute(productId)}"
          aria-label="Increase quantity"
        >
          +
        </button>

      </div>

      <strong class="cart-item-total">
        ₹${formatMoney(itemTotal)}
      </strong>

      <button
        class="remove-cart-button"
        type="button"
        data-action="remove"
        data-product-id="${escapeAttribute(productId)}"
      >
        Remove
      </button>

    </div>
  `;

  const image =
    wrapper.querySelector(
      ".cart-item-image"
    );

  if (image) {
    image.addEventListener(
      "error",
      function() {
        image.src =
          "https://placehold.co/240x180/e6f8ed/114b35?text=Organic+Snack";
      }
    );
  }

  return wrapper;
}


/* ==================================================
   10. HANDLE CART BUTTONS
================================================== */

function handleCartItemClick(event) {
  const button =
    event.target.closest(
      "button[data-action]"
    );

  if (!button) {
    return;
  }

  const action =
    button.getAttribute(
      "data-action"
    );

  const productId =
    button.getAttribute(
      "data-product-id"
    );

  if (!productId) {
    return;
  }

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeCartItem(productId);
  }
}


/* ==================================================
   11. CHANGE QUANTITY
================================================== */

function changeQuantity(
  productId,
  change
) {
  const cart =
    getCart();

  const item =
    cart.find(function(cartItem) {
      return String(
        cartItem.productId
      ) === String(productId);
    });

  if (!item) {
    return;
  }

  const currentQuantity =
    Number(item.quantity) || 1;

  const newQuantity =
    currentQuantity + change;

  if (newQuantity <= 0) {
    removeCartItem(productId);
    return;
  }

  /*
    If stock was saved with the cart item,
    do not allow quantity above that stock.
  */

  const availableStock =
    Number(item.stock);

  if (
    Number.isFinite(availableStock) &&
    availableStock > 0 &&
    newQuantity > availableStock
  ) {
    showCartMessage(
      "Only " +
      availableStock +
      " item(s) are currently available."
    );

    return;
  }

  item.quantity =
    newQuantity;

  saveCart(cart);
  renderCart();
}


/* ==================================================
   12. REMOVE ONE CART ITEM
================================================== */

function removeCartItem(productId) {
  const cart =
    getCart();

  const updatedCart =
    cart.filter(function(item) {
      return String(
        item.productId
      ) !== String(productId);
    });

  saveCart(updatedCart);
  renderCart();

  showCartMessage(
    "Product removed from the cart."
  );
}


/* ==================================================
   13. CLEAR COMPLETE CART
================================================== */

function clearCart() {
  const cart =
    getCart();

  if (
    !cart ||
    cart.length === 0
  ) {
    showCartMessage(
      "Your cart is already empty."
    );

    return;
  }

  const confirmed =
    window.confirm(
      "Remove all products from your cart?"
    );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(
    CART_STORAGE_KEY
  );

  renderCart();

  showCartMessage(
    "Your cart has been cleared."
  );
}


/* ==================================================
   14. EMPTY CART DISPLAY
================================================== */

function renderEmptyCart() {
  cartItemsContainer.innerHTML = `
    <div class="empty-cart">
      <div class="empty-cart-icon">
        🛒
      </div>

      <h2>
        Your cart is empty
      </h2>

      <p>
        Add some organic snacks to begin.
      </p>

      <a
        class="primary-button"
        href="index.html#products"
      >
        Browse Products
      </a>
    </div>
  `;

  showCartMessage(
    "Your cart is empty."
  );
}


/* ==================================================
   15. UPDATE CART SUMMARY
================================================== */

function updateCartSummary(cart) {
  let totalQuantity =
    0;

  let subtotal =
    0;

  cart.forEach(function(item) {
    const quantity =
      Number(item.quantity) || 0;

    const price =
      Number(item.price) || 0;

    totalQuantity +=
      quantity;

    subtotal +=
      price * quantity;
  });

  if (summaryQuantity) {
    summaryQuantity.textContent =
      totalQuantity;
  }

  if (summarySubtotal) {
    summarySubtotal.textContent =
      "₹" + formatMoney(subtotal);
  }

  if (summaryTotal) {
    summaryTotal.textContent =
      "₹" + formatMoney(subtotal);
  }

  if (checkoutButton) {
    checkoutButton.disabled =
      totalQuantity === 0;
  }
}


/* ==================================================
   16. UPDATE CART COUNT
================================================== */

function updateCartCount(cart) {
  if (!cartCount) {
    return;
  }

  const totalQuantity =
    cart.reduce(function(total, item) {
      return total +
        (Number(item.quantity) || 0);
    }, 0);

  cartCount.textContent =
    totalQuantity;
}


/* ==================================================
   17. DISPLAY CART MESSAGE
================================================== */

function showCartMessage(message) {
  if (cartMessage) {
    cartMessage.textContent =
      message;
  }
}


/* ==================================================
   18. MONEY FORMAT
================================================== */

function formatMoney(value) {
  const number =
    Number(value) || 0;

  return number.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );
}


/* ==================================================
   19. HTML SAFETY
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

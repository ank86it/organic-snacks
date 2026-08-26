/*
  ORGANIC SNACKS STORE
  STAGE 14 - ORDER SUBMISSION

  This file:
  - Loads cart data
  - Displays checkout products
  - Validates customer details
  - Displays payment instructions
  - Sends order data to Apps Script
  - Clears cart after successful order
  - Displays the generated Order ID
*/


/* ==================================================
   1. CONFIGURATION
================================================== */

const CHECKOUT_CART_KEY =
  "organicSnacksCart";

const CHECKOUT_DETAILS_KEY =
  "organicSnacksCheckoutDetails";

const CHECKOUT_API_URL =
  "https://script.google.com/macros/s/AKfycbwE0ce7dStvIRT8xvk_qtrzyEpCPJyYIHPy0BQciRO1J_KHuZ8CQ5wlr_ifqDfN5eqp/exec";


/* ==================================================
   2. PAGE VARIABLES
================================================== */

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


/* ==================================================
   3. START CHECKOUT PAGE
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {
    checkoutForm =
      document.getElementById(
        "checkout-form"
      );

    checkoutMessage =
      document.getElementById(
        "checkout-message"
      );

    checkoutItemsContainer =
      document.getElementById(
        "checkout-items-container"
      );

    checkoutCartCount =
      document.getElementById(
        "checkout-cart-count"
      );

    checkoutQuantity =
      document.getElementById(
        "checkout-quantity"
      );

    checkoutSubtotal =
      document.getElementById(
        "checkout-subtotal"
      );

    checkoutTotal =
      document.getElementById(
        "checkout-total"
      );

    paymentOptions =
      document.querySelectorAll(
        'input[name="paymentMethod"]'
      );

    upiPaymentBox =
      document.getElementById(
        "upi-payment-box"
      );

    paymentLinkBox =
      document.getElementById(
        "payment-link-box"
      );

    codPaymentBox =
      document.getElementById(
        "cod-payment-box"
      );

    setupCheckoutMenu();
    setupPaymentOptions();
    setupCheckoutForm();
    renderCheckout();
  }
);


/* ==================================================
   4. MOBILE MENU
================================================== */

function setupCheckoutMenu() {
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
   5. PAYMENT OPTIONS
================================================== */

function setupPaymentOptions() {
  if (
    !paymentOptions ||
    paymentOptions.length === 0
  ) {
    return;
  }

  paymentOptions.forEach(
    function(option) {
      option.addEventListener(
        "change",
        function() {
          updatePaymentDisplay(
            option.value
          );

          showCheckoutMessage(
            "Payment method selected: " +
            option.value
          );
        }
      );
    }
  );
}


function updatePaymentDisplay(method) {
  if (upiPaymentBox) {
    upiPaymentBox.hidden =
      method !== "UPI";
  }

  if (paymentLinkBox) {
    paymentLinkBox.hidden =
      method !== "Payment Link";
  }

  if (codPaymentBox) {
    codPaymentBox.hidden =
      method !== "Cash on Delivery";
  }
}


/* ==================================================
   6. FORM SETUP
================================================== */

function setupCheckoutForm() {
  if (!checkoutForm) {
    return;
  }

  checkoutForm.addEventListener(
    "submit",
    handleCheckoutSubmit
  );
}


/* ==================================================
   7. READ CART
================================================== */

function getCheckoutCart() {
  try {
    const savedCart =
      localStorage.getItem(
        CHECKOUT_CART_KEY
      );

    if (!savedCart) {
      return [];
    }

    const cart =
      JSON.parse(savedCart);

    return Array.isArray(cart)
      ? cart
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
   8. DISPLAY CHECKOUT
================================================== */

function renderCheckout() {
  const cart =
    getCheckoutCart();

  updateCheckoutCartCount(cart);

  if (
    !cart ||
    cart.length === 0
  ) {
    showCheckoutMessage(
      "Your cart is empty. Please add a product first."
    );

    disableCheckoutForm();
    updateCheckoutSummary([]);

    if (checkoutItemsContainer) {
      checkoutItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">
            🛒
          </div>

          <h3>
            Your cart is empty
          </h3>

          <p>
            Please add a product before checkout.
          </p>

          <a
            class="primary-button"
            href="index.html#products"
          >
            Browse Products
          </a>
        </div>
      `;
    }

    return;
  }

  enableCheckoutForm();
  renderCheckoutItems(cart);
  updateCheckoutSummary(cart);

  showCheckoutMessage(
    "Please enter your delivery information."
  );
}


/* ==================================================
   9. DISPLAY CHECKOUT ITEMS
================================================== */

function renderCheckoutItems(cart) {
  if (!checkoutItemsContainer) {
    return;
  }

  checkoutItemsContainer.innerHTML =
    "";

  cart.forEach(
    function(item) {
      const itemElement =
        document.createElement("div");

      itemElement.className =
        "checkout-item";

      const productName =
        item.productName ||
        "Organic Snack";

      const quantity =
        Number(item.quantity) || 0;

      const price =
        Number(item.price) || 0;

      const imageUrl =
        item.imageUrl ||
        "https://placehold.co/180x140/e6f8ed/114b35?text=Snack";

      const itemTotal =
        price * quantity;

      itemElement.innerHTML = `
        <img
          class="checkout-item-image"
          src="${escapeAttribute(imageUrl)}"
          alt="${escapeAttribute(productName)}"
          loading="lazy"
        >

        <div class="checkout-item-info">
          <strong>
            ${escapeHTML(productName)}
          </strong>

          <span>
            Quantity: ${quantity}
          </span>

          <span>
            ₹${formatMoney(itemTotal)}
          </span>
        </div>
      `;

      const image =
        itemElement.querySelector(
          ".checkout-item-image"
        );

      if (image) {
        image.addEventListener(
          "error",
          function() {
            image.src =
              "https://placehold.co/180x140/e6f8ed/114b35?text=Snack";
          }
        );
      }

      checkoutItemsContainer.appendChild(
        itemElement
      );
    }
  );
}


/* ==================================================
   10. UPDATE SUMMARY
================================================== */

function updateCheckoutSummary(cart) {
  let totalQuantity =
    0;

  let subtotal =
    0;

  cart.forEach(
    function(item) {
      const quantity =
        Number(item.quantity) || 0;

      const price =
        Number(item.price) || 0;

      totalQuantity +=
        quantity;

      subtotal +=
        price * quantity;
    }
  );

  if (checkoutQuantity) {
    checkoutQuantity.textContent =
      totalQuantity;
  }

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent =
      "₹" + formatMoney(subtotal);
  }

  if (checkoutTotal) {
    checkoutTotal.textContent =
      "₹" + formatMoney(subtotal);
  }
}


/* ==================================================
   11. UPDATE CART COUNT
================================================== */

function updateCheckoutCartCount(cart) {
  if (!checkoutCartCount) {
    return;
  }

  const totalQuantity =
    cart.reduce(
      function(total, item) {
        return total +
          (Number(item.quantity) || 0);
      },
      0
    );

  checkoutCartCount.textContent =
    totalQuantity;
}


/* ==================================================
   12. SUBMIT ORDER
================================================== */

async function handleCheckoutSubmit(event) {
  event.preventDefault();

  const cart =
    getCheckoutCart();

  if (
    !cart ||
    cart.length === 0
  ) {
    showCheckoutMessage(
      "Your cart is empty. Please add a product first."
    );

    return;
  }

  const formData =
    new FormData(checkoutForm);

  const paymentMethod =
    String(
      formData.get("paymentMethod") || ""
    ).trim();

  const paymentReference =
    String(
      formData.get("paymentReference") || ""
    ).trim();

  const customerName =
    String(
      formData.get("customerName") || ""
    ).trim();

  const phone =
    String(
      formData.get("phone") || ""
    ).trim();

  const email =
    String(
      formData.get("email") || ""
    ).trim();

  const address =
    String(
      formData.get("address") || ""
    ).trim();

  const city =
    String(
      formData.get("city") || ""
    ).trim();

  const state =
    String(
      formData.get("state") || ""
    ).trim();

  const postalCode =
    String(
      formData.get("postalCode") || ""
    ).trim();

  const notes =
    String(
      formData.get("notes") || ""
    ).trim();

  const completeAddress =
    [
      address,
      city,
      state,
      postalCode
    ]
      .filter(function(value) {
        return value !== "";
      })
      .join(", ");

  const customerDetails = {
    customerName:
      customerName,

    phone:
      phone,

    email:
      email,

    address:
      completeAddress,

    paymentMethod:
      paymentMethod,

    paymentReference:
      paymentReference,

    notes:
      notes
  };

  const validationError =
    validateCheckoutDetails(
      customerDetails
    );

  if (validationError) {
    showCheckoutMessage(
      validationError
    );

    return;
  }

  const orderItems =
    cart.map(function(item) {
      return {
        productId:
          item.productId,

        quantity:
          Number(item.quantity) || 0
      };
    });

  const orderData = {
    action:
      "create-order",

    customerName:
      customerDetails.customerName,

    phone:
      customerDetails.phone,

    email:
      customerDetails.email,

    address:
      customerDetails.address,

    paymentMethod:
      customerDetails.paymentMethod,

    paymentReference:
      customerDetails.paymentReference,

    notes:
      customerDetails.notes,

    items:
      orderItems
  };

  const submitButton =
    checkoutForm.querySelector(
      ".checkout-submit-button"
    );

  if (submitButton) {
    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting Order...";
  }

  showCheckoutMessage(
    "Checking stock and submitting your order..."
  );

  try {
    const response =
      await fetch(
        CHECKOUT_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(orderData)
        }
      );

    if (!response.ok) {
      throw new Error(
        "The order service returned an error."
      );
    }

    const result =
      await response.json();

    if (
      !result ||
      result.success !== true
    ) {
      throw new Error(
        result && result.message
          ? result.message
          : "Order could not be created."
      );
    }

    const savedCheckoutData = {
      customer:
        customerDetails,

      cart:
        cart,

      orderId:
        result.orderId || "",

      totalAmount:
        result.totalAmount || 0,

      paymentStatus:
        result.paymentStatus ||
        "Payment Pending",

      orderStatus:
        result.orderStatus ||
        "Order Placed",

      savedAt:
        new Date().toISOString()
    };

    sessionStorage.setItem(
      CHECKOUT_DETAILS_KEY,
      JSON.stringify(
        savedCheckoutData
      )
    );

    localStorage.removeItem(
      CHECKOUT_CART_KEY
    );

    showOrderSuccess(
      result
    );

  } catch (error) {
    console.error(
      "Order submission error:",
      error
    );

    showCheckoutMessage(
      "Order submission failed: " +
      error.message
    );

    if (submitButton) {
      submitButton.disabled =
        false;

      submitButton.textContent =
        "Review Payment and Order";
    }
  }
}


/* ==================================================
   13. VALIDATE CHECKOUT DETAILS
================================================== */

function validateCheckoutDetails(details) {
  if (!details.customerName) {
    return "Please enter your full name.";
  }

  if (!details.phone) {
    return "Please enter your phone number.";
  }

  const phoneDigits =
    details.phone.replace(
      /\D/g,
      ""
    );

  if (phoneDigits.length < 7) {
    return "Please enter a valid phone number.";
  }

  if (!details.address) {
    return "Please enter your delivery address.";
  }

  if (!details.paymentMethod) {
    return "Please select a payment method.";
  }

  if (
    details.email &&
    !isValidEmail(details.email)
  ) {
    return "Please enter a valid email address.";
  }

  return "";
}


/* ==================================================
   14. EMAIL VALIDATION
================================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
}


/* ==================================================
   15. SUCCESS MESSAGE
================================================== */

function showOrderSuccess(result) {
  if (!checkoutForm) {
    return;
  }

  const orderId =
    result.orderId || "Pending";

  const totalAmount =
    result.totalAmount || 0;

  const paymentStatus =
    result.paymentStatus ||
    "Payment Pending";

  const orderStatus =
    result.orderStatus ||
    "Order Placed";

  checkoutForm.innerHTML = `
    <div class="order-success-box">

      <div class="order-success-icon">
        ✓
      </div>

      <h2>
        Order submitted successfully
      </h2>

      <p>
        Thank you for your order.
      </p>

      <div class="order-success-details">

        <p>
          <strong>Order ID:</strong>
          ${escapeHTML(orderId)}
        </p>

        <p>
          <strong>Total Amount:</strong>
          ₹${formatMoney(totalAmount)}
        </p>

        <p>
          <strong>Payment Status:</strong>
          ${escapeHTML(paymentStatus)}
        </p>

        <p>
          <strong>Order Status:</strong>
          ${escapeHTML(orderStatus)}
        </p>

      </div>

      <p class="order-success-note">
        Your payment will be verified by the store administrator.
      </p>

      <a
        class="primary-button"
        href="index.html"
      >
        Return to Home
      </a>

    </div>
  `;

  showCheckoutMessage("");
}


/* ==================================================
   16. FORM STATE
================================================== */

function disableCheckoutForm() {
  if (!checkoutForm) {
    return;
  }

  const controls =
    checkoutForm.querySelectorAll(
      "input, textarea, select, button"
    );

  controls.forEach(
    function(control) {
      control.disabled =
        true;
    }
  );
}


function enableCheckoutForm() {
  if (!checkoutForm) {
    return;
  }

  const controls =
    checkoutForm.querySelectorAll(
      "input, textarea, select, button"
    );

  controls.forEach(
    function(control) {
      control.disabled =
        false;
    }
  );
}


/* ==================================================
   17. DISPLAY MESSAGE
================================================== */

function showCheckoutMessage(message) {
  if (checkoutMessage) {
    checkoutMessage.textContent =
      message;
  }
}


/* ==================================================
   18. MONEY FORMAT
================================================== */

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


/* ==================================================
   19. HTML SAFETY
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

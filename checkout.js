/*
  ORGANIC SNACKS STORE
  STAGE 13 - CHECKOUT AND PAYMENT METHOD

  Current functions:
  - Load cart from localStorage
  - Display checkout items
  - Calculate subtotal and total
  - Validate customer details
  - Select payment method
  - Show payment instructions
  - Save checkout data temporarily

  Not included yet:
  - Payment verification
  - Google Sheets order creation
  - Order ID generation
  - Stock reduction
  - Email notification
*/


/* ==================================================
   1. STORAGE KEYS
================================================== */

const CHECKOUT_CART_KEY =
  "organicSnacksCart";

const CHECKOUT_DETAILS_KEY =
  "organicSnacksCheckoutDetails";


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
    setupCheckoutForm();
    setupPaymentOptions();
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
   5. CHECKOUT FORM SETUP
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
   6. PAYMENT OPTION SETUP
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


/* ==================================================
   7. PAYMENT DISPLAY
================================================== */

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
   8. READ CART
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
      "Could not read checkout cart:",
      error
    );

    return [];
  }
}


/* ==================================================
   9. DISPLAY CHECKOUT
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
   10. DISPLAY CHECKOUT ITEMS
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
   11. UPDATE CHECKOUT SUMMARY
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
   12. UPDATE CART COUNT
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
   13. HANDLE CHECKOUT SUBMISSION
================================================== */

function handleCheckoutSubmit(event) {
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

  const customerDetails = {
    customerName:
      String(
        formData.get("customerName") || ""
      ).trim(),

    phone:
      String(
        formData.get("phone") || ""
      ).trim(),

    email:
      String(
        formData.get("email") || ""
      ).trim(),

    address:
      String(
        formData.get("address") || ""
      ).trim(),

    city:
      String(
        formData.get("city") || ""
      ).trim(),

    state:
      String(
        formData.get("state") || ""
      ).trim(),

    postalCode:
      String(
        formData.get("postalCode") || ""
      ).trim(),

    notes:
      String(
        formData.get("notes") || ""
      ).trim(),

    paymentMethod:
      String(
        formData.get("paymentMethod") || ""
      ).trim(),

    paymentReference:
      String(
        formData.get("paymentReference") || ""
      ).trim()
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

  const checkoutData = {
    customer: customerDetails,
    cart: cart,
    savedAt: new Date().toISOString()
  };

  sessionStorage.setItem(
    CHECKOUT_DETAILS_KEY,
    JSON.stringify(checkoutData)
  );

  showCheckoutMessage(
    "Details saved. Payment and final order confirmation will be added in the next stage."
  );

  console.log(
    "Temporary checkout data:",
    checkoutData
  );
}


/* ==================================================
   14. VALIDATE CHECKOUT DETAILS
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

  if (!details.city) {
    return "Please enter your city.";
  }

  if (!details.state) {
    return "Please enter your state.";
  }

  if (!details.postalCode) {
    return "Please enter your postal code.";
  }

  if (
    details.email &&
    !isValidEmail(details.email)
  ) {
    return "Please enter a valid email address.";
  }

  if (!details.paymentMethod) {
    return "Please select a payment method.";
  }

  /*
    The payment reference is not required yet
    because payment verification is implemented
    in a later stage.
  */

  return "";
}


/* ==================================================
   15. EMAIL VALIDATION
================================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
}


/* ==================================================
   16. DISABLE FORM
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
      control.disabled = true;
    }
  );
}


/* ==================================================
   17. ENABLE FORM
================================================== */

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
      control.disabled = false;
    }
  );
}


/* ==================================================
   18. DISPLAY CHECKOUT MESSAGE
================================================== */

function showCheckoutMessage(message) {
  if (checkoutMessage) {
    checkoutMessage.textContent =
      message;
  }
}


/* ==================================================
   19. MONEY FORMAT
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
   20. HTML SAFETY
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

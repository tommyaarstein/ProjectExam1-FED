import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProduct } from "../api/products.js";
import { getCart, clearCart } from "../storage/cart.js";
import { countries } from "../data/countries.js";

renderHeader("../");
renderFooter("../");

const checkoutForm = document.querySelector("#checkout-form");
const summaryStatus = document.querySelector("#checkout-summary-status");
const summaryProducts = document.querySelector("#checkout-summary-products");
const summaryTotals = document.querySelector("#checkout-summary-totals");
const checkoutTotal = document.querySelector("#checkout-total");
const mobileTotal = document.querySelector("#checkout-mobile-total");
const formStatus = document.querySelector("#checkout-form-status");

const countryInput = document.querySelector("#country");
const countryOptions = document.querySelector("#country-options");
const emailInput = document.querySelector("#checkout-email");

const mobileSubmitButton = document.querySelector(
  ".checkout-page__mobile-submit",
);
const desktopSubmitButton = document.querySelector(
  ".checkout-page__desktop-submit",
);

let cartProducts = [];
let orderTotal = 0;

function formatPrice(price) {
  return `${Number(price).toFixed(2)},-`;
}

function renderCountryOptions(countryList) {
  countryOptions.replaceChildren();

  countryList.forEach(function (country) {
    const option = document.createElement("option");
    option.value = country;

    countryOptions.append(option);
  });
}

function filterCountries() {
  const searchText = countryInput.value.trim().toLowerCase();

  const matchingCountries = countries.filter(function (country) {
    return country.toLowerCase().startsWith(searchText);
  });

  countryInput.setCustomValidity("");
  renderCountryOptions(matchingCountries);
}

function validateCountry() {
  const enteredCountry = countryInput.value.trim().toLowerCase();

  const selectedCountry = countries.find(function (country) {
    return country.toLowerCase() === enteredCountry;
  });

  if (!selectedCountry) {
    countryInput.setCustomValidity("Choose a country from the list.");
    return false;
  }

  countryInput.value = selectedCountry;
  countryInput.setCustomValidity("");

  return true;
}

function createSummaryProduct(product) {
  const currentPrice = Number(product.discountedPrice);
  const lineTotal = currentPrice * product.quantity;

  const listItem = document.createElement("li");
  listItem.className = "checkout-summary__product";

  const productName = document.createElement("span");
  productName.className = "checkout-summary__product-name";
  productName.textContent = product.title;

  const productPrice = document.createElement("span");
  productPrice.className = "checkout-summary__product-price";
  productPrice.textContent = formatPrice(lineTotal);

  const productQuantity = document.createElement("span");
  productQuantity.className = "checkout-summary__product-quantity";
  productQuantity.textContent = `${product.quantity} × ${formatPrice(currentPrice)}`;

  listItem.append(productName, productPrice, productQuantity);

  return listItem;
}

function updatePurchaseButtons(disabled) {
  mobileSubmitButton.disabled = disabled;
  desktopSubmitButton.disabled = disabled;
}

function renderOrderSummary() {
  summaryProducts.replaceChildren();

  cartProducts.forEach(function (product) {
    summaryProducts.append(createSummaryProduct(product));
  });

  orderTotal = cartProducts.reduce(function (total, product) {
    return total + Number(product.discountedPrice) * product.quantity;
  }, 0);

  const formattedTotal = formatPrice(orderTotal);

  checkoutTotal.textContent = formattedTotal;
  mobileTotal.textContent = formattedTotal;

  summaryStatus.hidden = true;
  summaryProducts.hidden = false;
  summaryTotals.hidden = false;

  const userIsLoggedIn = Boolean(localStorage.getItem("accessToken"));

  updatePurchaseButtons(!userIsLoggedIn);

  if (!userIsLoggedIn) {
    formStatus.textContent =
      "You must be logged in before completing your purchase.";
  }
}

async function loadCheckout() {
  const storedCart = getCart();

  if (storedCart.length === 0) {
    summaryStatus.textContent =
      "Your cart is empty. Return to the cart before checking out.";
    updatePurchaseButtons(true);
    return;
  }

  try {
    cartProducts = await Promise.all(
      storedCart.map(async function (cartItem) {
        const product = await getProduct(cartItem.id);

        return {
          ...product,
          quantity: cartItem.quantity,
        };
      }),
    );

    renderOrderSummary();
  } catch (error) {
    console.error(error);
    summaryStatus.textContent =
      "We could not load your order. Please try again.";
    updatePurchaseButtons(true);
  }
}

countryInput.addEventListener("input", filterCountries);

checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  formStatus.textContent = "";

  const countryIsValid = validateCountry();

  if (!countryIsValid || !checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  if (cartProducts.length === 0) {
    formStatus.textContent =
      "Your cart is empty. Return to the cart before checking out.";
    return;
  }

  if (!localStorage.getItem("accessToken")) {
    formStatus.textContent =
      "You must be logged in before completing your purchase.";
    return;
  }

  updatePurchaseButtons(true);

  const formData = new FormData(checkoutForm);

  const itemCount = cartProducts.reduce(function (total, product) {
    return total + product.quantity;
  }, 0);

  const completedOrder = {
    customerName: formData.get("fullName").trim(),
    itemCount,
    total: orderTotal,
    completedAt: new Date().toISOString(),
  };

  sessionStorage.setItem("completedOrder", JSON.stringify(completedOrder));

  clearCart();

  window.location.href = "../success/index.html";
});

const savedEmail = localStorage.getItem("email");

if (savedEmail) {
  emailInput.value = savedEmail;
}

renderCountryOptions(countries);
loadCheckout();

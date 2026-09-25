import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProduct } from "../api/products.js";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../storage/cart.js";

renderHeader("../");
renderFooter("../");

const cartStatus = document.querySelector("#cart-status");
const cartFeedback = document.querySelector("#cart-feedback");
const cartLayout = document.querySelector("#cart-layout");
const cartList = document.querySelector("#cart-list");
const cartHeadingCount = document.querySelector("#cart-heading-count");
const clearCartButton = document.querySelector("#clear-cart-button");

const productsTotal = document.querySelector("#cart-products-total");
const savingsRow = document.querySelector("#cart-savings-row");
const savingsAmount = document.querySelector("#cart-savings");
const cartTotal = document.querySelector("#cart-total");

let cartProducts = [];
let feedbackTimeout;

function formatPrice(price) {
  return `${Number(price).toFixed(2)},-`;
}

function showFeedback(message) {
  cartFeedback.textContent = message;
  cartFeedback.hidden = false;

  window.clearTimeout(feedbackTimeout);

  feedbackTimeout = window.setTimeout(function () {
    cartFeedback.hidden = true;
  }, 3000);
}

function createQuantityButton(
  action,
  productId,
  label,
  icon,
  disabled = false,
) {
  const button = document.createElement("button");
  button.className = "cart-item__quantity-button";
  button.type = "button";
  button.dataset.action = action;
  button.dataset.productId = productId;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;

  const buttonIcon = document.createElement("img");
  buttonIcon.src = `../assets/icons/16px/${icon}.png`;
  buttonIcon.alt = "";
  buttonIcon.width = 16;
  buttonIcon.height = 16;

  button.append(buttonIcon);

  return button;
}

function createCartItem(product) {
  const originalPrice = Number(product.price);
  const currentPrice = Number(product.discountedPrice);
  const hasDiscount = currentPrice < originalPrice;

  const cartItem = document.createElement("li");
  cartItem.className = "cart-item";
  cartItem.dataset.productId = product.id;

  const imageLink = document.createElement("a");
  imageLink.className = "cart-item__image-link";
  imageLink.href = `../product/index.html?id=${encodeURIComponent(product.id)}`;
  imageLink.setAttribute("aria-label", `View ${product.title}`);

  const productImage = document.createElement("img");
  productImage.className = "cart-item__image";
  productImage.src = product.image.url;
  productImage.alt = product.image.alt || product.title;

  imageLink.append(productImage);

  const productInformation = document.createElement("div");
  productInformation.className = "cart-item__information";

  const productTitle = document.createElement("h2");
  productTitle.className = "cart-item__title";

  const titleLink = document.createElement("a");
  titleLink.href = `../product/index.html?id=${encodeURIComponent(product.id)}`;
  titleLink.textContent = product.title;

  productTitle.append(titleLink);

  const productPrices = document.createElement("div");
  productPrices.className = "cart-item__prices";

  const currentPriceElement = document.createElement("span");
  currentPriceElement.className = "cart-item__current-price";
  currentPriceElement.textContent = formatPrice(currentPrice);

  productPrices.append(currentPriceElement);

  if (hasDiscount) {
    const originalPriceElement = document.createElement("del");
    originalPriceElement.className = "cart-item__original-price";
    originalPriceElement.textContent = formatPrice(originalPrice);

    productPrices.append(originalPriceElement);
  }

  productInformation.append(productTitle, productPrices);

  const quantityControls = document.createElement("div");
  quantityControls.className = "cart-item__quantity";

  const decreaseButton = createQuantityButton(
    "decrease",
    product.id,
    `Decrease quantity of ${product.title}`,
    "minus",
    product.quantity === 1,
  );

  const quantityValue = document.createElement("span");
  quantityValue.className = "cart-item__quantity-value";
  quantityValue.textContent = product.quantity;
  quantityValue.setAttribute("aria-label", `Quantity: ${product.quantity}`);

  const increaseButton = createQuantityButton(
    "increase",
    product.id,
    `Increase quantity of ${product.title}`,
    "plus",
  );

  quantityControls.append(decreaseButton, quantityValue, increaseButton);

  const lineTotal = document.createElement("p");
  lineTotal.className = "cart-item__line-total";
  lineTotal.textContent = formatPrice(currentPrice * product.quantity);

  const removeButton = document.createElement("button");
  removeButton.className = "cart-item__remove-button";
  removeButton.type = "button";
  removeButton.dataset.action = "remove";
  removeButton.dataset.productId = product.id;
  removeButton.setAttribute("aria-label", `Remove ${product.title} from cart`);

  const removeIcon = document.createElement("img");
  removeIcon.src = "../assets/icons/24px/trash.png";
  removeIcon.alt = "";
  removeIcon.width = 24;
  removeIcon.height = 24;

  removeButton.append(removeIcon);

  cartItem.append(
    imageLink,
    productInformation,
    quantityControls,
    lineTotal,
    removeButton,
  );

  return cartItem;
}

function calculateTotals() {
  return cartProducts.reduce(
    (totals, product) => {
      const originalPrice = Number(product.price);
      const currentPrice = Number(product.discountedPrice);

      totals.products += currentPrice * product.quantity;
      totals.savings += (originalPrice - currentPrice) * product.quantity;

      return totals;
    },
    {
      products: 0,
      savings: 0,
    },
  );
}

function renderCart() {
  const itemCount = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const itemText = itemCount === 1 ? "item" : "items";

  cartHeadingCount.textContent = ` - ${itemCount} ${itemText}`;
  cartList.replaceChildren();

  if (cartProducts.length === 0) {
    cartStatus.textContent = "Your cart is empty.";
    cartStatus.hidden = false;
    cartLayout.hidden = true;
    clearCartButton.hidden = true;
    return;
  }

  cartProducts.forEach(function (product) {
    cartList.append(createCartItem(product));
  });

  const totals = calculateTotals();

  productsTotal.textContent = formatPrice(totals.products);
  savingsAmount.textContent = formatPrice(totals.savings);
  cartTotal.textContent = formatPrice(totals.products);

  savingsRow.hidden = totals.savings <= 0;
  cartStatus.hidden = true;
  cartLayout.hidden = false;
  clearCartButton.hidden = false;
}

function changeQuantity(productId, change) {
  const product = cartProducts.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const newQuantity = product.quantity + change;

  if (newQuantity < 1) {
    return;
  }

  product.quantity = newQuantity;
  updateCartQuantity(productId, newQuantity);
  renderCart();
}

function removeProduct(productId) {
  const product = cartProducts.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  removeFromCart(productId);
  cartProducts = cartProducts.filter((item) => item.id !== productId);

  renderCart();
  showFeedback(`${product.title} removed from cart.`);
}

cartList.addEventListener("click", function (event) {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) {
    return;
  }

  const productId = actionButton.dataset.productId;
  const action = actionButton.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeProduct(productId);
  }
});

clearCartButton.addEventListener("click", function () {
  clearCart();
  cartProducts = [];

  renderCart();
  showFeedback("Cart cleared.");
});

async function loadCart() {
  const storedCart = getCart();

  if (storedCart.length === 0) {
    renderCart();
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

    renderCart();
  } catch (error) {
    console.error(error);
    cartStatus.textContent = "We could not load your cart. Please try again.";
    cartStatus.hidden = false;
    cartLayout.hidden = true;
    clearCartButton.hidden = true;
  }
}

loadCart();

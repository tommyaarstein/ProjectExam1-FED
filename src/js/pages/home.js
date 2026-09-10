import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProducts } from "../api/products.js";

renderHeader();
renderFooter();

const carouselContent = document.querySelector("#carousel-content");
const carouselPrevious = document.querySelector("#carousel-previous");
const carouselNext = document.querySelector("#carousel-next");
const carouselIndicators = document.querySelector("#carousel-indicators");

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const productsStatus = document.querySelector("#products-status");
const productsError = document.querySelector("#products-error");
const productsEmpty = document.querySelector("#products-empty");
const retryButton = document.querySelector("#retry-products");

let featuredProducts = [];
let currentFeaturedIndex = 0;

function formatPrice(price) {
  return `${price.toFixed(2)},-`;
}

function createProductCard(product) {
  const listItem = document.createElement("li");
  listItem.className = "product-card";

  const link = document.createElement("a");
  link.href = `./pages/product.html?id=${encodeURIComponent(product.id)}`;

  const image = document.createElement("img");
  image.src = product.image.url;
  image.alt = product.image.alt || product.title;

  const title = document.createElement("h3");
  title.textContent = product.title;

  const prices = document.createElement("div");
  prices.className = "product-card__prices";

  const currentPrice = document.createElement("p");
  currentPrice.className = "product-card__price";
  currentPrice.textContent = formatPrice(product.discountedPrice);

  prices.append(currentPrice);

  if (product.discountedPrice < product.price) {
    const originalPrice = document.createElement("s");
    originalPrice.className = "product-card__original-price";
    originalPrice.textContent = `${product.price.toFixed(2)},-`;

    prices.append(originalPrice);
  }

  link.append(image, title, prices);
  listItem.append(link);

  return listItem;
}

function showCarouselMessage(message) {
  carouselContent.textContent = "";

  const messageElement = document.createElement("p");
  messageElement.className = "loading-message";
  messageElement.textContent = message;

  carouselContent.append(messageElement);
}

function updateCarouselIndicators() {
  carouselIndicators.textContent = "";

  featuredProducts.forEach(function (product, index) {
    const indicator = document.createElement("span");
    indicator.className = "carousel__indicator";
    indicator.setAttribute("aria-hidden", "true");

    if (index === currentFeaturedIndex) {
      indicator.classList.add("carousel__indicator--active");
    }

    carouselIndicators.append(indicator);
  });
}

function showFeaturedProduct() {
  const product = featuredProducts[currentFeaturedIndex];

  carouselContent.textContent = "";

  const featuredProduct = document.createElement("article");
  featuredProduct.className = "featured-card";

  const productInformation = document.createElement("div");
  productInformation.className = "featured-card__information";

  const label = document.createElement("p");
  label.className = "featured-card__label";
  label.textContent = "This week's pick";

  const title = document.createElement("h3");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "featured-card__description";
  description.textContent = product.description;

  const prices = document.createElement("div");
  prices.className = "featured-card__prices";

  const currentPrice = document.createElement("p");
  currentPrice.className = "featured-card__price";
  currentPrice.textContent = formatPrice(product.discountedPrice);

  prices.append(currentPrice);

  if (product.discountedPrice < product.price) {
    const originalPrice = document.createElement("s");
    originalPrice.className = "featured-card__original-price";
    originalPrice.textContent = formatPrice(product.price);

    prices.append(originalPrice);
  }

  const link = document.createElement("a");
  link.className = "featured-card__link";
  link.href = `./pages/product.html?id=${encodeURIComponent(product.id)}`;
  link.textContent = "View product";

  const image = document.createElement("img");
  image.className = "featured-card__image";
  image.src = product.image.url;
  image.alt = product.image.alt || product.title;

  productInformation.append(label, title, description, prices, link);
  featuredProduct.append(productInformation, image);
  carouselContent.append(featuredProduct);

  updateCarouselIndicators();
}

function showPreviousProduct() {
  currentFeaturedIndex = currentFeaturedIndex - 1;

  if (currentFeaturedIndex < 0) {
    currentFeaturedIndex = featuredProducts.length - 1;
  }

  showFeaturedProduct();
}

function showNextProduct() {
  currentFeaturedIndex = currentFeaturedIndex + 1;

  if (currentFeaturedIndex >= featuredProducts.length) {
    currentFeaturedIndex = 0;
  }

  showFeaturedProduct();
}

async function loadProducts() {
  productsStatus.hidden = false;
  productsError.hidden = true;
  productsEmpty.hidden = true;
  productList.textContent = "";
  productCount.textContent = "";

  carouselPrevious.disabled = true;
  carouselNext.disabled = true;
  carouselIndicators.textContent = "";
  showCarouselMessage("Loading featured products...");

  try {
    const products = await getProducts();

    productsStatus.hidden = true;

    if (products.length === 0) {
      productsEmpty.hidden = false;
      showCarouselMessage("No featured products are currently available.");
      return;
    }

    featuredProducts = products.slice(0, 3);
    currentFeaturedIndex = 0;

    carouselPrevious.disabled = false;
    carouselNext.disabled = false;

    showFeaturedProduct();

    const productsToShow = products.slice(0, 12);
    productCount.textContent = `${productsToShow.length} items`;

    productsToShow.forEach(function (product) {
      const productCard = createProductCard(product);
      productList.append(productCard);
    });
  } catch (error) {
    productsStatus.hidden = true;
    productsError.hidden = false;

    featuredProducts = [];
    showCarouselMessage("We could not load the featured products.");

    console.error(error);
  }
}

carouselPrevious.addEventListener("click", showPreviousProduct);
carouselNext.addEventListener("click", showNextProduct);
retryButton.addEventListener("click", loadProducts);

loadProducts();

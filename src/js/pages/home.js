import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProducts } from "../api/products.js";

renderHeader();
renderFooter();

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const productsStatus = document.querySelector("#products-status");
const productsError = document.querySelector("#products-error");
const productsEmpty = document.querySelector("#products-empty");
const retryButton = document.querySelector("#retry-products");

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
  currentPrice.textContent = `${product.discountedPrice.toFixed(2)},-`;

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

async function loadProducts() {
    productsStatus.hidden = false;
    productsError.hidden = true;
    productsEmpty.hidden = true;
    productList.textContent = "";
    productCount.textContent = "";

    try {
        const products = await getProducts();

        productsStatus.hidden = true;

        if (products.length === 0) {
            productsEmpty.hidden = false;
            return;
        }

        const productsToShow = products.slice(0, 12);
        productCount.textContent = `${productsToShow.length} items`;

        productsToShow.forEach(function (product) {
            const productCard = createProductCard(product);
            productList.append(productCard);
        });
    } catch (error) {
        productsStatus.hidden = true;
        productsError.hidden = false;
        console.error(error);
    }
}

retryButton.addEventListener("click", loadProducts);

loadProducts();
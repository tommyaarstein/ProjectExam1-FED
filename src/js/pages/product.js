import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { getProduct } from "../api/products.js";

renderHeader("../");
renderFooter("../");

const productStatus = document.querySelector("#product-status");
const productDetails = document.querySelector("#product-details");

const queryString = window.location.search;
const urlParameters = new URLSearchParams(queryString);
const productId = urlParameters.get("id");

function formatPrice(price) {
    return `${Number(price).toFixed(2)},-`;
}

function renderStars(container, rating) {
    container.textContent = "";

    const numericRating = Number(rating);

    for (let starNumber = 1; starNumber <= 5; starNumber++) {
        const star = document.createElement("img");

        if (numericRating >= starNumber) {
            star.src = "../assets/icons/24px/star-filled.png";
        } else if (numericRating >= starNumber - 0.5) {
            star.src = "../assets/icons/24px/star-half.png";
        } else {
            star.src = "../assets/icons/24px/star.png"
        }

        star.alt = "";
        star.width = 24;
        star.height = 24;

        container.append(star);
    }

    container.setAttribute("aria-label", `${numericRating} out of 5 stars`);
}

function showError(message) {
    productStatus.textContent = message;
    productDetails.hidden = true;
}

function renderReviews(reviews) {
    const reviewsList = document.querySelector("#reviews-list");
    const reviewsCount = document.querySelector("#reviews-count")

    reviewsList.textContent = "";

    const numberOfReviews = reviews.length;
    const reviewText = numberOfReviews === 1 ? "review" : "reviews";

    reviewsCount.textContent = `${numberOfReviews} ${reviewText}`;

    if (numberOfReviews === 0) {
        const message = document.createElement("p");
        message.textContent = "This product has no reviews yet."
        reviewsList.append(message);
        return;
    }

    reviews.forEach(function (review) {
      const reviewCard = document.createElement("article");
      reviewCard.className = "review-card";

      const reviewHeader = document.createElement("div");
      reviewHeader.className = "review-card__header";

      const username = document.createElement("h3");
      username.textContent = review.username;

      const rating = document.createElement("span");
      rating.className = "review-card__rating";

      renderStars(rating, review.rating);

      const description = document.createElement("p");
      description.textContent = review.description;

      reviewHeader.append(username, rating);
      reviewCard.append(reviewHeader, description);
      reviewsList.append(reviewCard);
    });
}

function renderTags(container, tags) {
  container.textContent = "";

  if (!Array.isArray(tags) || tags.length === 0) {
    container.hidden = true;
    return;
  }

  tags.forEach(function (tag) {
    const tagItem = document.createElement("li");
    tagItem.className = "product-page__tag";
    tagItem.textContent = tag;

    container.append(tagItem);
  });
}

function renderProduct(product) {
    const reviews = Array.isArray(product.reviews)
    ? product.reviews
    : [];

    const originalPrice = Number(product.price);
    const currentPrice = Number(product.discountedPrice);

    const hasDiscount = currentPrice < originalPrice;

    let discountPercentage = 0;

    if (hasDiscount) {
        discountPercentage = Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100
        );
    }

    const numberOfReviews = reviews.length;
    const reviewText = numberOfReviews === 1 ? "review" : "reviews";

    productDetails.innerHTML = `
    <a class="product-page__back-link" href="../index.html">
      ← Back to shop
    </a>

    <div class="product-page__content">
      <div class="product-page__image-wrapper">
        <img
          id="product-image"
          class="product-page__image"
          src=""
          alt=""
        >

        <span
          id="product-discount"
          class="product-page__discount"
        ></span>
      </div>

      <div class="product-page__information">
        <ul id="product-tags" class="product-page__tags" aria-label=product tags"></ul>

        <div class="product-page__title-row">
          <h1 id="product-title"></h1>

          <button
            class="product-page__share-button"
            type="button"
            aria-label="Share product"
          >
            <img
              src="../assets/icons/24px/share.png"
              alt=""
              width="24"
              height="24"
            >
          </button>
        </div>

        <div class="product-page__rating">
          <span
            id="product-rating-stars"
            class="product-page__stars"
          ></span>

          <span id="product-rating-text"></span>
        </div>

        <p
          id="product-description"
          class="product-page__description"
        ></p>

        <div class="product-page__purchase">
          <div class="product-page__prices">
            <span
              id="product-current-price"
              class="product-page__current-price"
            ></span>

            <del
              id="product-original-price"
              class="product-page__original-price"
            ></del>
          </div>

          <a
            class="button product-page__purchase-button"
            href="./login.html"
          >
            Log in to purchase
          </a>
        </div>
      </div>
    </div>

    <section
      class="product-page__reviews"
      aria-labelledby="reviews-heading"
    >
      <div class="product-page__reviews-heading">
        <h2 id="reviews-heading">Customer reviews</h2>
        <p id="reviews-count"></p>
      </div>

      <div id="reviews-list" class="reviews-list"></div>
    </section>
  `;

  const productImage = document.querySelector("#product-image");
  const productDiscount = document.querySelector("#product-discount");
  const productTags = document.querySelector("#product-tags");
  const productTitle = document.querySelector("#product-title");

  const productRatingStars = document.querySelector("#product-rating-stars");
  const productRatingText = document.querySelector("#product-rating-text");
  const productDescription = document.querySelector("#product-description");
  const productCurrentPrice = document.querySelector("#product-current-price");
  const productOriginalPrice = document.querySelector("#product-original-price");

  productImage.src = product.image.url;
  productImage.alt = product.image.alt || product.title;

  renderTags(productTags, product.tags);
  productTitle.textContent = product.title;
  productDescription.textContent = product.description;

  renderStars(productRatingStars, product.rating);

  productRatingText.textContent =  `${Number(product.rating).toFixed(1)} from ` + `${numberOfReviews} ${reviewText}`;

  productCurrentPrice.textContent = formatPrice(currentPrice);

  if (hasDiscount) {
    productOriginalPrice.textContent = formatPrice(originalPrice);
    productDiscount.textContent = `${discountPercentage}% off`;
  } else {
    productOriginalPrice.hidden = true;
    productDiscount.hidden = true;
  }

  document.title = `${product.title} | TING`;

  renderReviews(reviews);

  productStatus.hidden = true;
  productDetails.hidden = true;
}

async function loadProduct() {
    if (!productId) {
        showError("No product was selected.");
        return;
    }

    try {
        const product = await getProduct(productId);
        renderProduct(product);
    } catch (error) {
        console.error(error);
        showError("We could not load this product. Please try again.");
    }
}

loadProduct();
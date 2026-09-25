const CART_STORAGE_KEY = "cart";

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

  window.dispatchEvent(
    new CustomEvent("cartUpdated", {
      detail: {
        cart,
      },
    }),
  );

  return cart;
}

export function getCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    const cart = JSON.parse(storedCart);

    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Could not read the shopping cart.", error);
    return [];
  }
}

export function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
    });
  }

  return saveCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const newQuantity = Number(quantity);
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem || !Number.isInteger(newQuantity) || newQuantity < 1) {
    return cart;
  }

  cartItem.quantity = newQuantity;

  return saveCart(cart);
}

export function removeFromCart(productId) {
  const updatedCart = getCart().filter((item) => item.id !== productId);

  return saveCart(updatedCart);
}

export function clearCart() {
  return saveCart([]);
}

export function getCartItemCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}
import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer-hide");
  if (cartItems.length === 0) {
    cartFooter.style.display = "none";
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }
  let total = 0;
  cartItems.forEach(item => { 
    total += parseFloat(item.FinalPrice)
  });
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  cartFooter.style.display = "block";
  document.getElementById("cart-total").textContent = `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

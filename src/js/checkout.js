import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();
const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

const zipCode = document.getElementById("zip");
zipCode.addEventListener("blur", () => {
  const zipValue = zipCode.value;
  if (zipValue.length === 5) {
    order.calculateOrderTotal();
  }
});

const form = document.getElementById("checkout-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  order.checkout();
});

import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

const topProducts = document.getElementById("top-products");

if (category === "sleeping-bags") {
  topProducts.textContent = "Top Products: Sleeping Bags";
} else {
  topProducts.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

productList.init();

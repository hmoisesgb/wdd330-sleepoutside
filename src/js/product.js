import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productID = getParam("product");
const dataSource = new ExternalServices("tents");

const product = new ProductDetails(productID, dataSource);
product.init();

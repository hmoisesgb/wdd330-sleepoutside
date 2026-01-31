import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
constructor(productId, dataSource){
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
}
async init(){
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
}
addProductToCart(){
  const cartItems = getLocalStorage("so-cart") || []; // get cart array of items from local storage if null set to empty array
  if (!cartItems.find(item => item.Id === this.product.Id)){
    this.product.Quantity = 1;
    cartItems.push(this.product); // add the product to the cartItems array
    setLocalStorage("so-cart", cartItems); // save updated cart array to local storage
  }
  else{
    this.product = cartItems.find(item => item.Id === this.product.Id);
    let quantity = parseInt(this.product.Quantity);
    quantity += 1;
    this.product.Quantity = quantity;
    setLocalStorage("so-cart", cartItems);
  }
  
}
renderProductDetails(){
    productDetailsTemplate(this.product);
}
}

function productDetailsTemplate(product) {
    document.querySelector('h3').textContent = product.Brand.Name;
    document.querySelector('h2').textContent = product.NameWithoutBrand;
    document.getElementById('productImage').src = product.Images.PrimaryLarge;
    document.getElementById('productImage').alt = product.NameWithoutBrand;
    document.getElementById('productPrice').textContent = product.FinalPrice;
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}
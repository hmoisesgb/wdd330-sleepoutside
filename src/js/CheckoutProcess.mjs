import { getLocalStorage, removeAllAlerts, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items){
    const packagedItems = items.map((item) => {
        return {
            id: item.Id,
            price: item.FinalPrice,
            name: item.Name,
            quantity: item.Quantity,      
        }
    })
    return packagedItems;
}


export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.subTotal = 0;
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }
    init(){
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }
    calculateItemSubTotal(){
        const cartItems = this.list;
        let total = 0;
        cartItems.forEach((item) => {
            total += parseFloat(item.FinalPrice * item.Quantity);
        });
        this.itemTotal = total;
        const subTotal = document.querySelector(`${this.outputSelector} #subtotal`);
        subTotal.textContent = `Subtotal = $${this.itemTotal.toFixed(2)}`;
    }
    calculateOrderTotal(){
        let totalQuantity = 0;
        this.list.forEach((item) => {
            totalQuantity += item.Quantity;
        });
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10 + (2 * (totalQuantity - 1));
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        
        this.displayOrderSummary();
    }
    displayOrderSummary(){
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #total`);
        tax.textContent = `Tax = $${this.tax.toFixed(2)}`;
        shipping.textContent = `Shipping = $${this.shipping.toFixed(2)}`;
        orderTotal.textContent = `Total = $${this.orderTotal.toFixed(2)}`;
    }
    async checkout(){
        const form = document.forms["checkout-form"];
        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.items = packageItems(this.list);
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        try {
            const response = await services.checkout(order);
            console.log(response);
            localStorage.removeItem(this.key);
            window.location.assign("/checkout/success.html");
        } catch (error) {
            removeAllAlerts();
            if (error.name === "servicesError" && error.message){
                Object.values(error.message).forEach((message) => alertMessage(message));
            }
            console.log(error);
        }
    }
}
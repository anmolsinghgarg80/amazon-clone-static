import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummay.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import '../data/cart-class.js';

async function loadPage() {
    await loadProductsFetch();
    // throw creates an error
    await new Promise((resolve) => {
        loadCart(()=>{
            resolve();
        });
    });

    renderOrderSummary();
    renderPaymentSummary(); 
}
loadPage();
/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })

]).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

// new Promise( (resolve) => {
//     loadProducts( () => {
//         resolve();
//     });
// }).then( () => {
//     return new Promise((resolve) => {
//         loadCart(() => {
//             resolve();
//         });
//     });
// }).then(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
// });

// loadProducts(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
// });

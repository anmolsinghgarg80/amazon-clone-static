import { getProduct, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { orders } from "../data/orders.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";

// Helper function to format date
function formatDate(isoDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoDate).toLocaleDateString(undefined, options);
}

// Render orders dynamically
function renderOrders() {
  let ordersHTML = "";

  orders.forEach((order) => {
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formatDate(order.orderTime)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        
    `;

    let detailsGridHTML = "";

    order.products.forEach((product) => {
      const productId = product.productId;
      const matchingProduct = getProduct(productId);

      detailsGridHTML += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
          </div>
          <div class="product-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-delivery-date">
              Arriving on: ${formatDate(product.estimatedDeliveryTime)}
            </div>
            <div class="product-quantity">
              Quantity: ${product.quantity}
            </div>
            <button class="buy-again-button js-buy-again-button button-primary"
            data-product-id="${productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
                  <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
        </div>
      `;
    });

     ordersHTML += detailsGridHTML + "</div>";

    updateCartQuantity();
  });

  const ordersGrid = document.querySelector(".js-orders-grid");
  ordersGrid.innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      // Changed from productId to product-id to match the data attribute in HTML
      const productId = button.dataset.productId;
      
      addToCart(productId, 1);
      updateCartQuantity();
    });
  });
}

// Ensure products are loaded before rendering orders
loadProducts(() => {
  renderOrders();
});

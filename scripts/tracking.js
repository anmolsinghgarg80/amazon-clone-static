import { getProduct } from "../../data/products.js";
import { loadProducts } from "../../data/products.js";
import { orders } from "../../data/orders.js";
import { updateCartQuantity } from "../../data/cart.js";

// Helper function to format date
function formatDate(isoDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoDate).toLocaleDateString(undefined, options);
}

function renderTracking() {
  // Get order and product IDs from URL parameters
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  // For testing - log the parameters
  console.log('OrderId:', orderId);
  console.log('ProductId:', productId);

  // Find the matching order and product
  const order = orders.find(order => order.id === orderId);
  const orderProduct = order?.products.find(prod => prod.productId === productId);

  // For testing - log the found order and product
  console.log('Found order:', order);
  console.log('Found product:', orderProduct);
  
  if (!order || !orderProduct) {
    document.querySelector('.js-order-tracking').innerHTML = `
      <div class="error-message">
        Order not found. <a href="orders.html" class="link-primary">Return to orders</a>
      </div>
    `;
    return;
  }

  const product = getProduct(orderProduct.productId);
  
  // Default to 'Shipped' if no status is present
  const status = orderProduct.status || 'Shipped';

  let trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${formatDate(orderProduct.estimatedDeliveryTime)}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${status === 'Preparing' ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${status === 'Shipped' ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${status === 'Delivered' ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${
        status === 'Preparing' ? '15%' :
        status === 'Shipped' ? '50%' :
        status === 'Delivered' ? '100%' : '50%'
      }"></div>
    </div>
  `;
    
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
  updateCartQuantity();
}

// Ensure products are loaded before rendering
loadProducts(() => {
  renderTracking();
});
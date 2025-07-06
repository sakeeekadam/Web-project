document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});

function displayOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        
        if (orders.length === 0) {
            showEmptyOrders();
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.orderId}</div>
                        <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status ${order.status === 'Delivered' ? 'status-delivered' : 'status-processing'}">
                        ${order.status}
                    </span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">₹${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <div class="total-amount">
                        <strong>Total:</strong> ₹${order.total}
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        showEmptyOrders();
    }
}

function showEmptyOrders() {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = `
        <div class="empty-orders">
            <i class="fa-solid fa-box-open"></i>
            <h2>No Orders Yet</h2>
            <p>Your ordered items will appear here</p>
        </div>
    `;
} 
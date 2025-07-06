// Checkout page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
    setupCheckoutForm();
    checkProductCategory();
    setupPaymentMethodHandling();
    setupFieldValidation();
});

function setupPaymentMethodHandling() {
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    const onlinePaymentDetails = document.getElementById('online-payment-details');

    paymentInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'online') {
                onlinePaymentDetails.style.display = 'block';
            } else {
                onlinePaymentDetails.style.display = 'none';
            }
        });
    });
}

function checkProductCategory() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        const frameFields = document.getElementById('frame-fields');
        
        // Check if any item in cart is a frame
        const hasFrame = cart.some(item => {
            const name = item.name.toLowerCase();
            return name.includes('frame') || name.includes('wedding');
        });

        // Show frame-specific fields if there's a frame in the cart
        frameFields.style.display = hasFrame ? 'block' : 'none';

        // Make frame-specific fields required if visible
        if (hasFrame) {
            document.getElementById('couple-names').required = true;
            document.getElementById('wedding-date').required = true;
            document.getElementById('photo-upload').required = true;
        }
    }
}

function setupFieldValidation() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');

    // Email validation
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.setCustomValidity('Invalid email address');
        } else {
            emailError.textContent = '';
            emailInput.setCustomValidity('');
        }
    });

    // Phone validation
    phoneInput.addEventListener('input', (e) => {
        const phone = e.target.value;
        // Remove any non-digit characters
        e.target.value = phone.replace(/\D/g, '');
        
        if (phone.length !== 10) {
            phoneError.textContent = 'Phone number must be 10 digits';
            phoneInput.setCustomValidity('Invalid phone number');
        } else {
            phoneError.textContent = '';
            phoneInput.setCustomValidity('');
        }
    });
}

function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const urlParams = new URLSearchParams(window.location.search);
    const orderNowItemId = urlParams.get('orderNow');
    
    if (orderNowItemId) {
        // Handle single item order from "Order Now" button
        const product = products.find(p => p.id.toString() === orderNowItemId);
        if (product) {
            let subtotal = product.price;
            checkoutItemsContainer.innerHTML = `
                <div class="checkout-item" data-product-id="${product.id}">
                    <div class="item-content">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="item-details">
                            <h3>${product.name}</h3>
                            <p class="price">₹${product.price}</p>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeItem(${product.id})">✖</button>
                </div>
            `;
            updateTotals();
            return;
        }
    }

    // Handle cart checkout
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="checkout-item" data-product-id="${item.id}">
                <div class="item-content">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">₹${item.price}</p>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem(${item.id})">✖</button>
            </div>
        `).join('');

        updateTotals();
    } else {
        window.location.href = 'cart.html';
    }
}

function removeItem(productId) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNowItemId = urlParams.get('orderNow');

    if (orderNowItemId) {
        // If this is a direct order and we're removing the item, go back to previous page
        window.history.back();
        return;
    }

    // Remove from cart in localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // If cart is empty after removal, redirect to cart page
        if (updatedCart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        // Re-render the checkout items
        displayCheckoutItems();
    }
}

function updateTotals() {
    let subtotal = 0;
    const items = document.querySelectorAll('.checkout-item');
    
    items.forEach(item => {
        const priceText = item.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('₹', ''));
        subtotal += price;
    });

    document.getElementById('checkout-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('checkout-total').textContent = `₹${subtotal + 50}`;
}

// Make removeItem available globally
window.removeItem = removeItem;

function setupCheckoutForm() {
    document.getElementById('shipping-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get order items and total
        const items = Array.from(document.querySelectorAll('.checkout-item')).map(item => {
            const name = item.querySelector('h3').textContent;
            const priceText = item.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('₹', ''));
            const image = item.querySelector('img').src;
            return { name, price, image };
        });

        const subtotal = parseFloat(document.getElementById('checkout-subtotal').textContent.replace('₹', ''));
        const total = parseFloat(document.getElementById('checkout-total').textContent.replace('₹', ''));

        // Create order object
        const order = {
            orderId: generateOrderId(),
            orderDate: new Date().toISOString(),
            items: items,
            subtotal: subtotal,
            total: total,
            status: 'Processing',
            shippingDetails: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                pincode: document.getElementById('pincode').value
            }
        };

        // Save order to localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        savedOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(savedOrders));
        
        // Show notification and clear cart
        showNotification('Processing your order...');
        
        setTimeout(() => {
            localStorage.removeItem('cart');
            showNotification('Order placed successfully!');
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 2000);
        }, 2000);
    });
}

function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Add this function if not already defined in script.js
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// Cart and Likes functionality
let cart = [];
let likes = [];
let products = [
    { id: 1, name: "Wedding Frame 1", price: 299, image: "./images/wed1.jpg" },
    { id: 2, name: "Wedding Frame 2", price: 399, image: "./images/wed2.jpg" },
    { id: 3, name: "Photo Frame", price: 199, image: "./images/frame1.jpg" },
    { id: 4, name: "Nameplate", price: 149, image: "./images/nameplate1.jpg" },
    { id: 5, name: "Supari Box 1", price: 499, image: "./images/supari1.jpg" },
    { id: 6, name: "Supari Box 2", price: 599, image: "./images/supari2.jpg" },
    { id: 7, name: "Supari Box 3", price: 449, image: "./images/supari3.jpg" },
    { id: 8, name: "Supari Box 4", price: 549, image: "./images/supari4.jpg" },
    { id: 9, name: "Platter 1", price: 699, image: "./images/plate1.jpg" },
    { id: 10, name: "Platter 2", price: 799, image: "./images/plate2.jpg" },
    { id: 11, name: "Platter 3", price: 649, image: "./images/plate3.jpg" },
    { id: 12, name: "Platter 4", price: 749, image: "./images/plate4.jpg" },
];

// Initialize cart and likes from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    const savedLikes = localStorage.getItem('likes');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    if (savedLikes) {
        likes = JSON.parse(savedLikes);
        updateLikeButtons();
    }
    
    setupProductButtons();
    setupSlider();
});

// Add to Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({...product, cartId: Date.now()}); // Add unique cartId for removal
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Item added to cart!');
    }
}

// Remove from Cart functionality
function removeFromCart(cartId) {
    const index = cart.findIndex(item => item.cartId === cartId);
    if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Item removed from cart!');
        
        // If we're on the cart page, refresh the display
        if (window.location.pathname.includes('cart.html')) {
            displayCartItems();
        }
    }
}

// Like functionality
function toggleLike(productId) {
    const index = likes.findIndex(id => id === productId);
    const likeButtons = document.querySelectorAll(`.like-btn[data-product-id="${productId}"]`);
    
    if (index === -1) {
        // Add to likes
        likes.push(productId);
        likeButtons.forEach(btn => btn.classList.add('liked'));
        showNotification('Added to favorites!');
    } else {
        // Remove from likes
        likes.splice(index, 1);
        likeButtons.forEach(btn => btn.classList.remove('liked'));
        showNotification('Removed from favorites!');
        
        // If we're on the likes page, refresh the display
        if (window.location.pathname.includes('likes.html')) {
            displayLikedItems();
        }
    }
    
    localStorage.setItem('likes', JSON.stringify(likes));
    updateLikeButtons();
}

// Update like buttons state
function updateLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        const productId = parseInt(button.dataset.productId);
        if (likes.includes(productId)) {
            button.classList.add('liked');
        } else {
            button.classList.remove('liked');
        }
    });
}

// Update cart count in header
function updateCartCount() {
    const cartIcon = document.querySelector('.fa-cart-shopping');
    const count = cart.length;
    cartIcon.setAttribute('data-count', count);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup product buttons
function setupProductButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const orderNowButtons = document.querySelectorAll('.order-now');
    const likeButtons = document.querySelectorAll('.like-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        });
    });

    orderNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            window.location.href = `checkout.html?product=${productId}`;
        });
    });

    likeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.like-btn').dataset.productId);
            toggleLike(productId);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartId = parseInt(e.target.closest('.remove-btn').dataset.cartId);
            removeFromCart(cartId);
        });
    });
}

// Slider functionality
function setupSlider() {
    const slider = document.querySelector('.slider-container');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Form Validation Functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validateAddress(address) {
    return address.trim().length >= 10;
}

function validateMessage(message) {
    return message.trim().length > 0;
}

function showError(element, errorMessage) {
    const errorSpan = document.getElementById(`${element.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = errorMessage;
        errorSpan.style.display = 'block';
        element.setCustomValidity(errorMessage);
    }
}

function clearError(element) {
    const errorSpan = document.getElementById(`${element.id}-error`);
    if (errorSpan) {
        errorSpan.style.display = 'none';
        element.setCustomValidity('');
    }
}

// Contact Form Validation Setup
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactAddress = document.getElementById('contact-address');
    const contactMessage = document.getElementById('contact-message');
    const contactFile = document.getElementById('contact-file');

    // Real-time validation for Contact Form
    contactName?.addEventListener('input', () => {
        if (!validateName(contactName.value)) {
            showError(contactName, 'Name must be at least 2 characters long');
        } else {
            clearError(contactName);
        }
    });

    contactPhone?.addEventListener('input', () => {
        contactPhone.value = contactPhone.value.replace(/\D/g, '');
        if (!validatePhone(contactPhone.value)) {
            showError(contactPhone, 'Phone number must be 10 digits');
        } else {
            clearError(contactPhone);
        }
    });

    contactAddress?.addEventListener('input', () => {
        if (!validateAddress(contactAddress.value)) {
            showError(contactAddress, 'Please enter a valid address');
        } else {
            clearError(contactAddress);
        }
    });

    contactMessage?.addEventListener('input', () => {
        if (!validateMessage(contactMessage.value)) {
            showError(contactMessage, 'Please enter a message');
        } else {
            clearError(contactMessage);
        }
    });

    contactFile?.addEventListener('change', () => {
        if (!contactFile.files.length) {
            showError(contactFile, 'Please select a file');
        } else {
            clearError(contactFile);
        }
    });

    // Contact Form Submit Handler
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!contactName || !contactPhone || !contactAddress || !contactMessage || !contactFile) {
            showNotification('Form elements not found');
            return;
        }

        const nameValue = contactName.value.trim();
        const phoneValue = contactPhone.value.trim();
        const addressValue = contactAddress.value.trim();
        const messageValue = contactMessage.value.trim();
        const fileValue = contactFile.files.length > 0;

        // First check if all fields have values
        if (!nameValue || !phoneValue || !addressValue || !messageValue || !fileValue) {
            showNotification('Please fill in all required fields');
            return;
        }

        // Then validate all fields
        const isNameValid = validateName(nameValue);
        const isPhoneValid = validatePhone(phoneValue);
        const isAddressValid = validateAddress(addressValue);
        const isMessageValid = validateMessage(messageValue);

        if (isNameValid && isPhoneValid && isAddressValid && isMessageValid) {
            showNotification('Submitted Successfully');
            
            // Clear the form
            contactName.value = '';
            contactPhone.value = '';
            contactAddress.value = '';
            contactMessage.value = '';
            contactFile.value = '';

            // Clear all error states
            [contactName, contactPhone, contactAddress, contactMessage, contactFile].forEach(el => {
                if (el) clearError(el);
            });
        } else {
            showNotification('Please correct all errors before submitting');
        }
    });
});

// Suggestion Form Validation Setup
document.addEventListener('DOMContentLoaded', () => {
    const suggestionForm = document.getElementById('suggestion-form');
    const suggestionName = document.getElementById('suggestion-name');
    const suggestionEmail = document.getElementById('suggestion-email');
    const suggestionPhone = document.getElementById('suggestion-phone');
    const suggestionMessage = document.getElementById('suggestion-message');

    // Real-time validation for Suggestion Form
    suggestionName?.addEventListener('input', () => {
        if (!validateName(suggestionName.value)) {
            showError(suggestionName, 'Name must be at least 2 characters long');
        } else {
            clearError(suggestionName);
        }
    });

    suggestionEmail?.addEventListener('input', () => {
        if (!validateEmail(suggestionEmail.value)) {
            showError(suggestionEmail, 'Please enter a valid email address');
        } else {
            clearError(suggestionEmail);
        }
    });

    suggestionPhone?.addEventListener('input', () => {
        suggestionPhone.value = suggestionPhone.value.replace(/\D/g, '');
        if (!validatePhone(suggestionPhone.value)) {
            showError(suggestionPhone, 'Phone number must be 10 digits');
        } else {
            clearError(suggestionPhone);
        }
    });

    suggestionMessage?.addEventListener('input', () => {
        if (!validateMessage(suggestionMessage.value)) {
            showError(suggestionMessage, 'Please enter your suggestion');
        } else {
            clearError(suggestionMessage);
        }
    });

    // Suggestion Form Submit Handler
    suggestionForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!suggestionName || !suggestionEmail || !suggestionPhone || !suggestionMessage) {
            showNotification('Form elements not found');
            return;
        }

        const nameValue = suggestionName.value.trim();
        const emailValue = suggestionEmail.value.trim();
        const phoneValue = suggestionPhone.value.trim();
        const messageValue = suggestionMessage.value.trim();

        // First check if all fields have values
        if (!nameValue || !emailValue || !phoneValue || !messageValue) {
            showNotification('Please fill in all required fields');
            return;
        }

        // Then validate all fields
        const isNameValid = validateName(nameValue);
        const isEmailValid = validateEmail(emailValue);
        const isPhoneValid = validatePhone(phoneValue);
        const isMessageValid = validateMessage(messageValue);

        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            showNotification('Submitted Successfully');
            
            // Clear the form
            suggestionName.value = '';
            suggestionEmail.value = '';
            suggestionPhone.value = '';
            suggestionMessage.value = '';

            // Clear all error states
            [suggestionName, suggestionEmail, suggestionPhone, suggestionMessage].forEach(el => {
                if (el) clearError(el);
            });
        } else {
            showNotification('Please correct all errors before submitting');
        }
    });
});



if (isNameValid && isPhoneValid && isAddressValid && isMessageValid) {
    // ✅ Store contact data in localStorage
    const contactData = {
        name: nameValue,
        phone: phoneValue,
        address: addressValue,
        message: messageValue,
        file: contactFile.files[0]?.name || ''
    };

    // To support multiple submissions:
    const contactList = JSON.parse(localStorage.getItem('contactFormSubmissions')) || [];
    contactList.push(contactData);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(contactList));

    showNotification('Submitted Successfully');

    // Clear form
    contactName.value = '';
    contactPhone.value = '';
    contactAddress.value = '';
    contactMessage.value = '';
    contactFile.value = '';

    [contactName, contactPhone, contactAddress, contactMessage, contactFile].forEach(el => {
        if (el) clearError(el);
    });
}
if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
    // ✅ Store suggestion data in localStorage
    const suggestionData = {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        message: messageValue,
        image: document.getElementById('suggestion-image')?.files[0]?.name || ''
    };

    // To support multiple submissions:
    const suggestionList = JSON.parse(localStorage.getItem('suggestionFormSubmissions')) || [];
    suggestionList.push(suggestionData);
    localStorage.setItem('suggestionFormSubmissions', JSON.stringify(suggestionList));

    showNotification('Submitted Successfully');

    // Clear form
    suggestionName.value = '';
    suggestionEmail.value = '';
    suggestionPhone.value = '';
    suggestionMessage.value = '';

    [suggestionName, suggestionEmail, suggestionPhone, suggestionMessage].forEach(el => {
        if (el) clearError(el);
    });
}
console.log(JSON.parse(localStorage.getItem('contactFormSubmissions')));
console.log(JSON.parse(localStorage.getItem('suggestionFormSubmissions')));

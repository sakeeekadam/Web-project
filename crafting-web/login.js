// Simulated user database (in a real application, this would be on a server)
const registeredUsers = [
    { email: 'demo@example.com', password: 'demo123' }
];

// Toggle between email and phone login
document.getElementById('toggleLogin').addEventListener('click', function() {
    const emailGroup = document.getElementById('emailGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const toggleText = document.getElementById('toggleText');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (emailGroup.style.display !== 'none') {
        emailGroup.style.display = 'none';
        phoneGroup.style.display = 'block';
        toggleText.textContent = 'email';
        emailInput.required = false;
        phoneInput.required = true;
    } else {
        emailGroup.style.display = 'block';
        phoneGroup.style.display = 'none';
        toggleText.textContent = 'phone number';
        emailInput.required = true;
        phoneInput.required = false;
    }
});

function validateLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Determine if we're using email or phone
    const isEmailLogin = document.getElementById('emailGroup').style.display !== 'none';
    let user;

    if (isEmailLogin) {
        user = users.find(u => u.email === email);
    } else {
        user = users.find(u => u.phone === phone);
    }
    
    if (!user) {
        showError('Account not found. Please register first.');
        return false;
    }
    
    if (user.password === password) {
        // Successful login
        errorMessage.style.display = 'none';
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone
        }));
        // Redirect to home page
        window.location.href = 'index.html';
        return false;
    } else {
        showError('Invalid password. Please try again.');
        return false;
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Check if user is already logged in
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
}; 
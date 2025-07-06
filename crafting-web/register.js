// Show password requirements when password field is focused
document.getElementById('password').addEventListener('focus', function() {
    document.getElementById('passwordRequirements').style.display = 'block';
});

// Hide password requirements when clicking outside password field
document.addEventListener('click', function(e) {
    if (e.target.id !== 'password' && !e.target.closest('.password-requirements')) {
        document.getElementById('passwordRequirements').style.display = 'none';
    }
});

// Real-time password validation
document.getElementById('password').addEventListener('input', validatePasswordRequirements);

function validatePasswordRequirements() {
    const password = document.getElementById('password').value;
    const requirements = {
        reqCapital: /^[A-Z]/.test(password),
        reqLength: password.length >= 8,
        reqSpecial: (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length === 1,
        reqAlphaNum: /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
    };

    // Update requirement icons
    for (let req in requirements) {
        const element = document.getElementById(req);
        const icon = element.querySelector('i');
        if (requirements[req]) {
            icon.className = 'fas fa-check requirement-met';
            element.classList.add('requirement-met');
        } else {
            icon.className = 'fas fa-circle requirement-not-met';
            element.classList.remove('requirement-met');
        }
    }

    return Object.values(requirements).every(Boolean);
}

function validateRegistration(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate required fields
    if (!firstName || !middleName || !lastName || !phone || !email || !password || !confirmPassword) {
        showError('Please fill in all required fields');
        return false;
    }
    
    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phone)) {
        showError('Please enter a valid 10-digit phone number');
        return false;
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Validate password requirements
    if (!validatePasswordRequirements()) {
        showError('Password does not meet all requirements');
        return false;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }
    
    // Create user object
    const newUser = {
        firstName,
        middleName,
        lastName,
        phone,
        email,
        address,
        password
    };
    
    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email || user.phone === phone)) {
        showError('An account with this email or phone number already exists');
        return false;
    }
    
    // Add new user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirect to login page
    alert('Registration successful! Please login to continue.');
    window.location.href = 'login.html';
    return false;
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Automatically hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
} 
// Check if user is logged in
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    loadUserData();
    setupImageUpload();
    setupImageRemoval();
};

function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userDetails = users.find(user => user.email === currentUser.email);

    if (userDetails) {
        // Display user information
        document.getElementById('fullName').textContent = 
            `${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`;
        document.getElementById('email').textContent = userDetails.email;
        document.getElementById('emailInput').value = userDetails.email;
        document.getElementById('phone').textContent = userDetails.phone;
        document.getElementById('phoneInput').value = userDetails.phone;
        document.getElementById('address').textContent = userDetails.address || 'Not provided';
        document.getElementById('addressInput').value = userDetails.address || '';

        // Handle profile image display
        const profileImage = document.getElementById('profileImage');
        const defaultAvatar = document.getElementById('defaultAvatar');
        const removePhotoBtn = document.getElementById('removePhotoBtn');

        if (userDetails.profileImage) {
            profileImage.src = userDetails.profileImage;
            profileImage.style.display = 'block';
            defaultAvatar.style.display = 'none';
            removePhotoBtn.style.display = 'flex';
        } else {
            profileImage.style.display = 'none';
            defaultAvatar.style.display = 'block';
            removePhotoBtn.style.display = 'none';
        }
    }
}

function setupImageUpload() {
    const avatarUpload = document.getElementById('avatarUpload');
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                updateUserData({ profileImage: imageData });
            };
            reader.readAsDataURL(file);
        }
    });
}

function setupImageRemoval() {
    document.getElementById('removePhotoBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            updateUserData({ profileImage: null });
        }
    });
}

// Handle edit mode
document.getElementById('editProfileBtn').addEventListener('click', function() {
    // Show edit inputs
    document.querySelectorAll('.editable').forEach(group => {
        const display = group.querySelector('p');
        const input = group.querySelector('.edit-input');
        display.style.display = 'none';
        input.style.display = 'block';
    });

    // Toggle buttons
    this.style.display = 'none';
    document.getElementById('saveProfileBtn').style.display = 'flex';
    document.getElementById('cancelEditBtn').style.display = 'flex';
});

// Handle cancel edit
document.getElementById('cancelEditBtn').addEventListener('click', function() {
    exitEditMode();
    loadUserData(); // Reload original data
});

// Handle save changes
document.getElementById('saveProfileBtn').addEventListener('click', function() {
    const email = document.getElementById('emailInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const address = document.getElementById('addressInput').value.trim();

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Update user data
    updateUserData({
        email,
        phone,
        address
    });

    exitEditMode();
});

function exitEditMode() {
    // Hide edit inputs
    document.querySelectorAll('.editable').forEach(group => {
        const display = group.querySelector('p');
        const input = group.querySelector('.edit-input');
        display.style.display = 'block';
        input.style.display = 'none';
    });

    // Toggle buttons
    document.getElementById('editProfileBtn').style.display = 'flex';
    document.getElementById('saveProfileBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function updateUserData(updates) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        
        // If profileImage is explicitly set to null, remove it from the object
        if (updates.hasOwnProperty('profileImage') && updates.profileImage === null) {
            delete users[userIndex].profileImage;
        }
        
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user if email changed
        if (updates.email) {
            localStorage.setItem('currentUser', JSON.stringify({
                ...currentUser,
                email: updates.email
            }));
        }

        // Reload displayed data
        loadUserData();
    }
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}); 
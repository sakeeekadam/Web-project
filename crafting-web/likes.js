// Likes page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    displayLikedItems();
});

function displayLikedItems() {
    const likesGrid = document.getElementById('likes-grid');
    const savedLikes = localStorage.getItem('likes');
    
    if (savedLikes) {
        const likes = JSON.parse(savedLikes);
        
        if (likes.length === 0) {
            likesGrid.innerHTML = '<p class="empty-likes">No favorite items yet</p>';
            return;
        }

        const likedProducts = products.filter(product => likes.includes(product.id));
        
        likesGrid.innerHTML = likedProducts.map(product => `
            <div class="liked-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                    <div class="item-actions">
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                        <button class="like-btn liked" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Setup buttons
        setupProductButtons();
    } else {
        likesGrid.innerHTML = '<p class="empty-likes">No favorite items yet</p>';
    }
}
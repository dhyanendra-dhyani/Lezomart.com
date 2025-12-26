// ==================== SAMPLE PRODUCTS DATA ====================
const products = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        price: 79.99,
        originalPrice: 129.99,
        discount: '38%',
        rating: 4.5,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        badge: 'sale',
        filter: 'trending'
    },
    {
        id: 2,
        name: 'Premium Leather Wallet',
        category: 'Fashion',
        price: 45.00,
        originalPrice: 75.00,
        discount: '40%',
        rating: 4.8,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
        badge: 'new',
        filter: 'new'
    },
    {
        id: 3,
        name: 'Smart Watch Pro',
        category: 'Electronics',
        price: 299.99,
        originalPrice: 449.99,
        discount: '33%',
        rating: 4.7,
        reviews: 512,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        badge: 'sale',
        filter: 'trending'
    },
    {
        id: 4,
        name: 'Running Shoes',
        category: 'Sports',
        price: 89.99,
        originalPrice: 120.00,
        discount: '25%',
        rating: 4.6,
        reviews: 389,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        badge: 'sale',
        filter: 'sale'
    },
    {
        id: 5,
        name: 'Modern Desk Lamp',
        category: 'Home & Living',
        price: 34.99,
        originalPrice: 59.99,
        discount: '42%',
        rating: 4.4,
        reviews: 98,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        badge: 'new',
        filter: 'new'
    },
    {
        id: 6,
        name: 'Coffee Maker',
        category: 'Home & Living',
        price: 129.99,
        originalPrice: 199.99,
        discount: '35%',
        rating: 4.9,
        reviews: 445,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        badge: 'sale',
        filter: 'trending'
    },
    {
        id: 7,
        name: 'Designer Sunglasses',
        category: 'Fashion',
        price: 149.99,
        originalPrice: 249.99,
        discount: '40%',
        rating: 4.7,
        reviews: 267,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        badge: 'sale',
        filter: 'sale'
    },
    {
        id: 8,
        name: 'Yoga Mat Premium',
        category: 'Sports',
        price: 39.99,
        originalPrice: 69.99,
        discount: '43%',
        rating: 4.5,
        reviews: 178,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        badge: 'new',
        filter: 'new'
    }
];

// ==================== STATE MANAGEMENT ====================
let cart = [];
let wishlist = [];
let currentSlide = 0;
let currentFilter = 'all';
let displayedProducts = 4;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeSlider();
    loadProducts();
    setupEventListeners();
    loadFromLocalStorage();
    updateAllCounts();
});

// ==================== NAVIGATION ====================
function navigateTo(page) {
    window.location.href = page;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Searching for "${searchTerm}"...`, 'info');
        // Implement actual search logic here
        setTimeout(() => {
            window.location.href = `category.html?search=${encodeURIComponent(searchTerm)}`;
        }, 500);
    }
}

// ==================== HERO SLIDER ====================
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!dotsContainer) return;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    setInterval(nextSlide, 5000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// ==================== PRODUCTS ====================
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    let filteredProducts = products;
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(p => p.filter === currentFilter);
    }
    
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (displayedProducts >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <div class="product-badge ${product.badge === 'new' ? 'new' : ''}">${product.badge === 'new' ? 'NEW' : 'SALE'}</div>
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-actions">
                <button class="action-btn" onclick="quickView(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart ${wishlist.includes(product.id) ? 'filled' : ''}"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-count">(${product.reviews})</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                <span class="discount">${product.discount} OFF</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// ==================== CART FUNCTIONALITY ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification('Product quantity updated in cart!', 'success');
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification('Product added to cart!', 'success');
    }
    
    updateCart();
    saveToLocalStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveToLocalStorage();
    showNotification('Product removed from cart', 'info');
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveToLocalStorage();
        }
    }
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ==================== WISHLIST FUNCTIONALITY ====================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    }
    updateWishlistCount();
    saveToLocalStorage();
    loadProducts(); // Refresh to update heart icons
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

function updateAllCounts() {
    updateCart();
    updateWishlistCount();
}

// ==================== FILTER FUNCTIONALITY ====================
function setupFilterTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayedProducts = 4;
            loadProducts();
        });
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Slider controls
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    
    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Cart sidebar
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
    if (overlay) overlay.addEventListener('click', closeCartSidebar);
    
    // Load more products
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedProducts += 4;
            loadProducts();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Successfully subscribed to newsletter!', 'success');
            e.target.reset();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Setup filter tabs
    setupFilterTabs();
}

// ==================== CART SIDEBAR ====================
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar) cartSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    closeCartSidebar();
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'info' ? '#0984e3' : '#d63031'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    localStorage.setItem('lezomart_cart', JSON.stringify(cart));
    localStorage.setItem('lezomart_wishlist', JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('lezomart_cart');
    const savedWishlist = localStorage.getItem('lezomart_wishlist');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    
    updateAllCounts();
}

// ==================== QUICK VIEW ====================
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`Quick view: ${product.name}`, 'info');
    // Implement modal for quick view
}

// ==================== ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .fa-heart.filled {
        color: #d63031;
    }
`;
document.head.appendChild(style);

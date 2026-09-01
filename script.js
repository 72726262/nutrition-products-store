// ===================================================
// متجر منتجات التغذية - Main JavaScript Logic
// ===================================================

const products = [
    {
        id: 1,
        name: "بروتين الواي الذهبي (Whey Gold)",
        category: "protein",
        categoryName: "بروتينات",
        description: "بروتين نقي وسريع الامتصاص لبناء العضلات والاستشفاء السريع.",
        price: 150,
        emoji: "💪",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 2,
        name: "فيتامينات ومعادن متعددة (Multi-Vitamins)",
        category: "vitamins",
        categoryName: "فيتامينات",
        description: "تركيبة متكاملة لتعزيز المناعة والنشاط اليومي والطاقة.",
        price: 80,
        emoji: "💊",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 3,
        name: "مكمل الأحماض الأمينية BCAA 2:1:1",
        category: "performance",
        categoryName: "أداء رياضي",
        description: "يحمي الكتلة العضلية من الهدم ويسرّع التعافي أثناء التمرين.",
        price: 120,
        emoji: "⚡",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 4,
        name: "أوميغا 3 - زيت السمك النقي",
        category: "vitamins",
        categoryName: "صحة عامة",
        description: "يدعم صحة القلب والشرايين، ويحسن وظائف الدماغ والمفاصل.",
        price: 95,
        emoji: "🐟",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 5,
        name: "الكرياتين مونوهيدرات الصافي",
        category: "performance",
        categoryName: "طاقة وقوة",
        description: "يزيد من القوة البدنية والانفجارية وحجم العضلات بكفاءة عالية.",
        price: 110,
        emoji: "🏋️",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 6,
        name: "مكمل الجلوتامين (L-Glutamine)",
        category: "performance",
        categoryName: "استشفاء",
        description: "يدعم صحة الجهاز الهضمي والمناعي ويعزز تعافي الألياف العضلية.",
        price: 100,
        emoji: "🌿",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 7,
        name: "مسحوق الكاكاو العضوي النقي",
        category: "organic",
        categoryName: "منتج عضوي",
        description: "كاكاو خام طبيعي غني بمضادات الأكسدة والمعادن الأساسية.",
        price: 75,
        emoji: "🍫",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 8,
        name: "شاي أخضر ياباني عضوي (Matcha)",
        category: "organic",
        categoryName: "منتج عضوي",
        description: "مشروب طبيعي منشط للأيض وحارق للدهون ومضاد للأكسدة.",
        price: 65,
        emoji: "🍵",
        rating: "⭐⭐⭐⭐⭐"
    }
];

// Cart State (loaded from localStorage)
let cart = JSON.parse(localStorage.getItem('nutrition_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartUI();
    setupCartDrawerEvents();
});

// Setup Modal Events
function setupCartDrawerEvents() {
    const cartButton = document.getElementById('cartButton');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');

    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
}

// Display Products with filtering & search
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    let filtered = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-products-msg">
                <p>🔍 لم يتم العثور على منتجات مطابقة لـ "${searchQuery}"</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">
                <span>${product.emoji}</span>
                <span class="product-badge">متوفر</span>
            </div>
            <div class="product-info">
                <span class="product-category">${product.categoryName}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer-row">
                    <div class="product-price">${product.price} ريال</div>
                    <div class="product-rating">${product.rating}</div>
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <span>أضف للسلة</span> 🛒
                </button>
            </div>
        </div>
    `).join('');
}

// Handle Search Input
function handleSearch(query) {
    searchQuery = query.trim();
    displayProducts();
}

// Handle Category Select Change
function handleCategoryChange(category) {
    activeCategory = category;
    displayProducts();
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`✅ تم إضافة "${product.name}" إلى السلة`);
}

// Update Quantity
function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCartUI();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    if (item) {
        showToast(`🗑️ تم حذف "${item.name}" من السلة`);
    }
}

// Clear Cart
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('هل أنت متأكد من تفريغ سلة المشتريات بالكامل؟')) {
        cart = [];
        saveCart();
        updateCartUI();
        showToast('🗑️ تم تفريغ السلة بنجاح');
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('nutrition_cart', JSON.stringify(cart));
}

// Update Cart Count and Drawer UI
function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Update Badges
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalCount;
    });

    const totalEl = document.getElementById('cartTotalPrice');
    if (totalEl) {
        totalEl.textContent = `${totalPrice} ريال`;
    }

    const itemsContainer = document.getElementById('cartItemsContainer');
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>سلة التسوق فارغة حالياً</p>
                <span style="font-size:0.9rem; color:#94a3b8;">ابدأ بإضافة منتجاتك المفضلة!</span>
            </div>
        `;
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-emoji">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price * item.quantity} ريال (${item.price} ريال للقطعة)</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="حذف">&times;</button>
            </div>
        `).join('');
    }
}

// Open / Close Drawer
function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('show');
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('show');
    }
}

// Checkout Modal
function openCheckout() {
    if (cart.length === 0) {
        showToast('⚠️ السلة فارغة! أضف بعض المنتجات أولاً');
        return;
    }
    closeCart();
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotalAmount').textContent = `${totalPrice} ريال`;
    document.getElementById('checkoutModal').classList.add('show');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    closeCheckout();
    cart = [];
    saveCart();
    updateCartUI();

    showToast(`🎉 شكراً لك يا ${name}! تم تأكيد طلبك وسيتواصل معك المندوب قريباً على الرقم ${phone}.`);
}

// Smooth scroll
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Toast Notification
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Global functions for inline HTML calls
window.scrollToProducts = scrollToProducts;
window.handleSearch = handleSearch;
window.handleCategoryChange = handleCategoryChange;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.handleCheckoutSubmit = handleCheckoutSubmit;
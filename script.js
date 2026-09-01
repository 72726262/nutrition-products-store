// Sample products data
const products = [
    {
        id: 1,
        name: "بروتين الواي",
        description: "بروتين عالي الجودة لبناء العضلات",
        price: "150 ريال",
        emoji: "💪"
    },
    {
        id: 2,
        name: "فيتامينات متعددة",
        description: "مكمل فيتاميني شامل يومي",
        price: "80 ريال",
        emoji: "💊"
    },
    {
        id: 3,
        name: "BCAA",
        description: "أحماض أمينية متفرعة السلسلة",
        price: "120 ريال",
        emoji: "⚡"
    },
    {
        id: 4,
        name: "زيت السمك - أوميغا 3",
        description: "دعم صحة القلب والدماغ",
        price: "95 ريال",
        emoji: "🐟"
    },
    {
        id: 5,
        name: "الكرياتين مونوهيدرات",
        description: "يحسن الأداء الرياضي والقوة",
        price: "110 ريال",
        emoji: "🏋️"
    },
    {
        id: 6,
        name: "الجلوتامين",
        description: "استعادة عضلية وتحسين المناعة",
        price: "100 ريال",
        emoji: "🌿"
    },
    {
        id: 7,
        name: "مسحوق الكاكاو العضوي",
        description: "غني بمضادات الأكسدة",
        price: "75 ريال",
        emoji: "🍫"
    },
    {
        id: 8,
        name: "شاي أخضر عضوي",
        description: "مشروب صحي وطبيعي",
        price: "65 ريال",
        emoji: "🍵"
    }
];

let cart = [];

// Display products
function displayProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id}, '${product.name}')">أضف للسلة</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId, productName) {
    cart.push({ id: productId, name: productName });
    updateCartCount();
    showNotification(`تم إضافة ${productName} للسلة`);
}

// Update cart count
function updateCartCount() {
    document.querySelector('.cart-count').textContent = cart.length;
}

// Show notification
function showNotification(message) {
    alert(message);
}

// Smooth scroll
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});
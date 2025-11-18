let cartCount = 0;
let cartItems = [];

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartCount();
    
    // Setup category filter buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            productCards.forEach(card => {
                if (category === 'all') {
                    card.classList.add('visible');
                } else {
                    const cardCategories = card.dataset.category.split(' ');
                    if (cardCategories.includes(category)) {
                        card.classList.add('visible');
                    } else {
                        card.classList.remove('visible');
                    }
                }
            });
        });
    });
});

function addToCart(itemName, price, image) {
    const existingItem = cartItems.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: itemName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartCount();
    saveCartToStorage();
    showNotification(itemName);
}

function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

function showNotification(itemName) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5rem;">✓</span>
            <div>
                <div style="font-weight: 600;">${itemName}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Added to cart</div>
            </div>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        color: #2d3748;
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid #3b82f6;
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleCart() {
    const mainPage = document.querySelector('.main-page');
    const cartPage = document.getElementById('cartPage');
    
    if (cartPage.classList.contains('active')) {
        cartPage.classList.remove('active');
        mainPage.classList.remove('hidden');
    } else {
        cartPage.classList.add('active');
        mainPage.classList.add('hidden');
        renderCart();
    }
    
    window.scrollTo(0, 0);
}

function renderCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItemsList = document.getElementById('cartItemsList');

    if (cartItems.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';

    cartItemsList.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">${item.price.toFixed(2)} dt</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQuantity(index, change) {
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
        removeItem(index);
        return;
    }

    cartCount += change;
    updateCartCount();
    saveCartToStorage();
    renderCart();
}

function removeItem(index) {
    cartCount -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    updateCartCount();
    saveCartToStorage();
    renderCart();
}

function updateCartSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} dt`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} dt`;
    document.getElementById('tax').textContent = `${tax.toFixed(2)} dt`;
    document.getElementById('total').textContent = `${total.toFixed(2)} dt`;
}

function checkout() {
    alert('🎉 Thank you for your order! Total items: ' + cartCount + '\n\nThis is a demo shop. In a real store, you would proceed to payment.');
    // In a real application, you would redirect to a payment page here
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', cartCount);
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedItems = localStorage.getItem('cartItems');
    const savedCount = localStorage.getItem('cartCount');
    
    if (savedItems) {
        cartItems = JSON.parse(savedItems);
    }
    if (savedCount) {
        cartCount = parseInt(savedCount);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
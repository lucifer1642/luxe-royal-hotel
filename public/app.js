// public/app.js
const API_URL = '/api'; 
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatINR(number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number);
}

// --- Auth State Management ---
function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    const navItems = document.querySelector('.navbar-nav');
    if (token && userStr && navItems) {
        const user = JSON.parse(userStr);
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) loginLink.parentElement.remove();
        
        navItems.innerHTML += `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                    ${user.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                    ${user.role === 'admin' ? '<li><a class="dropdown-item" href="admin.html">Dashboard</a></li>' : ''}
                    <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                </ul>
            </li>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// --- Hardcoded Fallbacks for Offline Testing ---
const mockRooms = [
    { id: 1, room_type: 'Ocean View Suite', price: 8500, description: 'Experience ultimate luxury with panoramic views. This suite features a king-size bed, a separate living area, and a marble bathroom with a deep soaking tub.', features: ['Premium WiFi', '24/7 Room Service', 'Private Balcony'], image_url: 'images/room_ocean.png' },
    { id: 2, room_type: 'Presidential Villa', price: 18000, description: 'Our most exclusive accommodation. The Presidential Villa offers ultimate privacy with its own private pool, personal butler, and expansive living quarters.', features: ['Private Pool', 'Personal Butler Services', 'Complimentary Spa Access'], image_url: 'images/room_presidential.png' },
    { id: 3, room_type: 'Deluxe Royal Room', price: 5500, description: 'Elegant and comfortable, featuring heritage Rajputana architecture perfect for a prestigious getaway.', features: ['Smart TV', 'Mini Bar', 'Luxury Toiletries'], image_url: 'images/room_deluxe.png' }
];

const mockMenu = [
    // Starters
    { id: 1, name: 'Gold-Leaf Galouti Kebab', price: 2500, description: 'Melt-in-mouth lamb patties infused with 16 royal spices.', category: 'Starters', image_url: 'images/menu_galouti.png' },
    { id: 2, name: 'Truffle Butter Chicken Samosa', price: 1800, description: 'Crispy pastry pillows stuffed with shredded butter chicken and Italian black truffle shavings.', category: 'Starters', image_url: 'images/menu_samosa.png' },
    { id: 3, name: 'Peshawari Paneer Tikka', price: 1500, description: 'Charcoal-grilled cottage cheese marinated in hung curd.', category: 'Starters', image_url: 'images/menu_paneer_tikka.png' },
    { id: 4, name: 'Saffron Tandoori Jhinga', price: 3200, description: 'Tiger prawns marinated with wild Kashmiri saffron.', category: 'Starters', image_url: 'images/menu_jhinga.png' },
    { id: 5, name: 'Dahi Puri Caviar', price: 2800, description: 'Crispy semolina shells filled with spiced potatoes, sweet yogurt, topped with Beluga caviar.', category: 'Starters', image_url: 'images/menu_dahi_puri.png' },
    { id: 6, name: 'Murg Malai Tikka', price: 1600, description: 'Tender chicken marinated in fresh cream and mild spices.', category: 'Starters', image_url: 'images/menu_murg_malai.png' },
    { id: 7, name: 'Avocado Papdi Chaat', price: 1400, description: 'A modern twist on a classic, featuring mashed avocado.', category: 'Starters', image_url: 'images/menu_avocado_chaat.png' },
    { id: 8, name: 'Lobster Shorba', price: 2100, description: 'A fragrant, slow-simmered seafood broth.', category: 'Starters', image_url: 'images/menu_lobster_shorba.png' },

    // Mains Veg
    { id: 9, name: 'Dal Bukhara', price: 1800, description: 'Black lentils simmered overnight on a slow charcoal fire.', category: 'Mains (Vegetarian)', image_url: 'images/menu_dal_bukhara.png' },
    { id: 10, name: 'Morel Mushroom Pulav', price: 2200, description: 'Aromatic basmati rice steamed with wild Himalayan mushrooms.', category: 'Mains (Vegetarian)', image_url: 'images/menu_morel_pulav.png' },
    { id: 11, name: 'Paneer Lababdar', price: 1900, description: 'Cottage cheese cubes in a rich, creamy tomato gravy.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600' },
    { id: 12, name: 'Malai Kofta', price: 1800, description: 'Cottage cheese dumplings in a velvety white gravy.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600' },
    { id: 13, name: 'Dum Aloo Kashmiri', price: 1600, description: 'Baby potatoes in a vibrant, spiced yogurt gravy.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600' },
    { id: 14, name: 'Pindi Chole', price: 1500, description: 'Robust and spicy chickpeas cooked dry.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1596797038530-2c39bb05fbc5?w=600' },
    { id: 15, name: 'Bhindi Amchoor', price: 1400, description: 'Crispy fried okra with dried mango powder.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba0fa4a?w=600' },
    { id: 16, name: 'Baingan Bharta', price: 1500, description: 'Smoked eggplant mashed with onions and tomatoes.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/photo-1579631542720-3a87824fff8a?w=600' },

    // Mains Non Veg
    { id: 17, name: 'Saffron Lobster Malai Curry', price: 5500, description: 'Whole lobster poached in a delicate coconut milk gravy.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600' },
    { id: 18, name: 'Awadhi Lamb Biryani', price: 3800, description: 'Premium basmati rice and tender lamb with aromatic spices.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600' },
    { id: 19, name: 'Nalli Nihari', price: 4200, description: 'Slow-cooked lamb shanks in a rich spice-infused marrow stew.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1544148103-077afdc1cf14?w=600' },
    { id: 20, name: 'Classic Butter Chicken', price: 2800, description: 'Tandoori-roasted chicken in a velvet-smooth smoked tomato gravy.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600' },
    { id: 21, name: 'Laal Maas', price: 3400, description: 'A fiery, vibrant red mutton curry from Rajasthan utilizing Mathania chilies.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a7c21df?w=600' },
    { id: 22, name: 'Goan Fish Curry', price: 3100, description: 'Fresh Catch of the day in a tangy coconut gravy.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1645177623570-525d886dd943?w=600' },
    { id: 23, name: 'Murg Tikka Masala', price: 2700, description: 'Charcoal grilled chicken tikka in an onion-tomato masala base.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600' },
    { id: 24, name: 'Raan-E-Sikandari', price: 6800, description: 'Whole leg of lamb marinated and roasted for 12 hours.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600' },

    // Breads
    { id: 25, name: 'Truffle Cheese Naan', price: 800, description: 'Flatbread stuffed with vintage cheddar and finished with truffle oil.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600' },
    { id: 26, name: 'Garlic Butter Naan', price: 500, description: 'Classic flatbread brushed liberally with garlic and ghee.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600' },
    { id: 27, name: 'Mint Paratha', price: 450, description: 'Whole wheat multi-layered flaky bread brushed with dried mint.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600' },
    { id: 28, name: 'Burrani Raita', price: 400, description: 'Thick chilled yogurt whisked with roasted garlic and cumin.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/photo-1626200419109-383a54b3c4dc?w=600' },

    // Desserts
    { id: 29, name: '24K Pistachio Rasmalai', price: 1200, description: 'Soft cheese discs immersed in thickened pistachio milk, adorned with 24K gold.', category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1528750800168-f9f3f7ca2ec4?w=600' },
    { id: 30, name: 'Rose Petal Gulab Jamun', price: 950, description: 'Warm reduced-milk dumplings soaked in a rose-infused sugar syrup.', category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979adc?w=600' },
    { id: 31, name: 'Shahi Tukda', price: 1100, description: 'Crisp fried bread soaked in saffron milk and topped with rich clotted cream.', category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600' },
    { id: 32, name: 'Filter Coffee Ice Cream', price: 850, description: 'Artisanal ice cream infused with rich South Indian filter coffee.', category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=600' },

    // Beverages
    { id: 33, name: 'Saffron Cardamom Lassi', price: 600, description: 'A thick churned yogurt drink sweetened and infused with premium saffron.', category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600' },
    { id: 34, name: 'Chai Royal', price: 500, description: 'A bespoke blend of Assam tea brewed slowly with spices and milk.', category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1544787210-2213d84ad960?w=600' },
    { id: 35, name: 'Mango Mint Mojito', price: 700, description: 'Fresh local Alphonso mango puree muddled with mint and soda.', category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600' },
    { id: 36, name: 'Jal Jeera', price: 500, description: 'A refreshing tangy mocktail with roasted cumin and tamarind.', category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600' }
];

// --- Dynamic Rooms Fetch ---
async function loadRooms() {
    const roomList = document.getElementById('room-list');
    const featuredList = document.getElementById('featured-rooms');
    if (!roomList && !featuredList) return; 

    let rooms = [];
    try {
        const response = await fetch(`${API_URL}/rooms`);
        rooms = await response.json();
        
        if (!response.ok || !Array.isArray(rooms) || rooms.length === 0) {
            console.warn("Database empty or failed. Using UI Fallback.");
            rooms = mockRooms;
        }
    } catch (error) { 
        console.warn("API Offline. Using UI Fallback.");
        rooms = mockRooms; 
    }

    if (roomList) {
        roomList.innerHTML = ''; 
        rooms.forEach((room) => {
            const featuresDOM = room.features ? room.features.map(f => `<li>✨ ${f}</li>`).join('') : '';
            roomList.innerHTML += `
                <div class="col-lg-12">
                     <div class="card mb-4 room-card w-100 shadow-sm border-0">
                      <div class="row g-0">
                        <div class="col-md-5 position-relative">
                          <img src="${room.image_url}" class="img-fluid rounded-start h-100 object-fit-cover" alt="Room" style="min-height: 300px;">
                        </div>
                        <div class="col-md-7">
                          <div class="card-body p-5">
                            <h3 class="card-title brand-logo" style="color:var(--primary-color);">${room.room_type}</h3>
                            <p class="card-text text-muted mb-4">${room.description}</p>
                            <ul class="list-unstyled mb-4">${featuresDOM}</ul>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <p class="room-price mb-0" style="color:var(--accent-color); font-weight:bold; font-size:1.5rem;">
                                    ${formatINR(room.price)} <span class="fs-6 text-muted fw-normal">/ night</span>
                                </p>
                                <a href="rooms.html" class="btn btn-primary-custom px-4">Book Royal Stay</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            `;
        });
    }

    if (featuredList) {
        featuredList.innerHTML = '';
        rooms.slice(0, 3).forEach(room => {
            featuredList.innerHTML += `
                <div class="col-md-4">
                    <div class="card room-card h-100 border-0 shadow-sm">
                        <img src="${room.image_url}" class="card-img-top" alt="${room.room_type}" style="height:250px; object-fit:cover;">
                        <div class="card-body">
                            <h5 class="card-title brand-logo">${room.room_type}</h5>
                            <p class="card-text text-muted small">${room.description.substring(0, 80)}...</p>
                            <p class="room-price" style="color:var(--accent-color); font-weight:bold;">${formatINR(room.price)} <span class="fs-6 text-muted fw-normal">/ night</span></p>
                            <a href="rooms.html" class="btn btn-outline-dark w-100 rounded-pill">Explore Suite</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// --- Menu & Cart System ---
async function loadMenu() {
    const container = document.getElementById('dynamic-menu-container');
    if (!container) return;

    updateCartBadge();
    
    let items = [];
    try {
        const response = await fetch(`${API_URL}/menu`);
        items = await response.json();
        if (!response.ok || !Array.isArray(items) || items.length === 0) {
            console.warn("Database empty or failed. Using UI Fallback.");
            items = mockMenu;
        }
    } catch (e) {
        console.warn("API Offline. Using UI Fallback.");
        items = mockMenu;
    }

    // Group by category
    const categories = {};
    items.forEach(item => {
        if (!categories[item.category]) categories[item.category] = [];
        categories[item.category].push(item);
    });

    const order = ['Starters', 'Mains (Vegetarian)', 'Mains (Non-Vegetarian)', 'Breads & Sides', 'Desserts', 'Beverages'];
    let html = '';

    order.forEach(cat => {
        if (!categories[cat]) return;
        
        html += `
            <h2 class="menu-category mt-5">${cat}</h2>
            <div class="menu-divider mb-5">
                <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,10 L80,10 M100,20 L120,0 L100,10 Z M120,10 L200,10" stroke="#D4AF37" stroke-width="1" fill="none"/>
                    <circle cx="100" cy="10" r="3" fill="#D4AF37"/>
                </svg>
            </div>
            <div class="row g-4">
        `;

        categories[cat].forEach(item => {
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card menu-card h-100 pb-3 border-0 shadow-sm" style="border-radius:10px;">
                        <div class="menu-img-container">
                            <img src="${item.image_url}" alt="${item.name}">
                            <span class="menu-price-tag">${formatINR(item.price)}</span>
                        </div>
                        <div class="card-body px-3 text-center d-flex flex-column">
                            <h4 class="menu-item-name fs-5">${item.name}</h4>
                            <p class="menu-item-desc flex-grow-1 text-muted small" style="min-height:40px;">${item.description}</p>
                            <div class="mt-3 d-flex justify-content-center align-items-center gap-2">
                                <div class="qty-controls" style="border:1px solid #ddd; border-radius:20px; padding:2px;">
                                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)" style="border:none;">-</button>
                                    <span id="qty-val-${item.id}" class="fw-bold px-3">1</span>
                                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)" style="border:none;">+</button>
                                </div>
                                <button class="btn btn-outline-dark btn-sm ms-2 rounded-pill px-3" onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price})">Add to Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

// Global scope for onclick
window.updateQty = function(id, delta) {
    const el = document.getElementById(`qty-val-${id}`);
    let val = parseInt(el.textContent) + delta;
    if (val < 1) val = 1;
    el.textContent = val;
};

window.addToCart = function(id, name, price) {
    const qty = parseInt(document.getElementById(`qty-val-${id}`).textContent);
    
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, name, price, qty });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    document.getElementById(`qty-val-${id}`).textContent = '1';
};

function updateCartBadge() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = total;
        countEl.style.display = total > 0 ? 'flex' : 'none';
    }
}

// --- Checkout Logic ---
function loadCheckout() {
    const checkoutContainer = document.getElementById('checkout-items');
    if (!checkoutContainer) return;

    if (cart.length === 0) {
        checkoutContainer.innerHTML = '<p class="text-center text-muted py-4">Your culinary cart is empty.</p>';
        document.getElementById('checkout-total').textContent = formatINR(0);
        return;
    }

    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                    <h6 class="mb-0 brand-logo" style="color:var(--primary-color)">${item.name}</h6>
                    <small class="text-muted">${item.qty} x ${formatINR(item.price)}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-3" style="color:var(--accent-color)">${formatINR(subtotal)}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">X</button>
                </div>
            </div>
        `;
    });
    
    checkoutContainer.innerHTML = html;
    document.getElementById('checkout-total').textContent = formatINR(total);
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCheckout();
};

// --- Form Handlers ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadRooms();
    loadMenu();
    loadCheckout();

    // Rotating Reviews on Home
    const reviewText = document.getElementById('hero-review-text');
    const reviewAuthor = document.getElementById('hero-review-author');
    if (reviewText && reviewAuthor) {
        const reviews = [
            { text: "An unforgettable stay. The Royal Rajputana architecture redefined luxury for us.", author: "— Ananya Sharma" },
            { text: "The definitive five-star experience. The saffron lobster was breathtaking from start to finish.", author: "— Michael Chang" },
            { text: "Pure culinary excellence. The dining options alone make Luxe a world-class destination.", author: "— Emma Rothschild" }
        ];
        let currentReview = 0;
        reviewText.style.transition = "opacity 0.5s ease";
        reviewAuthor.style.transition = "opacity 0.5s ease";

        setInterval(() => {
            currentReview = (currentReview + 1) % reviews.length;
            reviewText.style.opacity = 0;
            reviewAuthor.style.opacity = 0;
            setTimeout(() => {
                reviewText.textContent = reviews[currentReview].text;
                reviewAuthor.textContent = reviews[currentReview].author;
                reviewText.style.opacity = 1;
                reviewAuthor.style.opacity = 1;
            }, 500);
        }, 5000);
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (!res.ok) { alert(data.error || 'Login failed! (Local SQL offline)'); return; }
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (data.user.role === 'admin') window.location.href = '/admin';
                else window.location.href = 'index.html';
            } catch (err) { alert('Network error'); }
        });
    }

    // Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (cart.length === 0) { alert('Cart is empty!'); return; }
            
            alert('Mock Order Placed Successfully! Your culinary experience is being prepared.');
            localStorage.removeItem('cart');
            window.location.href = 'menu.html';
        });
    }

    // Room Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            alert('Room reserved successfully!');
        });
    }
});

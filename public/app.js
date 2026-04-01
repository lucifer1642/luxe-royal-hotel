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
    { id: 1, room_type: 'Ocean View Suite', price: 8500, description: 'Experience ultimate luxury with panoramic views. This suite features a king-size bed, a separate living area, and a marble bathroom with a deep soaking tub.', features: ['Premium WiFi', '24/7 Room Service', 'Private Balcony'], image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 2, room_type: 'Presidential Villa', price: 18000, description: 'Our most exclusive accommodation. The Presidential Villa offers ultimate privacy with its own private pool, personal butler, and expansive living quarters.', features: ['Private Pool', 'Personal Butler Services', 'Complimentary Spa Access'], image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&w=800&q=80' },
    { id: 3, room_type: 'Deluxe Royal Room', price: 5500, description: 'Elegant and comfortable, featuring heritage Rajputana architecture perfect for a prestigious getaway.', features: ['Smart TV', 'Mini Bar', 'Luxury Toiletries'], image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&w=800&q=80' }
];

const mockMenu = [
    // Starters
    { id: 1, name: 'Galouti Kebab', price: 450, description: 'Melt-in-mouth lamb patties infused with royal spices.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,kebab,1' },
    { id: 2, name: 'Butter Chicken Samosa', price: 250, description: 'Crispy pastry pillows stuffed with shredded butter chicken.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,samosa,2' },
    { id: 3, name: 'Paneer Tikka', price: 300, description: 'Charcoal-grilled cottage cheese marinated in hung curd.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,tikka,3' },
    { id: 4, name: 'Tandoori Jhinga', price: 650, description: 'Tiger prawns marinated with Kashmiri saffron, cooked in a clay oven.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,tandoori,4' },
    { id: 5, name: 'Dahi Puri', price: 200, description: 'Crispy semolina shells filled with spiced potatoes and sweet yogurt.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,snack,5' },
    { id: 6, name: 'Murg Malai Tikka', price: 350, description: 'Tender chicken marinated in fresh cream, mild spices, and cardamom.', category: 'Starters', image_url: 'https://images.unsplash.com/random/600x400/?indian,chicken,tikka,6' },
    
    // Mains Veg
    { id: 7, name: 'Dal Makhani', price: 280, description: 'Black lentils simmered overnight on a slow charcoal fire, finished with cream.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,lentils,7' },
    { id: 8, name: 'Mushroom Pulav', price: 320, description: 'Aromatic basmati rice steamed with wild mushrooms.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,rice,pulav,8' },
    { id: 9, name: 'Paneer Butter Masala', price: 380, description: 'Cottage cheese cubes tossed in a rich, creamy tomato gravy.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,paneer,gravy,9' },
    { id: 10, name: 'Malai Kofta', price: 350, description: 'Cottage cheese and potato dumplings in a velvety, cashew-enriched white gravy.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,curry,vegetarian,10' },
    { id: 11, name: 'Kashmiri Dum Aloo', price: 300, description: 'Baby potatoes slow-cooked in a vibrant, spiced yogurt gravy native to the Kashmir valley.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,potato,curry,11' },
    { id: 12, name: 'Pindi Chole', price: 250, description: 'Robust and spicy chickpeas cooked dry with Punjabi spices.', category: 'Mains (Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,chickpeas,12' },
    
    // Mains Non Veg
    { id: 13, name: 'Classic Butter Chicken', price: 450, description: 'Tandoori-roasted chicken simmered in a velvet-smooth smoked tomato gravy.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,butterchicken,13' },
    { id: 14, name: 'Awadhi Lamb Biryani', price: 550, description: 'Premium basmati rice and tender lamb cooked slowly under a pastry seal.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,biryani,14' },
    { id: 15, name: 'Goan Fish Curry', price: 480, description: 'Fresh Catch of the day simmered in a tangy coconut and red chili gravy.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,fishcurry,15' },
    { id: 16, name: 'Laal Maas', price: 520, description: 'A fiery, vibrant red mutton curry from Rajasthan.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,mutton,curry,16' },
    { id: 17, name: 'Murg Tikka Masala', price: 460, description: 'Charcoal grilled chicken tikka tossed in an onion-tomato masala base.', category: 'Mains (Non-Vegetarian)', image_url: 'https://images.unsplash.com/random/600x400/?indian,tikkamasala,17' },
    
    // Breads & Sides
    { id: 18, name: 'Garlic Butter Naan', price: 100, description: 'Classic flatbread brushed liberally with garlic and organic cow ghee.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/random/600x400/?indian,naan,garlic,18' },
    { id: 19, name: 'Cheese Naan', price: 150, description: 'Tandoor-baked flatbread stuffed with vintage cheddar.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/random/600x400/?indian,naan,cheese,19' },
    { id: 20, name: 'Mint Paratha', price: 80, description: 'Whole wheat flaky bread brushed with dried mint leaves.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/random/600x400/?indian,paratha,20' },
    { id: 21, name: 'Burrani Raita', price: 120, description: 'Thick chilled yogurt whisked with roasted garlic and cumin.', category: 'Breads & Sides', image_url: 'https://images.unsplash.com/random/600x400/?indian,raita,21' },
    
    // Desserts
    { id: 22, name: 'Pistachio Rasmalai', price: 250, description: 'Soft cheese discs immersed in thickened pistachio milk.', category: 'Desserts', image_url: 'https://images.unsplash.com/random/600x400/?indian,rasmalai,22' },
    { id: 23, name: 'Gulab Jamun', price: 180, description: 'Warm reduced-milk dumplings soaked in a rose-infused sugar syrup.', category: 'Desserts', image_url: 'https://images.unsplash.com/random/600x400/?indian,gulabjamun,23' },
    { id: 24, name: 'Shahi Tukda', price: 200, description: 'Crisp fried bread soaked in saffron milk and topped with rich clotted cream.', category: 'Desserts', image_url: 'https://images.unsplash.com/random/600x400/?indian,dessert,sweet,24' },

    // Beverages
    { id: 25, name: 'Saffron Lassi', price: 150, description: 'A thick churned yogurt drink sweetened and infused with saffron.', category: 'Beverages', image_url: 'https://images.unsplash.com/random/600x400/?indian,lassi,25' },
    { id: 26, name: 'Masala Chai', price: 80, description: 'A bespoke blend of Assam tea, brewed slowly with spices and milk.', category: 'Beverages', image_url: 'https://images.unsplash.com/random/600x400/?indian,chai,tea,26' },
    { id: 27, name: 'Mango Mojito', price: 220, description: 'Fresh local Alphonso mango puree muddled with mint and sparkling water.', category: 'Beverages', image_url: 'https://images.unsplash.com/random/600x400/?mojito,mango,drink,27' }
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
                
                if (data.user.role === 'admin') window.location.href = 'admin.html';
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

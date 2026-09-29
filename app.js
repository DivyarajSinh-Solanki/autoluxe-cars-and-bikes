// JavaScript Logic for AutoLuxe Web Application

// Mock Vehicle & Blog Dataset
const initialVehicles = [
    {
        id: "v1",
        title: "Mahindra Thar LX 4x4 Hard Top",
        category: "car",
        dealType: "rent",
        price: "$80 / day",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "2.0L mStallion Turbo", power: "150 BHP", speed: "155 km/h" },
        description: "Experience ultimate off-road dominance with the iconic Thar 4x4. Perfect for weekend getaways and rugged mountain terrains.",
        fullReview: "The Mahindra Thar 4x4 offers an unmatched off-road capability combined with modern comforts like touchscreen navigation, hill descent control, and convertible roof options."
    },
    {
        id: "v2",
        title: "BMW M4 Competition Coupé",
        category: "car",
        dealType: "buy",
        price: "$78,900",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "3.0L Twin-Turbo Inline-6", power: "503 BHP", speed: "290 km/h" },
        description: "A precision track monster built for everyday luxury. Features xDrive AWD and carbon bucket seats.",
        fullReview: "With 503 horsepower delivered via a rapid 8-speed M Steptronic transmission, the M4 Competition sets the benchmark for high-performance sports coupes."
    },
    {
        id: "v3",
        title: "Ducati Panigale V4 S",
        category: "bike",
        dealType: "rent",
        price: "$120 / day",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "1,103 cc Desmosedici V4", power: "214 BHP", speed: "299+ km/h" },
        description: "Unfiltered MotoGP racing technology wrapped in Italian design. Equipped with Öhlins electronic suspension.",
        fullReview: "The Panigale V4 S is the closest you can get to a true racing superbike on public roads. Aerodynamic winglets provide immense downforce at high speeds."
    },
    {
        id: "v4",
        title: "Harley-Davidson Street Glide Special",
        category: "bike",
        dealType: "buy",
        price: "$27,400",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "Milwaukee-Eight 114 V-Twin", power: "100 BHP", speed: "175 km/h" },
        description: "The classic American touring motorcycle with modern infotainment, custom bagger styling, and booming torque.",
        fullReview: "Designed for long highway cruises, the Street Glide Special features Boom! Box GTS infotainment, reflex defensive rider systems, and signature batwing fairing."
    },
    {
        id: "v5",
        title: "Porsche 911 GT3 RS",
        category: "car",
        dealType: "buy",
        price: "$241,300",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "4.0L Naturally Aspirated Boxer-6", power: "518 BHP", speed: "296 km/h" },
        description: "Naturally aspirated motorsport engineering with active aerodynamic wing and lightweight carbon construction.",
        fullReview: "The GT3 RS is designed with zero compromise for track day enthusiasts, featuring DRS (Drag Reduction System) and double-wishbone front axle geometry."
    },
    {
        id: "v6",
        title: "Kawasaki Ninja ZX-10R",
        category: "bike",
        dealType: "rent",
        price: "$95 / day",
        image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
        specs: { engine: "998 cc Inline-4", power: "203 BHP", speed: "299 km/h" },
        description: "6-time WorldSBK champion heritage. Equipped with launch control, quickshifter, and cornering management.",
        fullReview: "The ZX-10R delivers blistering circuit performance backed by advanced Kawasaki traction control and Showa Balance Free suspension technology."
    }
];

// App State
let vehicles = [];
let savedItemIds = JSON.parse(localStorage.getItem('autoluxe_saved')) || [];
let activeCategory = 'all';
let activeDeal = 'all';
let searchQuery = '';
let currentUser = JSON.parse(localStorage.getItem('autoluxe_user')) || null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Load persisted listings or fallback to mock dataset
    const localData = localStorage.getItem('autoluxe_vehicles');
    vehicles = localData ? JSON.parse(localData) : initialVehicles;

    updateSavedCount();
    updateUserNavUI();
    renderVehicles();
    setupEventListeners();
});

// Setup DOM Event Listeners
function setupEventListeners() {
    // Search Listener
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderVehicles();
    });

    // Category Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderVehicles();
        });
    });

    // Deal Buttons
    document.querySelectorAll('.deal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.deal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDeal = btn.dataset.deal;
            renderVehicles();
        });
    });
}

// Render Grid
function renderVehicles() {
    const grid = document.getElementById('vehicleGrid');
    grid.innerHTML = '';

    const filtered = vehicles.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesDeal = activeDeal === 'all' || item.dealType === activeDeal;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                              item.description.toLowerCase().includes(searchQuery) ||
                              item.specs.engine.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesDeal && matchesSearch;
    });

    document.getElementById('resultsCount').innerText = `Showing ${filtered.length} vehicle(s)`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <i class="fa-solid fa-car-side" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>No vehicles found matching your criteria.</p>
            </div>`;
        return;
    }

    filtered.forEach(item => {
        const isSaved = savedItemIds.includes(item.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" class="card-img" alt="${item.title}">
                <div class="card-badge-group">
                    <span class="badge badge-cat">${item.category}</span>
                    <span class="badge ${item.dealType === 'rent' ? 'badge-rent' : 'badge-buy'}">
                        ${item.dealType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                </div>
                <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave('${item.id}')">
                    <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                </button>
            </div>
            <div class="card-content">
                <div class="card-price">${item.price}</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.description}</p>
                <div class="card-specs">
                    <span><i class="fa-solid fa-engine"></i> ${item.specs.engine}</span>
                    <span><i class="fa-solid fa-bolt"></i> ${item.specs.power}</span>
                </div>
                <button class="btn-view" onclick="openDetailModal('${item.id}')">View Details & Review</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Toggle Save / Favorite
function toggleSave(id) {
    if (savedItemIds.includes(id)) {
        savedItemIds = savedItemIds.filter(itemId => itemId !== id);
        showToast("Removed from Saved Garage");
    } else {
        savedItemIds.push(id);
        showToast("Added to Saved Garage!");
    }
    localStorage.setItem('autoluxe_saved', JSON.stringify(savedItemIds));
    updateSavedCount();
    renderVehicles();
}

function updateSavedCount() {
    document.getElementById('savedCount').innerText = savedItemIds.length;
}

// Open Details Modal
function openDetailModal(id) {
    const item = vehicles.find(v => v.id === id);
    if (!item) return;

    const modalBody = document.getElementById('detailModalBody');
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <span class="badge ${item.dealType === 'rent' ? 'badge-rent' : 'badge-buy'}">${item.dealType.toUpperCase()}</span>
            <h2 style="font-size: 2rem; margin-top: 5px;">${item.title}</h2>
            <p class="gold-text" style="font-size: 1.5rem; font-weight: 800;">${item.price}</p>
        </div>
        <img src="${item.image}" style="width:100%; height:320px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
        
        <div style="background:var(--bg-dark); padding:15px; border-radius:8px; margin-bottom:20px; display:flex; gap:20px;">
            <div><strong>Engine:</strong> ${item.specs.engine}</div>
            <div><strong>Power:</strong> ${item.specs.power}</div>
            <div><strong>Top Speed:</strong> ${item.specs.speed}</div>
        </div>

        <h3>Full Review & Specifications</h3>
        <p style="color:var(--text-muted); margin-bottom:20px;">${item.fullReview}</p>

        <button class="btn-primary" style="width:100%;" onclick="handleInquiry('${item.title}')">
            ${item.dealType === 'rent' ? 'Book Rental Now' : 'Inquire for Purchase'}
        </button>
    `;

    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function handleInquiry(title) {
    showToast(`Inquiry sent for ${title}! Dealer will contact you.`);
    closeDetailModal();
}

// Auth Modals & Pure JS Validation
function openAuthModal(type) {
    switchAuthTab(type);
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

// JS Form Validation for Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();
    let valid = true;

    document.getElementById('loginEmailErr').innerText = '';
    document.getElementById('loginPassErr').innerText = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('loginEmailErr').innerText = 'Please enter a valid email address.';
        valid = false;
    }

    if (pass.length < 6) {
        document.getElementById('loginPassErr').innerText = 'Password must be at least 6 characters.';
        valid = false;
    }

    if (valid) {
        currentUser = { name: email.split('@')[0], email: email };
        localStorage.setItem('autoluxe_user', JSON.stringify(currentUser));
        updateUserNavUI();
        closeAuthModal();
        showToast(`Welcome back, ${currentUser.name}!`);
    }
}

// JS Form Validation for Register
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value.trim();
    const confirmPass = document.getElementById('regConfirmPassword').value.trim();
    let valid = true;

    document.getElementById('regNameErr').innerText = '';
    document.getElementById('regEmailErr').innerText = '';
    document.getElementById('regPassErr').innerText = '';
    document.getElementById('regConfirmPassErr').innerText = '';

    if (name.length < 2) {
        document.getElementById('regNameErr').innerText = 'Name is required.';
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('regEmailErr').innerText = 'Enter a valid email.';
        valid = false;
    }

    if (pass.length < 6) {
        document.getElementById('regPassErr').innerText = 'Password must be 6+ characters.';
        valid = false;
    }

    if (pass !== confirmPass) {
        document.getElementById('regConfirmPassErr').innerText = 'Passwords do not match.';
        valid = false;
    }

    if (valid) {
        currentUser = { name: name, email: email };
        localStorage.setItem('autoluxe_user', JSON.stringify(currentUser));
        updateUserNavUI();
        closeAuthModal();
        showToast("Account created successfully!");
    }
}

function updateUserNavUI() {
    const userSection = document.getElementById('userNavSection');
    if (currentUser) {
        userSection.innerHTML = `
            <span style="color:var(--gold-primary); font-weight:700; margin-right:10px;"><i class="fa-solid fa-user-circle"></i> ${currentUser.name}</span>
            <button class="nav-link" style="background:none; border:none; cursor:pointer;" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i></button>
        `;
    } else {
        userSection.innerHTML = `<button class="btn-login" onclick="openAuthModal('login')"><i class="fa-solid fa-user"></i> Login / Register</button>`;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('autoluxe_user');
    updateUserNavUI();
    showToast("Logged out successfully.");
}

// Saved Items Modal
function openSavedModal() {
    const savedGrid = document.getElementById('savedGrid');
    savedGrid.innerHTML = '';

    const savedVehicles = vehicles.filter(v => savedItemIds.includes(v.id));

    if (savedVehicles.length === 0) {
        savedGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No saved vehicles in your garage yet.</p>`;
    } else {
        savedVehicles.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.image}" class="card-img" alt="${item.title}">
                    <button class="save-btn saved" onclick="toggleSave('${item.id}'); openSavedModal();">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-price">${item.price}</div>
                    <h3 class="card-title">${item.title}</h3>
                </div>
            `;
            savedGrid.appendChild(card);
        });
    }

    document.getElementById('savedModal').classList.add('active');
}

function closeSavedModal() {
    document.getElementById('savedModal').classList.remove('active');
}

// Post New Listing Modal
function openCreateModal() {
    document.getElementById('createModal').classList.add('active');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('active');
}

function handleCreateListing(e) {
    e.preventDefault();
    const newListing = {
        id: "v" + (Date.now()),
        title: document.getElementById('postTitle').value.trim(),
        category: document.getElementById('postCategory').value,
        dealType: document.getElementById('postDealType').value,
        price: document.getElementById('postPrice').value.trim(),
        image: document.getElementById('postImage').value.trim(),
        specs: { engine: "Custom Specs", power: "N/A", speed: "N/A" },
        description: document.getElementById('postDesc').value.trim(),
        fullReview: document.getElementById('postDesc').value.trim()
    };

    vehicles.unshift(newListing);
    localStorage.setItem('autoluxe_vehicles', JSON.stringify(vehicles));
    renderVehicles();
    closeCreateModal();
    showToast("New vehicle listing published!");
    document.getElementById('createListingForm').reset();
}

// Helper Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

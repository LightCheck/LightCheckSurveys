// --- Navigation / SPA Routing ---
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all navs and pages
        navBtns.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked nav and target page
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});


// --- Generate Grid Items Dynamically for cleaner code ---
function createCard(title, pageType, hasCartButton = false) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    // Clicking anywhere on the card (except the add button) opens the modal
    card.addEventListener('click', (e) => {
        if(!e.target.classList.contains('add-service-btn')) {
            openWindow(title, `https://via.placeholder.com/800x600?text=${encodeURIComponent(title)}`);
        }
    });

    let html = `
        <div class="img-placeholder">Image: ${title}</div>
        <div class="card-content">
            <p>Description for ${title}. Click to view full details in a new window.</p>
    `;
    
    if (hasCartButton) {
        html += `<button class="add-service-btn" data-service="${title}">Add Service</button>`;
    }
    
    html += `</div>`;
    card.innerHTML = html;
    return card;
}

// Populate Page 2 (10 items)
const surveysGrid = document.getElementById('surveys-grid');
for (let i = 1; i <= 10; i++) {
    surveysGrid.appendChild(createCard(`Measured Survey ${i}`, 'survey', true));
}

// Populate Page 3 (4 items)
const naturalGrid = document.getElementById('natural-light-grid');
for (let i = 1; i <= 4; i++) {
    naturalGrid.appendChild(createCard(`Natural Light Detail ${i}`, 'natural', false));
}

// Populate Page 4 (4 Interior, 4 Landscape)
const interiorGrid = document.getElementById('interior-grid');
const landscapeGrid = document.getElementById('landscape-grid');
for (let i = 1; i <= 4; i++) {
    interiorGrid.appendChild(createCard(`Interior Design ${i}`, 'interior', false));
    landscapeGrid.appendChild(createCard(`Landscaping ${i}`, 'landscape', false));
}


// --- Shopping Cart Logic ---
let cart = [];
const cartCount = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const cartList = document.getElementById('cart-items-list');

// Listen for Add Service clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-service-btn')) {
        const serviceName = e.target.getAttribute('data-service');
        cart.push(serviceName);
        cartCount.innerText = cart.length;
        
        // Visual feedback
        const originalText = e.target.innerText;
        e.target.innerText = "Added!";
        e.target.style.background = "#48bb78";
        setTimeout(() => {
            e.target.innerText = originalText;
            e.target.style.background = "";
        }, 1000);
    }
});

// Open Checkout
document.getElementById('cart-toggle').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your basket is empty.");
        return;
    }
    cartList.innerHTML = cart.map(item => `<li>${item}</li>`).join('');
    checkoutModal.classList.remove('hidden');
});

// Close Checkout
document.getElementById('close-cart-btn').addEventListener('click', () => {
    checkoutModal.classList.add('hidden');
});

// Send Order via Email
document.getElementById('send-order-btn').addEventListener('click', () => {
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value;
    
    if (!email || !phone) {
        alert("Please enter both email and phone number.");
        return;
    }
    
    const subject = "New Order Request";
    let body = `Customer Email: ${email}\nCustomer Phone: ${phone}\n\nRequested Services:\n`;
    cart.forEach(item => body += `- ${item}\n`);
    
    // Create intelligent mailto link
    const mailtoLink = `mailto:light.check@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // Reset after sending
    checkoutModal.classList.add('hidden');
    cart = [];
    cartCount.innerText = "0";
    document.getElementById('user-email').value = "";
    document.getElementById('user-phone').value = "";
});


// --- OS-Style Modal Logic (Maximize, Minimize, Close) ---
const osModal = document.getElementById('os-modal');
const modalImage = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-desc');

function openWindow(title, imgSrc) {
    osModal.classList.remove('hidden', 'minimized', 'maximized');
    modalImage.src = imgSrc;
    modalDesc.innerText = `Full screen view for ${title}.`;
}

function toggleMaximize() {
    if (osModal.classList.contains('minimized')) {
        osModal.classList.remove('minimized');
    }
    osModal.classList.toggle('maximized');
}

function toggleMinimize() {
    if (osModal.classList.contains('maximized')) {
        osModal.classList.remove('maximized');
    }
    osModal.classList.toggle('minimized');
}

function closeWindow() {
    osModal.classList.add('hidden');
    // Reset states
    osModal.classList.remove('maximized', 'minimized');
}
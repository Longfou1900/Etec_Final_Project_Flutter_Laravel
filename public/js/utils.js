//resoucres/js/utils.js
// Global State Variables
// let isDark = true;
// let currentUser = null;

// Dummy data for screens we haven't built APIs for yet (Orders, Users)
// let orders = [];
// let users = [];

// --- UI HELPERS ---
// function openModal(id) {
//     document.getElementById(id).classList.add("open");
// }

// function closeModal(id) {
//     document.getElementById(id).classList.remove("open");
// }

// function showBtn(btn, loading) {
//     btn.classList.toggle("loading", loading);
// }

// function toggleTheme() {
//     isDark = !isDark;
//     document.body.classList.toggle("light", !isDark);
//     document.getElementById("themeTrack").classList.toggle("on", !isDark);
//     document.getElementById("themeKnob").classList.toggle("on", !isDark);
//     document.getElementById("themeLabel").textContent = isDark
//         ? "Dark"
//         : "Light";
// }

// function showToast(msg, type = "info") {
//     const c = document.getElementById("toastContainer");
//     const t = document.createElement("div");
//     t.className = `toast toast-${type}`;
//     const icons = {
//         success: "ti-circle-check",
//         error: "ti-alert-circle",
//         info: "ti-info-circle",
//     };
//     t.innerHTML = `<i class="ti ${icons[type] || "ti-info-circle"}" style="color:var(--${type === "success" ? "green" : type === "error" ? "red" : "blue"})"></i><span>${msg}</span>`;
//     c.appendChild(t);
//     setTimeout(() => t.remove(), 3500);
// }

// // --- NAVIGATION HELPERS ---
// function showDashboard(userData) {
//     currentUser = userData;
//     document.getElementById("authScreen").style.display = "none";
//     document.getElementById("dashScreen").style.display = "flex";
//     document.getElementById("topbarName").textContent = currentUser.name;
//     document.getElementById("topbarRole").textContent = currentUser.role;

//     // Hide admin-only items if user is not admin
//     if (currentUser.role !== "admin") {
//         document.querySelectorAll(".admin-only").forEach((el) => {
//             el.style.display = "none";
//         });
//     } else {
//         document.querySelectorAll(".admin-only").forEach((el) => {
//             el.style.display = "flex";
//         });
//     }

//     showPage("analytics", document.querySelector(".nav-item"));
// }

// function showPage(page, el) {
//     document
//         .querySelectorAll(".nav-item")
//         .forEach((n) => n.classList.remove("active"));
//     if (el) el.classList.add("active");

//     // Destroy charts before changing pages to prevent memory leaks
//     if (typeof destroyCharts === "function") destroyCharts();

//     const titles = {
//         analytics: "All Products Analytics",
//         orders: "Order Analysis",
//         sold: "Product Sold",
//         crud: "Product CRUD",
//         roles: "User Roles & Management",
//         profile: "My Profile",
//     };
//     document.getElementById("pageTitle").textContent = titles[page] || page;

//     const c = document.getElementById("mainContent");
//     c.innerHTML = ""; // Clear current view

//     // Route to the correct render function
//     if (page === "crud") renderCrud(c);
//     // Add other render functions here as you build them
// }

// // Close modals on overlay click or Escape key
// document.querySelectorAll(".modal-overlay").forEach((o) => {
//     o.addEventListener("click", (e) => {
//         if (e.target === o) o.classList.remove("open");
//     });
// });
// document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape")
//         document
//             .querySelectorAll(".modal-overlay.open")
//             .forEach((o) => o.classList.remove("open"));
// });
// -----------------------------------------------------------------------------


// ---- UTILITIES ----
// function openModal(id) {
//     document.getElementById(id).classList.add("open");
// }
// function closeModal(id) {
//     document.getElementById(id).classList.remove("open");
// }
// function toggleTheme() {
//     isDark = !isDark;
//     document.body.classList.toggle("light", !isDark);
//     document.getElementById("themeTrack").classList.toggle("on", !isDark);
//     document.getElementById("themeKnob").classList.toggle("on", !isDark);
//     document.getElementById("themeLabel").textContent = isDark
//         ? "Dark"
//         : "Light";
// }
// function showToast(msg, type = "info") {
//     const c = document.getElementById("toastContainer");
//     const t = document.createElement("div");
//     t.className = `toast toast-${type}`;
//     const icons = {
//         success: "ti-circle-check",
//         error: "ti-alert-circle",
//         info: "ti-info-circle",
//     };
//     t.innerHTML = `<i class="ti ${icons[type] || "ti-info-circle"}" style="color:var(--${type === "success" ? "green" : type === "error" ? "red" : "blue"})"></i><span>${msg}</span>`;
//     c.appendChild(t);
//     setTimeout(() => t.remove(), 3500);
// }
// --------------------------------------------------------------
// public/js/utils.js

// ---- UI HELPERS ----
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function showBtn(btn, loading) {
    btn.classList.toggle('loading', loading);
}

function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('light', !isDark);
    document.getElementById('themeTrack').classList.toggle('on', !isDark);
    document.getElementById('themeKnob').classList.toggle('on', !isDark);
    document.getElementById('themeLabel').textContent = isDark ? 'Dark' : 'Light';
}

function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: 'ti-circle-check', error: 'ti-alert-circle', info: 'ti-info-circle' };
    t.innerHTML = `<i class="ti ${icons[type] || 'ti-info-circle'}" style="color:var(--${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'})"></i><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// ---- NAVIGATION ----
function showDashboard(userData) {
    currentUser = userData;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('dashScreen').style.display  = 'flex';

    // Set topbar user info
    const initials = (currentUser.name || '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('topbarAvatar').textContent = initials;
    document.getElementById('topbarName').textContent   = currentUser.name  || '—';
    document.getElementById('topbarRole').textContent   = currentUser.role  || 'user';

    // Show/hide admin-only sidebar items
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
    });

    showPage('analytics', document.querySelector('.nav-item'));
}

function showPage(page, el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) el.classList.add('active');

    const titles = {
        analytics : 'All Products Analytics',
        orders    : 'Order Analysis',
        sold      : 'Product Sold',
        crud      : 'Product CRUD',
        roles     : 'User Roles & Management',
        profile   : 'My Profile',
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    const c = document.getElementById('mainContent');
    c.innerHTML = '';

    if (page === 'crud')      renderCrud(c);
    else if (page === 'analytics') renderAnalytics(c);
    else if (page === 'sold')      renderSold(c);
    else if (page === 'orders')    renderOrders(c);
    else if (page === 'roles')     renderRoles(c);
    else if (page === 'profile')   renderProfile(c);
}

// ---- CLOSE MODALS on overlay click / Escape ----
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    }
});

// ---- STUB PAGE RENDERERS (replace these as you build each page) ----

function renderAnalytics(c) {
    c.innerHTML = `
    <div class="page-view">
        <div style="margin-bottom:20px">
            <h2 style="color:var(--text);font-size:20px;font-weight:700">Product Analytics</h2>
            <p style="color:var(--text3);font-size:13px;margin-top:4px">Live data from MockAPI</p>
        </div>
        <div id="analyticsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
            <div style="color:var(--text3);font-size:13px">Loading products...</div>
        </div>
    </div>`;
    loadAnalyticsProducts();
}

async function loadAnalyticsProducts() {
    try {
        const res  = await fetch('/api/products', { headers: getAuthHeaders() });
        const data = await res.json();
        const grid = document.getElementById('analyticsGrid');
        if (!grid) return;

        if (data.success && data.data.length) {
            grid.innerHTML = data.data.map(p => `
            <div class="watch-card">
                <img src="${p.img || p.image || ''}" class="watch-img"
                     onerror="this.style.background='linear-gradient(135deg,var(--bg3),var(--bg4))'">
                <div class="watch-body">
                    <div class="watch-name">${p.name}</div>
                    <div class="watch-price">$${p.price}</div>
                    <div class="watch-meta">Qty: ${p.qty} · Rating: ${p.rating || '—'}%</div>
                    <div class="watch-meta">${p.company || ''} ${p.strap ? '· ' + p.strap : ''}</div>
                </div>
            </div>`).join('');
        } else {
            grid.innerHTML = '<div style="color:var(--text3)">No products found.</div>';
        }
    } catch (e) {
        const grid = document.getElementById('analyticsGrid');
        if (grid) grid.innerHTML = '<div style="color:var(--red)">Failed to load products from API.</div>';
    }
}

function renderOrders(c) {
    c.innerHTML = `
    <div class="page-view">
        <h2 style="color:var(--text);font-size:20px;font-weight:700;margin-bottom:16px">Order Analysis</h2>
        <div style="color:var(--text3);font-size:13px;padding:40px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">
            <i class="ti ti-truck" style="font-size:40px;display:block;margin-bottom:12px"></i>
            Order data coming soon. Connect your orders API endpoint.
        </div>
    </div>`;
}

function renderSold(c) {
    c.innerHTML = `
    <div class="page-view">
        <h2 style="color:var(--text);font-size:20px;font-weight:700;margin-bottom:16px">Product Sold</h2>
        <div style="color:var(--text3);font-size:13px;padding:40px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">
            <i class="ti ti-receipt" style="font-size:40px;display:block;margin-bottom:12px"></i>
            Sales data coming soon. Connect your orders/sold API endpoint.
        </div>
    </div>`;
}

function renderRoles(c) {
    c.innerHTML = `
    <div class="page-view">
        <h2 style="color:var(--text);font-size:20px;font-weight:700;margin-bottom:16px">User Roles</h2>
        <div style="color:var(--text3);font-size:13px;padding:40px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">
            <i class="ti ti-users" style="font-size:40px;display:block;margin-bottom:12px"></i>
            User management coming soon. Connect your users API endpoint.
        </div>
    </div>`;
}

function renderProfile(c) {
    if (!currentUser) return;
    const initials = (currentUser.name || '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    c.innerHTML = `
    <div class="page-view">
        <div class="card" style="max-width:460px;margin:0 auto;padding:28px;text-align:center">
            <div style="width:72px;height:72px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#fff;margin:0 auto 14px;border:3px solid var(--accent)">
                ${initials}
            </div>
            <div style="font-size:20px;font-weight:700;color:var(--text)">${currentUser.name || '—'}</div>
            <div style="margin-top:6px"><span class="badge ${currentUser.role === 'admin' ? 'badge-admin' : 'badge-user'}">${currentUser.role || 'user'}</span></div>
            <div style="margin-top:8px;font-size:13px;color:var(--text3)">${currentUser.email || ''}</div>
            <div style="margin-top:6px;font-size:13px;color:var(--text3)">ID: ${currentUser.id || '—'}</div>
            <button class="btn btn-danger" style="width:100%;justify-content:center;margin-top:24px" onclick="doLogout(this)">
                <span class="spin"></span><span class="btn-text"><i class="ti ti-logout"></i> Sign Out</span>
            </button>
        </div>
    </div>`;
}
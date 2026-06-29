//resoucres/js/products.js
// let products = [];
// let editingProductId = null;

// Helper to grab token
// const getAuthHeaders = () => ({
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
// });

// // 1. Fetch from Laravel API
// async function loadProductsFromDatabase() {
//     try {
//         const response = await fetch('/api/products', { headers: getAuthHeaders() });
//         const data = await response.json();
        
//         if (data.success) {
//             products = data.data; // Store real watches
//             renderCrudGrid();     // Update screen
//         }
//     } catch (error) {
//         showToast('Failed to load products', 'error');
//     }
// }

// // 2. Render Page
// function renderCrud(container) {
//     container.innerHTML = `
//     <div class="page-view">
//         <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
//             <div>
//                 <div style="font-size:18px;font-weight:700;color:var(--text)">Product Management</div>
//                 <div style="font-size:12px;color:var(--text3);margin-top:2px" id="productCount">Loading products...</div>
//             </div>
//             <button class="btn btn-primary" onclick="openProductModal(null)"><i class="ti ti-plus"></i><span class="btn-text">Add Product</span></button>
//         </div>
//         <div id="crudGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px"></div>
//     </div>`;
    
//     loadProductsFromDatabase(); // Fetch real data when page loads!
// }

// // 3. Render Cards
// function renderCrudGrid() {
//     const grid = document.getElementById('crudGrid');
//     document.getElementById('productCount').textContent = `${products.length} products in inventory`;
    
//     if(!grid) return;
    
//     grid.innerHTML = products.map(p => `
//     <div class="watch-card">
//         <img src="${p.image}" class="watch-img" onerror="this.style.background='linear-gradient(135deg,var(--bg3),var(--bg4))'">
//         <div class="watch-body">
//             <div class="watch-name">${p.name}</div>
//             <div class="watch-price">$${p.price}</div>
//             <div class="watch-meta">Stock: ${p.qty}</div>
//             <div style="display:flex;gap:6px;margin-top:10px">
//                 <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openProductModal('${p.id}')"><i class="ti ti-edit"></i> Edit</button>
//                 <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct('${p.id}', this)"><i class="ti ti-trash"></i></button>
//             </div>
//         </div>
//     </div>`).join('');
// }

// // 4. Modal Setup
// function openProductModal(id) {
//     editingProductId = id;
//     document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add New Product';
    
//     if (id) {
//         const prod = products.find(p => p.id == id);
//         document.getElementById('pm_name').value = prod.name;
//         document.getElementById('pm_price').value = prod.price;
//         document.getElementById('pm_qty').value = prod.qty;
//         document.getElementById('pm_desc').value = prod.description;
//         document.getElementById('pm_img').value = prod.image;
//     } else {
//         ['pm_name','pm_price','pm_qty','pm_desc','pm_img'].forEach(i => document.getElementById(i).value = '');
//     }
//     openModal('productModal');
// }

// // 5. Insert / Update API Request
// async function saveProduct(btn) {
//     showBtn(btn, true);
    
//     const payload = {
//         name: document.getElementById('pm_name').value,
//         price: document.getElementById('pm_price').value,
//         qty: document.getElementById('pm_qty').value,
//         description: document.getElementById('pm_desc').value,
//         image: document.getElementById('pm_img').value
//     };

//     const url = editingProductId ? `/api/product/${editingProductId}` : '/api/product';
//     const method = editingProductId ? 'PUT' : 'POST';

//     try {
//         const response = await fetch(url, {
//             method: method,
//             headers: getAuthHeaders(),
//             body: JSON.stringify(payload)
//         });

//         if (response.ok) {
//             showToast(editingProductId ? 'Product updated!' : 'Product added!', 'success');
//             closeModal('productModal');
//             loadProductsFromDatabase(); // Refresh grid
//         } else {
//             showToast('Validation failed. Check fields.', 'error');
//         }
//     } catch (e) {
//         showToast('Server error', 'error');
//     }
    
//     showBtn(btn, false);
// }

// // 6. Delete API Request
// async function deleteProduct(id, btn) {
//     if(!confirm("Are you sure you want to delete this watch?")) return;
//     showBtn(btn, true);
    
//     try {
//         const response = await fetch(`/api/product/${id}`, {
//             method: 'DELETE',
//             headers: getAuthHeaders()
//         });

//         if (response.ok) {
//             showToast('Product deleted', 'info');
//             loadProductsFromDatabase(); // Refresh grid
//         }
//     } catch (e) {
//         showToast('Failed to delete', 'error');
//     }
    
//     showBtn(btn, false);
// }
// -----------------------------------------------------------------------
// public/js/products.js

let products       = [];
let editingProductId = null;

// 1. Load products from Laravel → MockAPI proxy
async function loadProductsFromDatabase() {
    try {
        const response = await fetch('/api/products', { headers: getAuthHeaders() });
        const data = await response.json();

        if (data.success) {
            products = data.data;
            renderCrudGrid();
        } else {
            showToast('Could not load products: ' + (data.message || ''), 'error');
        }
    } catch (error) {
        showToast('Failed to connect to product API', 'error');
    }
}

// 2. Render the CRUD page container
function renderCrud(container) {
    const isAdmin = currentUser && currentUser.role === 'admin';
    container.innerHTML = `
    <div class="page-view">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <div>
                <div style="font-size:18px;font-weight:700;color:var(--text)">Product Management</div>
                <div style="font-size:12px;color:var(--text3);margin-top:2px" id="productCount">Loading...</div>
            </div>
            ${isAdmin ? `<button class="btn btn-primary" onclick="openProductModal(null)">
                <i class="ti ti-plus"></i><span class="btn-text">Add Product</span>
            </button>` : ''}
        </div>
        <div id="crudGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px"></div>
    </div>

    <!-- PRODUCT MODAL (inline so it works even if blade modal is missing) -->
    <div class="modal-overlay" id="productModal">
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title" id="productModalTitle">Add Product</div>
                <i class="ti ti-x modal-close" onclick="closeModal('productModal')"></i>
            </div>
            <div class="form-group"><label class="form-label">Watch Name</label><input class="form-input" id="pm_name" placeholder="e.g. Zinvo Blade V2"></div>
            <div class="form-group"><label class="form-label">Price ($)</label><input class="form-input" id="pm_price" type="number" placeholder="450"></div>
            <div class="form-group"><label class="form-label">Quantity</label><input class="form-input" id="pm_qty" type="number" placeholder="50"></div>
            <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="pm_desc" rows="3" placeholder="Watch description..."></textarea></div>
            <div class="form-group"><label class="form-label">Image URL</label><input class="form-input" id="pm_img" placeholder="https://..."></div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
                <button class="btn btn-ghost" onclick="closeModal('productModal')">Cancel</button>
                <button class="btn btn-primary" onclick="saveProduct(this)" id="saveProductBtn">
                    <span class="spin"></span><span class="btn-text">Save Product</span>
                </button>
            </div>
        </div>
    </div>`;

    loadProductsFromDatabase();
}

// 3. Render watch cards
function renderCrudGrid() {
    const grid  = document.getElementById('crudGrid');
    const count = document.getElementById('productCount');
    if (count) count.textContent = `${products.length} products in inventory`;
    if (!grid)  return;

    const isAdmin = currentUser && currentUser.role === 'admin';

    grid.innerHTML = products.map(p => `
    <div class="watch-card">
        <img src="${p.img || p.image || ''}" class="watch-img"
             onerror="this.style.background='linear-gradient(135deg,var(--bg3),var(--bg4))'">
        <div class="watch-body">
            <div class="watch-name">${p.name}</div>
            <div class="watch-price">$${p.price}</div>
            <div class="watch-meta">Stock: ${p.qty} ${p.company ? '· ' + p.company : ''}</div>
            ${p.discount ? `<div class="watch-meta"><span class="tag tag-warn">${p.discount}% off</span></div>` : ''}
            ${isAdmin ? `
            <div style="display:flex;gap:6px;margin-top:10px">
                <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openProductModal('${p.id}')">
                    <i class="ti ti-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct('${p.id}', this)">
                    <i class="ti ti-trash"></i>
                </button>
            </div>` : ''}
        </div>
    </div>`).join('');
}

// 4. Open modal for add / edit
function openProductModal(id) {
    editingProductId = id;
    const titleEl = document.getElementById('productModalTitle');
    const btnEl   = document.getElementById('saveProductBtn');
    if (titleEl) titleEl.textContent = id ? 'Edit Product' : 'Add New Product';
    if (btnEl)   btnEl.querySelector('.btn-text').textContent = id ? 'Update Product' : 'Save Product';

    if (id) {
        const prod = products.find(p => String(p.id) === String(id));
        if (prod) {
            document.getElementById('pm_name').value  = prod.name        || '';
            document.getElementById('pm_price').value = prod.price       || '';
            document.getElementById('pm_qty').value   = prod.qty         || '';
            document.getElementById('pm_desc').value  = prod.description || '';
            document.getElementById('pm_img').value   = prod.img || prod.image || '';
        }
    } else {
        ['pm_name','pm_price','pm_qty','pm_desc','pm_img'].forEach(i => {
            const el = document.getElementById(i);
            if (el) el.value = '';
        });
    }
    openModal('productModal');
}

// 5. Save (insert or update) via API
async function saveProduct(btn) {
    showBtn(btn, true);

    const payload = {
        name:        document.getElementById('pm_name').value,
        price:       document.getElementById('pm_price').value,
        qty:         document.getElementById('pm_qty').value,
        description: document.getElementById('pm_desc').value,
        image:       document.getElementById('pm_img').value,
    };

    const url    = editingProductId ? `/api/product/${editingProductId}` : '/api/product';
    const method = editingProductId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast(editingProductId ? 'Product updated!' : 'Product added!', 'success');
            closeModal('productModal');
            loadProductsFromDatabase();
        } else {
            const err = await response.json();
            showToast(err.message || 'Validation failed. Check all fields.', 'error');
        }
    } catch (e) {
        showToast('Server error', 'error');
    }

    showBtn(btn, false);
}

// 6. Delete via API
async function deleteProduct(id, btn) {
    if (!confirm('Delete this watch?')) return;
    showBtn(btn, true);

    try {
        const response = await fetch(`/api/product/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            showToast('Product deleted', 'info');
            loadProductsFromDatabase();
        } else {
            showToast('Failed to delete', 'error');
        }
    } catch (e) {
        showToast('Server error', 'error');
    }

    showBtn(btn, false);
}
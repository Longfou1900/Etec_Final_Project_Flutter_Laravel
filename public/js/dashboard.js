// ---- STATE ----
let currentUser = null;
// let isDark = true;
// let products = [];
// let editingProduct = null;
let users = [];
let orders = [];
// let forgotEmailTarget = '';
// let charts = {};
// const API_BASE = '/api';

// ---- API HELPERS ----
// async function apiCall(endpoint, options = {}) {
//     const token = localStorage.getItem('auth_token');
//     const headers = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
//         ...options.headers
//     };
    
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${API_BASE}${endpoint}`, {
//         ...options,
//         headers
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//         throw new Error(data.message || 'API request failed');
//     }
    
//     return data;
// }

// ---- LOAD DATA ----
// async function loadProducts() {
//     try {
//         const result = await apiCall('/products');
//         if (result.success) {
//             products = result.data || [];
//             return products;
//         }
//         return [];
//     } catch (error) {
//         console.error('Error loading products:', error);
//         showToast('Failed to load products', 'error');
//         return [];
//     }
// }



// Generate orders from products (mock for demo)
// function generateOrders() {
//     orders = [];
//     const statuses = ['delivered', 'shipping', 'processing', 'pending'];
//     const userNames = users.map(u => u.username);
    
//     products.forEach((p, index) => {
//         if (index % 2 === 0 && userNames.length > 0) {
//             orders.push({
//                 id: `ORD${String(index + 1).padStart(4, '0')}`,
//                 user: userNames[index % userNames.length] || 'Unknown',
//                 product: p.name || 'Unknown Product',
//                 price: parseFloat(p.price) || 0,
//                 date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
//                 status: statuses[index % statuses.length],
//                 location: p.location || 'Unknown',
//                 tracking: `TRK${String(index + 1).padStart(7, '0')}`
//             });
//         }
//     });
    
//     if (orders.length === 0) {
//         // Fallback orders
//         orders = [
//             { id: 'ORD001', user: 'Dey Vavi', product: 'Zinvo Blade Cobalt V2', price: 450, date: '2025-01-15', status: 'delivered', location: 'Siem Reap', tracking: 'TRK2025001' },
//             { id: 'ORD002', user: 'Chan Sophea', product: 'Seiko Presage SSA405', price: 890, date: '2025-01-18', status: 'shipping', location: 'Battambang', tracking: 'TRK2025002' },
//             { id: 'ORD003', user: 'Dey Vavi', product: 'Orient Star Classic', price: 380, date: '2025-01-20', status: 'processing', location: 'Siem Reap', tracking: 'TRK2025003' },
//             { id: 'ORD004', user: 'Chan Sophea', product: 'Citizen Promaster Dive', price: 250, date: '2025-01-22', status: 'pending', location: 'Phnom Penh', tracking: 'TRK2025004' },
//         ];
//     }
//     return orders;
// }

// ---- AUTH HELPERS ----

// function showBtn(btn, loading) {
//     btn.classList.toggle('loading', loading);
// }






// ---- CRUD PAGE ----
// function renderCrud(c) {
//     c.innerHTML = `
//     <div class="page-view">
//     <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
//       <div>
//         <div style="font-size:18px;font-weight:700;color:var(--text)">Product Management</div>
//         <div style="font-size:12px;color:var(--text3);margin-top:2px">${products.length} products in inventory</div>
//       </div>
//       ${currentUser && currentUser.role === 'admin' ? `<button class="btn btn-primary" onclick="openProductModal(null)"><i class="ti ti-plus"></i><span class="btn-text">Add Product</span></button>` : ''}
//     </div>
//     <div id="crudGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px"></div>
//     </div>`;
//     renderCrudGrid();
// }

// function renderCrudGrid() {
//     const grid = document.getElementById('crudGrid');
//     if (!grid) return;
//     grid.innerHTML = products.map(p => `
//     <div class="watch-card">
//       <img src="${p.image || p.img}" class="watch-img" onerror="this.style.background='linear-gradient(135deg,var(--bg3),var(--bg4))'" alt="${p.name}">
//       <div class="watch-body">
//         <div class="watch-name">${p.name}</div>
//         <div class="watch-price">$${p.price}</div>
//         <div class="watch-meta">${p.company||'—'} · Stock: ${p.qty} · ${p.strap||'—'}</div>
//         <div class="watch-meta" style="margin-top:4px">
//           <span class="tag tag-up" style="margin-right:4px">${p.rating || 0}% rating</span>
//           ${p.discount ? `<span class="tag tag-warn">${p.discount}% off</span>` : ''}
//         </div>
//         ${currentUser && currentUser.role === 'admin' ? `
//         <div style="display:flex;gap:6px;margin-top:10px">
//           <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openProductModal('${p.id}')"><i class="ti ti-edit"></i> Edit</button>
//           <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct('${p.id}',this)"><i class="ti ti-trash"></i></button>
//         </div>` : `<div style="margin-top:10px"><button class="btn btn-primary btn-sm" style="width:100%"><i class="ti ti-plus"></i> List Product</button></div>`}
//       </div>
//     </div>`).join('');
// }

// function openProductModal(id) {
//     editingProduct = id ? products.find(p => p.id === id) : null;
//     document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add New Product';
//     document.getElementById('saveProductBtn').querySelector('.btn-text').textContent = id ? 'Update Product' : 'Save Product';
//     if (editingProduct) {
//         document.getElementById('pm_name').value = editingProduct.name || '';
//         document.getElementById('pm_price').value = editingProduct.price || '';
//         document.getElementById('pm_qty').value = editingProduct.qty || '';
//         document.getElementById('pm_desc').value = editingProduct.description || '';
//         document.getElementById('pm_company').value = editingProduct.company || '';
//         document.getElementById('pm_warranty').value = editingProduct.warranty || '';
//         document.getElementById('pm_strap').value = editingProduct.strap || '';
//         document.getElementById('pm_discount').value = editingProduct.discount || '';
//         document.getElementById('pm_img').value = editingProduct.image || editingProduct.img || '';
//     } else {
//         ['pm_name', 'pm_price', 'pm_qty', 'pm_desc', 'pm_company', 'pm_warranty', 'pm_strap', 'pm_discount', 'pm_img'].forEach(id => document.getElementById(id).value = '');
//     }
//     openModal('productModal');
// }

// async function saveProduct(btn) {
//     showBtn(btn, true);
    
//     const data = {
//         name: document.getElementById('pm_name').value,
//         price: document.getElementById('pm_price').value,
//         qty: document.getElementById('pm_qty').value,
//         description: document.getElementById('pm_desc').value,
//         company: document.getElementById('pm_company').value,
//         warranty: document.getElementById('pm_warranty').value,
//         strap: document.getElementById('pm_strap').value,
//         discount: document.getElementById('pm_discount').value,
//         image: document.getElementById('pm_img').value,
//     };
    
//     try {
//         let result;
//         if (editingProduct) {
//             result = await apiCall(`/products/${editingProduct.id}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(data)
//             });
//             if (result.success) {
//                 showToast('Product updated!', 'success');
//                 // Update local data
//                 Object.assign(editingProduct, data);
//             }
//         } else {
//             result = await apiCall('/products', {
//                 method: 'POST',
//                 body: JSON.stringify(data)
//             });
//             if (result.success) {
//                 showToast('Product added!', 'success');
//                 products.push(result.data);
//             }
//         }
//         closeModal('productModal');
//         renderCrudGrid();
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
    
//     showBtn(btn, false);
// }

// async function deleteProduct(id, btn) {
//     showBtn(btn, true);
//     try {
//         const result = await apiCall(`/products/${id}`, {
//             method: 'DELETE'
//         });
//         if (result.success) {
//             products = products.filter(p => p.id !== id);
//             showToast('Product deleted', 'info');
//             renderCrudGrid();
//         }
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
//     showBtn(btn, false);
// }

// ---- ROLES PAGE ----


// async function saveUser(id, btn) {
//     showBtn(btn, true);
//     try {
//         const data = {
//             username: document.getElementById('eu_name').value,
//             email: document.getElementById('eu_email').value,
//             role: document.getElementById('eu_role').value,
//             location: document.getElementById('eu_loc').value,
//         };
        
//         const result = await apiCall(`/users/${id}`, {
//             method: 'PUT',
//             body: JSON.stringify(data)
//         });
        
//         if (result.success) {
//             const u = users.find(x => x.id === id);
//             if (u) {
//                 Object.assign(u, data);
//             }
//             closeModal('userModal');
//             const body = document.getElementById('usersBody');
//             if (body) body.innerHTML = renderUsersRows();
//             showToast('User updated!', 'success');
//         }
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
//     showBtn(btn, false);
// }

// async function toggleBan(id, btn) {
//     showBtn(btn, true);
//     try {
//         const u = users.find(x => x.id === id);
//         if (u) {
//             const newStatus = !u.banned;
//             const result = await apiCall(`/users/${id}`, {
//                 method: 'PUT',
//                 body: JSON.stringify({ banned: newStatus })
//             });
//             if (result.success) {
//                 u.banned = newStatus;
//                 showToast(newStatus ? `${u.username} banned` : `${u.username} unbanned`, newStatus ? 'error' : 'success');
//                 const body = document.getElementById('usersBody');
//                 if (body) body.innerHTML = renderUsersRows();
//             }
//         }
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
//     showBtn(btn, false);
// }

// async function deleteUser(id, btn) {
//     if (id === currentUser?.id) {
//         showToast("Can't delete your own account", 'error');
//         return;
//     }
//     showBtn(btn, true);
//     try {
//         const result = await apiCall(`/users/${id}`, {
//             method: 'DELETE'
//         });
//         if (result.success) {
//             users = users.filter(u => u.id !== id);
//             const body = document.getElementById('usersBody');
//             if (body) body.innerHTML = renderUsersRows();
//             showToast('User deleted', 'info');
//         }
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
//     showBtn(btn, false);
// }

// async function saveProfile(btn) {
//     showBtn(btn, true);
//     try {
//         const data = {
//             username: document.getElementById('prof_name').value,
//             bio: document.getElementById('prof_bio').value,
//             location: document.getElementById('prof_loc').value,
//             phone: document.getElementById('prof_phone').value,
//         };
        
//         if (currentUser?.id) {
//             const result = await apiCall(`/users/${currentUser.id}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(data)
//             });
//             if (result.success) {
//                 Object.assign(currentUser, data);
//                 document.getElementById('topbarName').textContent = currentUser.username;
//                 showToast('Profile updated!', 'success');
//             }
//         }
//     } catch (error) {
//         showToast('Error: ' + error.message, 'error');
//     }
//     showBtn(btn, false);
// }

// function toggleTheme() {
//     isDark = !isDark;
//     document.body.classList.toggle('light', !isDark);
//     document.getElementById('themeTrack').classList.toggle('on', !isDark);
//     document.getElementById('themeKnob').classList.toggle('on', !isDark);
//     document.getElementById('themeLabel').textContent = isDark ? 'Dark' : 'Light';
// }

// Make functions globally accessible
// window.togglePw = togglePw;
// window.showView = showView;
// window.doLogin = doLogin;
// window.doSocialLogin = doSocialLogin;
// window.doRegister = doRegister;
// window.sendForgotCode = sendForgotCode;
// window.codeNext = codeNext;
// window.verifyCode = verifyCode;
// window.resetPassword = resetPassword;
window.showPage = showPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleTheme = toggleTheme;
window.showToast = showToast;
window.openProductModal = openProductModal;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.openEditUser = openEditUser;
window.saveUser = saveUser;
window.toggleBan = toggleBan;
window.deleteUser = deleteUser;
window.saveProfile = saveProfile;
window.doLogout = doLogout;
window.filterSold = filterSold;
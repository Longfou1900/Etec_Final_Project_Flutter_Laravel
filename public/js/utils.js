// public/js/utils.js

    // Global State Variables
    let isDark = true;
    let users = [];
    let orders = [];
    let currentUser = null;

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

    // function showToast(msg, type = 'info') {
    // const c = document.getElementById('toastContainer');
    // const t = document.createElement('div');
    // t.className = `toast toast-${type}`;
    // const icons = { success: 'ti-circle-check', error: 'ti-alert-circle', info: 'ti-info-circle' };
    // t.innerHTML = `<i class="ti ${icons[type] || 'ti-info-circle'}" style="color:var(--${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'})"></i><span>${msg}</span>`;
    // c.appendChild(t);
    // setTimeout(() => t.remove(), 3500);
    // }
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
    // ---- DASHBOARD ----
    // async function showDashboard() {
    //     // Load data from API
    //     await loadProducts();
    //     await loadUsers();
    //     generateOrders();
        
    //     document.getElementById('authScreen').style.display = 'none';
    //     document.getElementById('dashScreen').style.display = 'flex';
        
    //     const user = currentUser || JSON.parse(localStorage.getItem('current_user') || 'null');
    //     if (user) {
    //         currentUser = user;
    //         document.getElementById('topbarName').textContent = user.username || 'User';
    //         document.getElementById('topbarRole').textContent = (user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1);
    //         document.getElementById('topbarAvatar').textContent = (user.image || user.username?.substring(0, 2) || 'U').toUpperCase();
            
    //         if (user.role !== 'admin') {
    //             document.querySelectorAll('.admin-only').forEach(el => { el.style.display = 'none' });
    //         } else {
    //             document.querySelectorAll('.admin-only').forEach(el => { el.style.display = 'flex' });
    //         }
    //     }
    // showPage('analytics', document.querySelector('.nav-item'));
    // }
    function showDashboard(userData) {
        currentUser = userData;
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('dashScreen').style.display  = 'flex';

        // Set topbar user info
        const initials = (currentUser.username || '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('topbarAvatar').textContent = initials;
        document.getElementById('topbarName').textContent   = currentUser.username  || '—';
        document.getElementById('topbarRole').textContent   = currentUser.role  || 'user';

        // Show/hide admin-only sidebar items
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
        });

        showPage('analytics', document.querySelector('.nav-item'));
    }

    // function showPage(page, el) {
    //     document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    //     if (el) el.classList.add('active');
        
    //     // Destroy all charts
    //     Object.values(charts).forEach(c => { try { c.destroy() } catch (e) {} });
    //     charts = {};
        
    //     const titles = {
    //         analytics: 'All Products Analytics',
    //         orders: 'Order Analysis',
    //         sold: 'Product Sold',
    //         crud: 'Product CRUD',
    //         roles: 'User Roles & Management',
    //         profile: 'My Profile'
    //     };
        
    //     document.getElementById('pageTitle').textContent = titles[page] || page;
    //     const c = document.getElementById('mainContent');
    //     c.innerHTML = '';
        
    //     if (page === 'analytics') renderAnalytics(c);
    //     else if (page === 'orders') renderOrders(c);
    //     else if (page === 'sold') renderSold(c);
    //     else if (page === 'crud') renderCrud(c);
    //     else if (page === 'roles') renderRoles(c);
    //     // else if (page === 'profile') renderProfile(c);
    // }
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

    // Close modals on overlay click
    // document.querySelectorAll('.modal-overlay').forEach(o => {
    //     o.addEventListener('click', e => {
    //         if (e.target === o) o.classList.remove('open');
    //     });
    // });
    // ---- CLOSE MODALS on overlay click / Escape ----
    document.addEventListener('click', e => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('open');
        }
    });

    // Close code input on background
    // document.addEventListener('keydown', e => {
    //     if (e.key === 'Escape') {
    //         document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    //     }
    // });
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
    // function renderUsersRows() {
    //     return users.map(u => `<tr id="userRow_${u.id}">
    //     <td><div style="display:flex;align-items:center;gap:10px">
    //     <div style="width:34px;height:34px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">${u.image || u.username?.substring(0,2).toUpperCase() || 'U'}</div>
    //     <div><div style="font-size:13px;font-weight:600;color:var(--text)">${u.username}</div><div style="font-size:11px;color:var(--text3)">${u.sex === 'm' ? 'Male' : u.sex === 'f' ? 'Female' : '—'}</div></div>
    //     </div></td>
    //     <td style="font-size:12px;color:var(--text3)">${u.email}</td>
    //     <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
    //     <td style="font-size:12px"><i class="ti ti-map-pin" style="font-size:12px"></i> ${u.location || '—'}</td>
    //     <td><span class="badge ${u.banned ? 'badge-banned' : 'badge-active'}">${u.banned ? 'Banned' : 'Active'}</span></td>
    //     <td><div style="display:flex;gap:4px;flex-wrap:wrap">
    //     <button class="btn btn-ghost btn-sm" onclick="openEditUser('${u.id}')"><i class="ti ti-edit"></i></button>
    //     <button class="btn btn-warn btn-sm" onclick="toggleBan('${u.id}',this)">${u.banned ? 'Unban' : 'Ban'}</button>
    //     <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}',this)"><i class="ti ti-trash"></i></button>
    //     </div></td>
    // </tr>`).join('');
    // }

    // function renderRoles(c) {
    // const totalUsers = users.length;
    // const admins = users.filter(u => u.role === 'admin').length;
    // const banned = users.filter(u => u.banned).length;
    
    // c.innerHTML = `
    // <div class="page-view">
    // <div class="grid-3" style="margin-bottom:14px">
    //   <div class="mini-stat"><div><div class="mini-stat-val">${totalUsers}</div><div class="mini-stat-lbl">Total Users</div></div><i class="ti ti-users" style="font-size:22px;color:var(--accent)"></i></div>
    //   <div class="mini-stat"><div><div class="mini-stat-val">${admins}</div><div class="mini-stat-lbl">Admins</div></div><i class="ti ti-shield" style="font-size:22px;color:var(--gold)"></i></div>
    //   <div class="mini-stat"><div><div class="mini-stat-val">${banned}</div><div class="mini-stat-lbl">Banned</div></div><i class="ti ti-ban" style="font-size:22px;color:var(--red)"></i></div>
    // </div>
    // <div class="card">
    //   <div class="card-title">User Management</div>
    //   <table>
    //     <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
    //     <tbody id="usersBody">${renderUsersRows()}</tbody>
    //   </table>
    // </div>
    // </div>`;
    // }

    function renderUsersRows() {
        if (!users.length) {
            return `<tr><td colspan="6" style="color:var(--text3)">No users found.</td></tr>`;
        }
        return users.map(u => {
            const manageable = canManage(u);
            const roleBadgeClass = u.role === 'superadmin' ? 'badge-admin' : (u.role === 'admin' ? 'badge-admin' : 'badge-user');

            // Role-change button: admin can promote user->admin; superadmin can also demote admin->user
            let roleBtn = '';
            if (manageable) {
                if (u.role === 'user') {
                    roleBtn = `<button class="btn btn-ghost btn-sm" onclick="setUserRole('${u.id}','admin',this)" title="Promote to Admin"><i class="ti ti-arrow-up"></i></button>`;
                } else if (u.role === 'admin' && currentUser.role === 'superadmin') {
                    roleBtn = `<button class="btn btn-ghost btn-sm" onclick="setUserRole('${u.id}','user',this)" title="Demote to User"><i class="ti ti-arrow-down"></i></button>`;
                }
            }

            const editBtn   = manageable ? `<button class="btn btn-ghost btn-sm" onclick="openEditUser('${u.id}')"><i class="ti ti-edit"></i></button>` : '';
            const banBtn    = manageable ? `<button class="btn btn-warn btn-sm" onclick="toggleBan('${u.id}',this)">${u.banned ? 'Unban' : 'Ban'}</button>` : '';
            const deleteBtn = manageable ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}',this)"><i class="ti ti-trash"></i></button>` : '';

            return `<tr id="userRow_${u.id}">
                <td><div style="display:flex;align-items:center;gap:10px">
                    <div style="width:34px;height:34px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">${u.image || u.username?.substring(0,2).toUpperCase() || 'U'}</div>
                    <div><div style="font-size:13px;font-weight:600;color:var(--text)">${u.username}</div><div style="font-size:11px;color:var(--text3)">${u.sex === 'm' ? 'Male' : u.sex === 'f' ? 'Female' : '—'}</div></div>
                </div></td>
                <td style="font-size:12px;color:var(--text3)">${u.email}</td>
                <td><span class="badge ${roleBadgeClass}">${u.role}</span></td>
                <td style="font-size:12px"><i class="ti ti-map-pin" style="font-size:12px"></i> ${u.location || '—'}</td>
                <td><span class="badge ${u.banned ? 'badge-banned' : 'badge-active'}">${u.banned ? 'Banned' : 'Active'}</span></td>
                <td><div style="display:flex;gap:4px;flex-wrap:wrap">${editBtn}${roleBtn}${banBtn}${deleteBtn}</div></td>
            </tr>`;
        }).join('');
    }

    // ---- CREATE ----
    function openCreateUser() {
        document.getElementById('userModalTitle').textContent = 'New User';
        document.getElementById('userModalContent').innerHTML = `
            <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="eu_name" placeholder="Username"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="eu_email" placeholder="Email"></div>
            <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" id="eu_password" placeholder="Password"></div>
            <div class="form-group"><label class="form-label">Role</label>
                <select class="form-input" id="eu_role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="eu_loc" placeholder="Location"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
                <button class="btn btn-ghost" onclick="closeModal('userModal')">Cancel</button>
                <button class="btn btn-primary" onclick="createUser(this)"><span class="spin"></span><span class="btn-text">Create User</span></button>
            </div>`;
        openModal('userModal');
    }

    async function createUser(btn) {
    const payload = {
        username: document.getElementById('eu_name').value.trim(),
        email:    document.getElementById('eu_email').value.trim(),
        password: document.getElementById('eu_password').value,
        role:     document.getElementById('eu_role').value,
        location: document.getElementById('eu_loc').value.trim(),
    };
    if (!payload.username || !payload.email || !payload.password) {
        showToast('Username, email and password are required', 'error');
        return;
    }
    showBtn(btn, true);
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
            closeModal('userModal');
            showToast('User created!', 'success');
            await loadRolesUsers();
        } else {
            showToast(result.message || 'Failed to create user', 'error');
        }
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    }
    showBtn(btn, false);
    }



    function renderRoles(c) {
        // Guard: only admin/superadmin can see this page
        if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
            c.innerHTML = `<div class="page-view">
                <div style="color:var(--text3);padding:40px;text-align:center">
                    <i class="ti ti-lock" style="font-size:40px;display:block;margin-bottom:12px"></i>
                    You don't have permission to view this page.
                </div>
            </div>`;
            return;
        }

        // c.innerHTML = `
        // <div class="page-view">
        //     <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        //         <div>
        //             <h2 style="color:var(--text);font-size:20px;font-weight:700">
        //                 User Roles
        //             </h2>
        //             <p style="color:var(--text3);font-size:13px">
        //                 Users from MockAPI
        //             </p>
        //         </div>
        //     </div>
            
        //     <div style="overflow:auto">
        //         <table style="width:100%;border-collapse:collapse">
        //             <thead>
        //                 <tr>
        //                     <th align="left">Username</th>
        //                     <th align="left">Email</th>
        //                     <th align="left">Phone</th>
        //                     <th align="left">Role</th>
        //                     <th align="left">Location</th>
        //                 </tr>
        //             </thead>
        //             <tbody id="usersTable">
        //                 <tr>
        //                     <td colspan="5">
        //                         Loading...
        //                     </td>
        //                 </tr>
        //             </tbody>
        //         </table>
        //     </div>
            
        // </div>
        // `;

        c.innerHTML = `
            <div class="page-view">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                    <div>
                        <h2 style="color:var(--text);font-size:20px;font-weight:700">User Roles & Management</h2>
                        <p style="color:var(--text3);font-size:13px;margin-top:4px">Live data from API</p>
                    </div>
                    <button class="btn btn-primary" onclick="openCreateUser()">
                        <i class="ti ti-plus"></i> New User
                    </button>
                </div>

                <div class="grid-3" style="margin-bottom:14px" id="rolesStats">
                    <div class="mini-stat"><div><div class="mini-stat-val" id="statTotal">—</div><div class="mini-stat-lbl">Total Users</div></div><i class="ti ti-users" style="font-size:22px;color:var(--accent)"></i></div>
                    <div class="mini-stat"><div><div class="mini-stat-val" id="statAdmins">—</div><div class="mini-stat-lbl">Admins</div></div><i class="ti ti-shield" style="font-size:22px;color:var(--gold)"></i></div>
                    <div class="mini-stat"><div><div class="mini-stat-val" id="statBanned">—</div><div class="mini-stat-lbl">Banned</div></div><i class="ti ti-ban" style="font-size:22px;color:var(--red)"></i></div>
                </div>

                <div class="card">
                    <div class="card-title">User Management</div>
                    <table>
                        <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody id="usersBody"><tr><td colspan="6" style="color:var(--text3)">Loading...</td></tr></tbody>
                    </table>
                </div>
            </div>

            <!-- User create/edit modal -->
            <div class="modal-overlay" id="userModal">
                <div class="modal">
                    <div class="modal-header">
                        <div class="card-title" id="userModalTitle">Edit User</div>
                        <button class="btn btn-ghost btn-sm" onclick="closeModal('userModal')"><i class="ti ti-x"></i></button>
                    </div>
                    <div id="userModalContent"></div>
                </div>
            </div>`;

        // loadUsers();
        loadRolesUsers();
    }
    // async function loadUsers() {
    //     try {
    //         const result = await apiCall('/users');
    //         if (result.success) {
    //             users = result.data || [];
    //             return users;
    //         }
    //         return [];
    //     } catch (error) {
    //         console.error('Error loading users:', error);
    //         showToast('Failed to load users', 'error');
    //         return [];
    //     }
    // }
    async function loadRolesUsers() {
        try {
            const res = await fetch('/api/users', { headers: getAuthHeaders() });
            const result = await res.json();
            users = result.success ? (result.data || []) : [];
        } catch (e) {
            console.error(e);
            users = [];
            showToast('Failed to load users', 'error');
        }
        updateRolesStats();
        const body = document.getElementById('usersBody');
        if (body) body.innerHTML = renderUsersRows();
    }
    // async function loadUsers() {

    //     try {
    //         const response = await fetch('/api/users');
    //         const result = await response.json();
    //         const table = document.getElementById('usersTable');
    //         if (!table) return;
    //         if (result.success) {
    //             table.innerHTML = result.data.map(user => `
    //                 <tr>
    //                     <td>${user.username}</td>
    //                     <td>${user.email}</td>
    //                     <td>${user.phone}</td>
    //                     <td>
    //                         <span class="badge ${user.role === 'admin'
    //                             ? 'badge-admin'
    //                             : 'badge-user'}">
    //                             ${user.role}
    //                         </span>
    //                     </td>
    //                     <td>${user.location}</td>
    //                 </tr>
    //             `).join('');
    //         } else {
    //             table.innerHTML =
    //             `<tr><td colspan="5">No users found.</td></tr>`;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         document.getElementById('usersTable').innerHTML =
    //         `<tr><td colspan="5">Failed to load users.</td></tr>`;
    //     }
    // }

   //=======================
   //  Profile action
   //=======================
    // function renderProfile(c) {
    //     if (!currentUser) return;
    //     const initials = (currentUser.name || '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    //     c.innerHTML = `
    //     <div class="page-view">
    //         <div class="card" style="max-width:460px;margin:0 auto;padding:28px;text-align:center">
    //             <div style="width:72px;height:72px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#fff;margin:0 auto 14px;border:3px solid var(--accent)">
    //                 ${initials}
    //             </div>
    //             <div style="font-size:20px;font-weight:700;color:var(--text)">${currentUser.name || '—'}</div>
    //             <div style="margin-top:6px"><span class="badge ${currentUser.role === 'admin' ? 'badge-admin' : 'badge-user'}">${currentUser.role || 'user'}</span></div>
    //             <div style="margin-top:8px;font-size:13px;color:var(--text3)">${currentUser.email || ''}</div>
    //             <div style="margin-top:6px;font-size:13px;color:var(--text3)">ID: ${currentUser.id || '—'}</div>
    //             <button class="btn btn-danger" style="width:100%;justify-content:center;margin-top:24px" onclick="doLogout(this)">
    //                 <span class="spin"></span><span class="btn-text"><i class="ti ti-logout"></i> Sign Out</span>
    //             </button>
    //         </div>
    //     </div>`;
    // }
    // ---- PROFILE PAGE ----
    // function renderProfile(c) {
    //     const u = currentUser;
    //     const joined = u?.createdAt ? new Date(u.createdAt * 1000).toLocaleDateString() : '—';
    //     const userOrders = orders.filter(o => o.user === u?.username);
        
    //     c.innerHTML = `
    //     <div class="page-view">
    //     <div class="grid-2">
    //     <div class="card">
    //         <div style="text-align:center;padding:12px 0">
    //         <div style="width:80px;height:80px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;margin:0 auto 12px;border:3px solid var(--accent)">${u?.image || u?.username?.substring(0,2).toUpperCase() || 'U'}</div>
    //         <div style="font-size:20px;font-weight:700;color:var(--text)">${u?.username || 'User'}</div>
    //         <span class="badge ${u?.role === 'admin' ? 'badge-admin' : 'badge-user'}" style="margin-top:6px;display:inline-block">${u?.role || 'user'}</span>
    //         <div style="font-size:13px;color:var(--text3);margin-top:8px">${u?.bio || 'No bio yet'}</div>
    //         </div>
    //         <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:8px">
    //         ${[
    //             ['Email', u?.email || '—', 'ti-mail'],
    //             ['Phone', u?.phone || '—', 'ti-phone'],
    //             ['Location', u?.location || '—', 'ti-map-pin'],
    //             ['Member since', joined, 'ti-calendar'],
    //             ['Gender', u?.sex === 'm' ? 'Male' : u?.sex === 'f' ? 'Female' : '—', 'ti-gender-male']
    //         ].map(([l,v,i]) => `
    //         <div class="mini-stat" style="margin-bottom:8px">
    //             <div style="display:flex;align-items:center;gap:8px"><i class="ti ${i}" style="color:var(--accent2);font-size:16px"></i><div class="mini-stat-lbl">${l}</div></div>
    //             <div style="font-size:13px;color:var(--text)">${v}</div>
    //         </div>`).join('')}
    //         </div>
    //         <div style="margin-top:14px">
    //         <button class="btn btn-danger" style="width:100%;justify-content:center" onclick="doLogout(this)">
    //             <span class="spin"></span><span class="btn-text"><i class="ti ti-logout"></i> Sign Out</span>
    //         </button>
    //         </div>
    //     </div>
    //     <div>
    //         <div class="card" style="margin-bottom:14px">
    //         <div class="card-title">Edit Profile</div>
    //         <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="prof_name" value="${u?.username || ''}"></div>
    //         <div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" id="prof_bio" rows="3">${u?.bio || ''}</textarea></div>
    //         <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="prof_loc" value="${u?.location || ''}"></div>
    //         <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="prof_phone" value="${u?.phone || ''}"></div>
    //         <button class="btn btn-primary" onclick="saveProfile(this)"><span class="spin"></span><span class="btn-text">Save Changes</span></button>
    //         </div>
    //         <div class="card">
    //         <div class="card-title">Account Stats</div>
    //         <div class="grid-2">
    //             <div class="mini-stat"><div><div class="mini-stat-val">${userOrders.length}</div><div class="mini-stat-lbl">My Orders</div></div></div>
    //             <div class="mini-stat"><div><div class="mini-stat-val">${currentUser?.role === 'admin' ? products.length : '-'}</div><div class="mini-stat-lbl">Products</div></div></div>
    //         </div>
    //         </div>
    //     </div>
    //     </div>
    //     </div>`;
    // }
    function updateRolesStats() {
        const totalEl = document.getElementById('statTotal');
        const adminEl = document.getElementById('statAdmins');
        const bannedEl = document.getElementById('statBanned');
        if (!totalEl) return;
        totalEl.textContent  = users.length;
        adminEl.textContent  = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
        bannedEl.textContent = users.filter(u => u.banned).length;
    }

    // Can the currentUser act on target user u?
    function canManage(u) {
        if (!currentUser) return false;
        if (u.id === currentUser.id) return false; // no self-management here (use Profile page)
        if (currentUser.role === 'superadmin') return u.role !== 'superadmin'; // can manage admins + users
        if (currentUser.role === 'admin') return u.role === 'user'; // admin only manages plain users
        return false;
    }

    function renderProfile(c){
        const u = currentUser;
        if (!u) return;
        const initials = (u.name || '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
        const joined = new Date(u.createdAt*1000).toLocaleDateString();
        c.innerHTML=`
        <div class="page-view">
        <div class="grid-2">
            <div class="card">
            <div style="text-align:center;padding:12px 0">
                <div style="width:80px;height:80px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;margin:0 auto 12px;border:3px solid var(--accent)">${u.image}</div>
                <div style="font-size:20px;font-weight:700;color:var(--text)">${u.username}</div>
                <span class="badge ${u.role==='admin'?'badge-admin':'badge-user'}" style="margin-top:6px;display:inline-block">${u.role}</span>
                <div style="font-size:13px;color:var(--text3);margin-top:8px">${u.bio||'No bio yet'}</div>
            </div>
            <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:8px">
                ${[['Email',u.email,'ti-mail'],['Phone',u.phone||'—','ti-phone'],['Location',u.location,'ti-map-pin'],['Member since',joined,'ti-calendar'],['Gender',u.sex==='m'?'Male':'Female','ti-gender-male']].map(([l,v,i])=>`
                <div class="mini-stat" style="margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:8px"><i class="ti ${i}" style="color:var(--accent2);font-size:16px"></i><div class="mini-stat-lbl">${l}</div></div>
                <div style="font-size:13px;color:var(--text)">${v}</div>
                </div>`).join('')}
            </div>
            <div style="margin-top:14px">
                <button class="btn btn-danger" style="width:100%;justify-content:center" onclick="doLogout(this)">
                <span class="spin"></span><span class="btn-text"><i class="ti ti-logout"></i> Sign Out</span>
                </button>
            </div>
            </div>
            <div>
            <div class="card" style="margin-bottom:14px">
                <div class="card-title">Edit Profile</div>
                <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="prof_name" value="${u.username}"></div>
                <div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" id="prof_bio" rows="3">${u.bio||''}</textarea></div>
                <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="prof_loc" value="${u.location}"></div>
                <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="prof_phone" value="${u.phone||''}"></div>
                <button class="btn btn-primary" onclick="saveProfile(this)"><span class="spin"></span><span class="btn-text">Save Changes</span></button>
            </div>
            <div class="card">
                <div class="card-title">Account Stats</div>
                <div class="grid-2">
                <div class="mini-stat"><div><div class="mini-stat-val">${orders.filter(o=>o.user===u.username).length}</div><div class="mini-stat-lbl">My Orders</div></div></div>
                <div class="mini-stat"><div><div class="mini-stat-val">${u.role==='admin'?products.length:'-'}</div><div class="mini-stat-lbl">Products</div></div></div>
                </div>
            </div>
            </div>
        </div>
        </div>`;
        }
    function saveProfile(btn){
        showBtn(btn,true);
        setTimeout(()=>{
            currentUser.username=document.getElementById('prof_name').value;
            currentUser.bio=document.getElementById('prof_bio').value;
            currentUser.location=document.getElementById('prof_loc').value;
            currentUser.phone=document.getElementById('prof_phone').value;
            document.getElementById('topbarName').textContent=currentUser.username;
            showToast('Profile updated!','success');
            showBtn(btn,false);
        },1000);
    }

    //=======================
    // action User--- EDIT --
    //=======================
    // function openEditUser(id){
    //     const u = users.find(x => x.id === id);
    //     if(!u) return;
    //     document.getElementById('userModalContent').innerHTML=`
    //         <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="eu_name" value="${u.username || 'null'}"></div>
    //         <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="eu_email" value="${u.email || 'null'}"></div>
    //         <div class="form-group"><label class="form-label">Role</label>
    //             <select class="form-input" id="eu_role"><option value="admin" ${u.role === 'admin'?'selected' : ''}>Admin</option><option value="user" ${u.role==='user'?'selected':''}>User</option></select>
    //         </div>
    //         <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="eu_loc" value="${u.location || 'null'}"></div>
    //         <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
    //             <button class="btn btn-ghost" onclick="closeModal('userModal')">Cancel</button>
    //             <button class="btn btn-primary" onclick="saveUser('${id}',this)"><span class="spin"></span><span class="btn-text">Save Changes</span></button>
    //         </div>`;
    //     openModal('userModal');
    // }
    function openEditUser(id) {
    const u = users.find(x => x.id === id);
    if (!u || !canManage(u)) { showToast('Not permitted', 'error'); return; }

    document.getElementById('userModalTitle').textContent = 'Edit User';
    // Only superadmin can hand out the admin role change here too; admin can only manage plain users
    const roleOptions = currentUser.role === 'superadmin'
        ? `<option value="user" ${u.role==='user'?'selected':''}>User</option><option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>`
        : `<option value="user" selected>User</option>`;

    document.getElementById('userModalContent').innerHTML = `
        <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="eu_name" value="${u.username || ''}"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="eu_email" value="${u.email || ''}"></div>
        <div class="form-group"><label class="form-label">Role</label>
            <select class="form-input" id="eu_role">${roleOptions}</select>
        </div>
        <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="eu_loc" value="${u.location || ''}"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
            <button class="btn btn-ghost" onclick="closeModal('userModal')">Cancel</button>
            <button class="btn btn-primary" onclick="saveUser('${id}',this)"><span class="spin"></span><span class="btn-text">Save Changes</span></button>
        </div>`;
    openModal('userModal');
    }
    // function saveUser(id,btn){
    //     showBtn(btn,true);
    //     setTimeout(()=>{
    //         try {
    //             const u=users.find(x=>x.id===id);
    //             if(u){
    //             u.username=document.getElementById('eu_name').value;
    //             u.email=document.getElementById('eu_email').value;
    //             u.role=document.getElementById('eu_role').value;
    //             u.location=document.getElementById('eu_loc').value;
    //             }
    //             closeModal('userModal');
    //             const body=document.getElementById('usersBody');
    //             if(body) body.innerHTML=renderUsersRows();
    //             showToast('User updated!','success');
    //             } catch (error) {
    //             showToast('Error: ' + error.message, 'error');
    //         }
    //         showBtn(btn,false);
    //     },1000);
    // }
    async function saveUser(id, btn) {
        const u = users.find(x => x.id === id);
        if (!u || !canManage(u)) { showToast('Not permitted', 'error'); return; }

        const payload = {
            username: document.getElementById('eu_name').value.trim(),
            email:    document.getElementById('eu_email').value.trim(),
            role:     document.getElementById('eu_role').value,
            location: document.getElementById('eu_loc').value.trim(),
        };

        showBtn(btn, true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                Object.assign(u, payload);
                closeModal('userModal');
                const body = document.getElementById('usersBody');
                if (body) body.innerHTML = renderUsersRows();
                updateRolesStats();
                showToast('User updated!', 'success');
            } else {
                showToast(result.message || 'Failed to update user', 'error');
            }
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
        showBtn(btn, false);
    }
    // ---- ROLE CHANGE (quick promote/demote button) ----
    async function setUserRole(id, newRole, btn) {
        const u = users.find(x => x.id === id);
        if (!u || !canManage(u)) { showToast('Not permitted', 'error'); return; }
        if (newRole === 'admin' && currentUser.role !== 'admin' && currentUser.role !== 'superadmin') return;
        if (newRole === 'user' && u.role === 'admin' && currentUser.role !== 'superadmin') {
            showToast('Only superadmin can demote an admin', 'error');
            return;
        }

        showBtn(btn, true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ role: newRole })
            });
            const result = await res.json();
            if (result.success) {
                u.role = newRole;
                const body = document.getElementById('usersBody');
                if (body) body.innerHTML = renderUsersRows();
                updateRolesStats();
                showToast(`${u.username} is now ${newRole}`, 'success');
            } else {
                showToast(result.message || 'Failed to change role', 'error');
            }
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
        showBtn(btn, false);
    }

    // function toggleBan(id,btn){
    //     showBtn(btn,true);
    //     setTimeout(()=>{
    //         try {
    //             const u=users.find(x=>x.id===id);
    //             if(u){u.banned=!u.banned; showToast(u.banned?`${u.username} banned`:`${u.username} unbanned`,u.banned?'error':'success');}
    //             const body=document.getElementById('usersBody');
    //             if(body) body.innerHTML=renderUsersRows();
    //         } catch (error) {
    //             showToast('Error: ' + error.message, 'error');
    //         }
    //         showBtn(btn,false);
    //     },800);
    // }
    // ---- BAN / UNBAN ----
    async function toggleBan(id, btn) {
        const u = users.find(x => x.id === id);
        if (!u || !canManage(u)) { showToast('Not permitted', 'error'); return; }

        const nextBanned = !u.banned;
        showBtn(btn, true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ banned: nextBanned })
            });
            const result = await res.json();
            if (result.success) {
                u.banned = nextBanned;
                showToast(u.banned ? `${u.username} banned` : `${u.username} unbanned`, u.banned ? 'error' : 'success');
                const body = document.getElementById('usersBody');
                if (body) body.innerHTML = renderUsersRows();
                updateRolesStats();
            } else {
                showToast(result.message || 'Failed to update ban status', 'error');
            }
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
        showBtn(btn, false);
    }

    // function deleteUser(id,btn){
    //     if(id===currentUser?.id){showToast("Can't delete your own account",'error');return;}
    //     showBtn(btn,true);
    //     setTimeout(()=>{
    //         users=users.filter(u=>u.id!==id);
    //         const body=document.getElementById('usersBody');
    //         if(body) body.innerHTML=renderUsersRows();
    //         showToast('User deleted','info');
    //         showBtn(btn,false);
    //     },800);
    // }
    // ---- DELETE ----
    async function deleteUser(id, btn) {
        const u = users.find(x => x.id === id);
        if (!u || !canManage(u)) { showToast('Not permitted', 'error'); return; }
        if (id === currentUser?.id) { showToast("Can't delete your own account", 'error'); return; }

        showBtn(btn, true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const result = await res.json();
            if (result.success) {
                users = users.filter(x => x.id !== id);
                const body = document.getElementById('usersBody');
                if (body) body.innerHTML = renderUsersRows();
                updateRolesStats();
                showToast('User deleted', 'info');
            } else {
                showToast(result.message || 'Failed to delete user', 'error');
            }
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
        showBtn(btn, false);
    }
    // ---- AUTH HELPERS ----
function getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || currentUser?.token || '';
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}
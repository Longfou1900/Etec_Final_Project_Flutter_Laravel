// public/js/products.js

let products = [];
let editingProductId = null;

// 1. Load products from Laravel → MockAPI proxy
async function loadProductsFromDatabase() {
    try {
        // const response = await fetch('/api/products', { headers: getAuthHeaders() });
        const response = await fetch('/api/products');
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
async function renderCrud(container) {
    //after user banned
    if (currentUser?.banned) {
        container.innerHTML = `<div class="page-view">
            <div style="color:var(--text3);padding:40px;text-align:center">
                <i class="ti ti-ban" style="font-size:40px;display:block;margin-bottom:12px"></i>
                Your account has been banned.
            </div>
        </div>`;
        return;
    }
    container.innerHTML = `loading...`;   // your existing HTML
    await loadProductsFromDatabase();
    renderCrudGrid();

    const isAdmin = currentUser && ['admin', 'superadmin'].includes(currentUser.role);
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

    // const isAdmin = currentUser && currentUser.role === 'admin';
    const isAdmin = currentUser && ['admin', 'superadmin'].includes(currentUser.role);

    grid.innerHTML = products.map(p => `
    <div class="watch-card">
        <img src="${p.img || ''}" class="watch-img"
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
            document.getElementById('pm_img').value   = prod.img || '';
            document.getElementById('pm_discount').value = prod.discount || '';
        }
    } else {
        ['pm_name','pm_price','pm_qty','pm_desc','pm_img', 'pm_discount'].forEach(i => {
            const el = document.getElementById(i);
            if (el) el.value = '';
        });
    }
    openModal('productModal');
}

// 5. Save (insert or update) via API
async function saveProduct(btn) {
    if (currentUser?.banned || !['admin','superadmin'].includes(currentUser?.role)) {
        showToast('Not permitted', 'error');
        return;
    }
    showBtn(btn, true);

    const payload = {
        name:        document.getElementById('pm_name').value,
        price:       document.getElementById('pm_price').value,
        qty:         document.getElementById('pm_qty').value,
        description: document.getElementById('pm_desc').value,
        img:       document.getElementById('pm_img').value,
        discount: document.getElementById('pm_discount').value,
    };

    const url    = editingProductId ? `/api/product/${editingProductId}` : '/api/product';
    const method = editingProductId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            // headers: getAuthHeaders(),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
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

    if (currentUser?.banned || !['admin','superadmin'].includes(currentUser?.role)) {
        showToast('Not permitted', 'error');
        return;
    }
    
    if (!confirm('Delete this watch?')) return;
    showBtn(btn, true);

    try {
        const response = await fetch(`/api/product/${id}`, {
            method: 'DELETE',
            // headers: getAuthHeaders()
            headers: {
                "Accept": "application/json"
            }
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

// ---- ANALYTICS PAGE ----
async function renderAnalytics(c) {
    c.innerHTML = `<div class="page-view"><p>Loading...</p></div>`;
    await loadProductsFromDatabase();   // wait for products to populate
    const totalRevenue = products.reduce((a, p) => a + (parseFloat(p.price) || 0) * (parseInt(p.qty) || 0), 0);
    const avgRating = products.length > 0 ? products.reduce((a, p) => a + (parseInt(p.rating) || 0), 0) / products.length : 0;
    
    c.innerHTML = `
    <div class="page-view">
    <div class="grid-4" style="margin-bottom:14px">
      <div class="gcard" style="background:var(--grad1)">
        <div class="gcard-lbl">Total Revenue</div>
        <div class="gcard-val">$${(totalRevenue/1000).toFixed(1)}K</div>
        <span class="stat-chip chip-up" style="background:rgba(255,255,255,0.2);color:#fff">↑ 18.3%</span>
      </div>
      <div class="gcard" style="background:var(--grad3)">
        <div class="gcard-lbl">Products</div>
        <div class="gcard-val">${products.length}</div>
        <span class="stat-chip" style="background:rgba(255,255,255,0.2);color:#fff">↑ ${products.filter(p => p.createdAt && new Date(p.createdAt * 1000).getMonth() === new Date().getMonth()).length} new</span>
      </div>
      <div class="gcard" style="background:var(--grad5)">
        <div class="gcard-lbl">Orders Placed</div>
        <div class="gcard-val">${orders.length}</div>
        <span class="stat-chip" style="background:rgba(255,255,255,0.2);color:#fff">↑ 12%</span>
      </div>
      <div class="gcard" style="background:var(--grad4)">
        <div class="gcard-lbl">Avg Rating</div>
        <div class="gcard-val">${avgRating.toFixed(0)}%</div>
        <span class="stat-chip" style="background:rgba(255,255,255,0.2);color:#fff">↑ 3pts</span>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:14px">
      <div class="card">
        <div class="card-title">Monthly Sales Revenue</div>
        <div class="chart-wrap" style="height:220px"><canvas id="revenueChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-title">Customer Demographics</div>
        <div class="grid-2" style="margin-bottom:12px">
          <div class="mini-stat">
            <div><div class="mini-stat-val">62%</div><div class="mini-stat-lbl">Male buyers</div></div>
            <span style="font-size:22px">👨</span>
          </div>
          <div class="mini-stat">
            <div><div class="mini-stat-val">38%</div><div class="mini-stat-lbl">Female buyers</div></div>
            <span style="font-size:22px">👩</span>
          </div>
        </div>
        <div class="gender-bar">
          <div style="width:62%;background:var(--blue);border-radius:4px 0 0 4px"></div>
          <div style="width:38%;background:var(--pink);border-radius:0 4px 4px 0"></div>
        </div>
        <div class="chart-wrap" style="height:150px;margin-top:12px"><canvas id="demoChart"></canvas></div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:14px">
      <div class="card">
        <div class="card-title">Top Selling Watches</div>
        ${products.sort((a,b)=> (parseInt(b.rating)||0) - (parseInt(a.rating)||0)).slice(0,5).map((p,i)=>`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--grad${(i%5)+1});display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${i+1}</div>
          <img src="${p.img}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;background:var(--bg3);flex-shrink:0" onerror="this.style.background='var(--bg4)'">
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${parseInt(p.rating)||0}%;background:var(--grad1)"></div></div>
          </div>
          <div style="font-size:13px;font-weight:700;color:var(--accent2);flex-shrink:0">$${p.price}</div>
        </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">Product Category Breakdown</div>
        <div class="chart-wrap" style="height:220px"><canvas id="catChart"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">All Products Inventory</div>
      <table>
        <thead><tr><th>Watch</th><th>Company</th><th>Price</th><th>Stock</th><th>Rating</th><th>Discount</th><th>Revenue Est.</th></tr></thead>
        <tbody>
          ${products.map(p=>`<tr>
            <td><div style="display:flex;align-items:center;gap:8px"><img src="${p.img}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;background:var(--bg3)" onerror="this.style.background='var(--bg4)'"><div style="font-size:12px;font-weight:600;color:var(--text)">${p.name}</div></div></td>
            <td>${p.company||'—'}</td>
            <td style="color:var(--accent2);font-weight:600">$${p.price}</td>
            <td><span class="badge ${parseInt(p.qty)>50?'badge-active':'badge-pending'}">${p.qty} units</span></td>
            <td><span class="stat-chip chip-up">${p.rating || 0}%</span></td>
            <td><span class="tag tag-warn">${p.discount || 0}% off</span></td>
            <td style="font-weight:600;color:var(--green)">$${((parseFloat(p.price)||0) * (parseInt(p.qty)||0) / 1000).toFixed(1)}K</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    </div>`;

    setTimeout(() => {
        // Revenue chart
        const rCtx = document.getElementById('revenueChart');
        if (rCtx) {
            charts.revenue = new Chart(rCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [
                        { label: 'Revenue', data: [18000, 24000, 19000, 32000, 28000, 40000, 35000, 45000], borderColor: '#7c6af7', backgroundColor: 'rgba(124,106,247,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#7c6af7', pointRadius: 4 },
                        { label: 'Orders', data: [12000, 18000, 15000, 22000, 20000, 28000, 25000, 32000], borderColor: '#f472b6', backgroundColor: 'rgba(244,114,182,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#f472b6', pointRadius: 4 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(120,130,255,0.06)' }, ticks: { color: '#6b75b8', font: { size: 10 } } },
                        y: { grid: { color: 'rgba(120,130,255,0.06)' }, ticks: { color: '#6b75b8', font: { size: 10 }, callback: v => '$' + (v / 1000) + 'K' } }
                    }
                }
            });
        }
        
        const dCtx = document.getElementById('demoChart');
        if (dCtx) {
            charts.demo = new Chart(dCtx, {
                type: 'bar',
                data: {
                    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                    datasets: [
                        { label: 'Male', data: [15, 28, 20, 12, 8], backgroundColor: 'rgba(96,165,250,0.7)' },
                        { label: 'Female', data: [8, 18, 12, 10, 6], backgroundColor: 'rgba(244,114,182,0.7)' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#6b75b8', font: { size: 10 } } },
                        y: { grid: { color: 'rgba(120,130,255,0.06)' }, ticks: { color: '#6b75b8', font: { size: 10 } } }
                    }
                }
            });
        }
        
        const cCtx = document.getElementById('catChart');
        if (cCtx) {
            charts.cat = new Chart(cCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Automatic', 'Dive', 'Dress', 'Sport', 'Luxury'],
                    datasets: [{ data: [35, 20, 18, 15, 12], backgroundColor: ['#7c6af7', '#60a5fa', '#f472b6', '#34d399', '#f59e0b'], borderWidth: 0, hoverOffset: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: { legend: { position: 'right', labels: { color: '#9ea8d8', font: { size: 11 }, padding: 10, boxWidth: 10 } } }
                }
            });
        }
    }, 100);
}

// ---- ORDERS PAGE ----
async function renderOrders(c) {
    c.innerHTML = `<div class="page-view"><p>Loading...</p></div>`;
    await loadProductsFromDatabase();  

    // Derive a pseudo "orders" list from product data since there's no dedicated orders API yet
    const statusCycle = ['delivered', 'shipping', 'processing', 'pending'];
    const orders = products.map((p, i) => ({
        id: `ORD-${String(p.id).padStart(3, '0')}`,
        user: p.saler || p.username || 'Unknown',
        product: p.name,
        price: parseFloat(p.price) || 0,
        date: p.createdAt ? new Date(p.createdAt * 1000).toLocaleDateString() : '—',
        location: p.location || '—',
        tracking: `TRK${1000 + i}`,
        status: statusCycle[i % statusCycle.length],
    }));

    const statusMap = {
        delivered: { cls: 'badge-active', icon: 'ti-circle-check', steps: 4 },
        shipping: { cls: 'badge-user', icon: 'ti-truck', steps: 3 },
        processing: { cls: 'badge-warn', icon: 'ti-loader', steps: 2 },
        pending: { cls: 'badge-pending', icon: 'ti-clock', steps: 1 }
    };
    
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const shipping = orders.filter(o => o.status === 'shipping').length;
    const totalValue = orders.reduce((a, o) => a + o.price, 0);
    
    c.innerHTML = `
    <div class="page-view">
    <div class="grid-4" style="margin-bottom:14px">
      <div class="mini-stat"><div><div class="mini-stat-val">${totalOrders}</div><div class="mini-stat-lbl">Total Orders</div></div><i class="ti ti-shopping-cart" style="font-size:24px;color:var(--accent)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">${delivered}</div><div class="mini-stat-lbl">Delivered</div></div><i class="ti ti-circle-check" style="font-size:24px;color:var(--green)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">${shipping}</div><div class="mini-stat-lbl">Shipping</div></div><i class="ti ti-truck" style="font-size:24px;color:var(--blue)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">$${totalValue}</div><div class="mini-stat-lbl">Total Value</div></div><i class="ti ti-currency-dollar" style="font-size:24px;color:var(--gold)"></i></div>
    </div>

    <div class="grid-2" style="margin-bottom:14px">
      <div class="card">
        <div class="card-title">Order Status Distribution</div>
        <div class="chart-wrap" style="height:200px"><canvas id="orderStatusChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-title">Order Tracking Details</div>
        ${orders.slice(0,2).map(o => {
          const sm = statusMap[o.status] || statusMap.pending;
          return `<div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div><div style="font-size:13px;font-weight:600;color:var(--text)">${o.id} — ${o.product.split(' ').slice(0,3).join(' ')}</div>
              <div style="font-size:11px;color:var(--text3)">${o.user} · ${o.location}</div></div>
              <span class="badge ${sm.cls}">${o.status}</span>
            </div>
            <div style="display:flex;gap:0">
              ${['Order Placed','Processing','Shipped','Delivered'].map((step,i)=>`
              <div style="flex:1;text-align:center;position:relative">
                <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${i<sm.steps?'var(--green)':'var(--border)'};background:${i<sm.steps?'rgba(52,211,153,0.2)':'var(--bg3)'};display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:10px;color:${i<sm.steps?'var(--green)':'var(--text3)'}">
                  ${i<sm.steps?'✓':i+1}
                </div>
                <div style="font-size:9px;color:var(--text3);margin-top:3px">${step}</div>
                ${i<3?`<div style="position:absolute;top:10px;left:60%;width:80%;height:1px;background:${i<sm.steps-1?'var(--green)':'var(--border)'}"></div>`:''}
              </div>`).join('')}
            </div>
            <div style="font-size:11px;color:var(--text3);margin-top:8px">Tracking: <span style="color:var(--accent2)">${o.tracking}</span></div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">All Orders</div>
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Price</th><th>Date</th><th>Location</th><th>Tracking</th><th>Status</th></tr></thead>
        <tbody>
          ${orders.map(o => {
            const sm = statusMap[o.status] || { cls: 'badge-user' };
            return `<tr>
              <td style="font-weight:600;color:var(--accent2)">${o.id}</td>
              <td>${o.user}</td>
              <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.product}</td>
              <td style="color:var(--green);font-weight:600">$${o.price}</td>
              <td>${o.date}</td>
              <td><i class="ti ti-map-pin" style="font-size:12px"></i> ${o.location}</td>
              <td style="color:var(--text3);font-size:11px">${o.tracking}</td>
              <td><span class="badge ${sm.cls}">${o.status}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    </div>`;
    
    setTimeout(() => {
        const ctx = document.getElementById('orderStatusChart');
        if (ctx) {
            const statusCounts = ['delivered', 'shipping', 'processing', 'pending'].map(s => orders.filter(o => o.status === s).length);
            charts.orderStatus = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Delivered', 'Shipping', 'Processing', 'Pending'],
                    datasets: [{ data: statusCounts, backgroundColor: ['#34d399', '#60a5fa', '#f59e0b', '#f87171'], borderWidth: 0 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: { legend: { position: 'right', labels: { color: '#9ea8d8', font: { size: 11 }, boxWidth: 10, padding: 8 } } }
                }
            });
        }
    }, 100);
}

// ---- SOLD PAGE ----
async function renderSold(c) {
        c.innerHTML = `<div class="page-view"><p>Loading...</p></div>`;
        await loadProductsFromDatabase();  

    // Derive orders from product data (same logic as renderOrders, until a real orders API exists)
    const statusCycle = ['delivered', 'shipping', 'processing', 'pending'];
    const orders = products.map((p, i) => ({
        id: `ORD-${String(p.id).padStart(3, '0')}`,
        user: p.saler || p.username || 'Unknown',
        product: p.name,
        price: parseFloat(p.price) || 0,
        date: p.createdAt ? new Date(p.createdAt * 1000).toLocaleDateString() : '—',
        location: p.location || '—',
        tracking: `TRK${1000 + i}`,
        status: statusCycle[i % statusCycle.length],
    }));

    const totalRevenue = orders.reduce((a, o) => a + o.price, 0);
    const avgPrice = orders.length > 0 ? totalRevenue / orders.length : 0;
    const uniqueBuyers = [...new Set(orders.map(o => o.user))].length;
    
    c.innerHTML = `
    <div class="page-view">
    <div class="grid-4" style="margin-bottom:14px">
      <div class="mini-stat"><div><div class="mini-stat-val">${orders.length}</div><div class="mini-stat-lbl">Items Sold</div></div><i class="ti ti-receipt-2" style="font-size:22px;color:var(--accent)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">$${totalRevenue.toLocaleString()}</div><div class="mini-stat-lbl">Total Revenue</div></div><i class="ti ti-currency-dollar" style="font-size:22px;color:var(--green)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">$${avgPrice.toFixed(0)}</div><div class="mini-stat-lbl">Avg Sale Price</div></div><i class="ti ti-chart-line" style="font-size:22px;color:var(--gold)"></i></div>
      <div class="mini-stat"><div><div class="mini-stat-val">${uniqueBuyers}</div><div class="mini-stat-lbl">Unique Buyers</div></div><i class="ti ti-users" style="font-size:22px;color:var(--pink)"></i></div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div class="card-title" style="margin:0">Purchase History</div>
        <div class="search-box" style="width:200px"><i class="ti ti-search" style="font-size:14px;color:var(--text3)"></i><input placeholder="Search..." style="width:140px;background:none;border:none;outline:none;font-size:12px;color:var(--text);font-family:var(--font)" oninput="filterSold(this.value)"></div>
      </div>
      <table id="soldTable">
        <thead><tr><th>#</th><th>Buyer</th><th>Product</th><th>Price</th><th>Date</th><th>Status</th></tr></thead>
        <tbody id="soldBody">
          ${orders.map((o,i)=>`<tr>
            <td style="color:var(--text3);font-size:11px">${i+1}</td>
            <td><div style="display:flex;align-items:center;gap:8px">
              <div style="width:28px;height:28px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">${o.user.substring(0,2).toUpperCase()}</div>
              <span style="font-weight:500;color:var(--text)">${o.user}</span>
            </div></td>
            <td style="color:var(--text2)">${o.product}</td>
            <td style="color:var(--accent2);font-weight:700">$${o.price}</td>
            <td style="color:var(--text3)">${o.date}</td>
            <td><span class="badge ${o.status==='delivered'?'badge-active':o.status==='shipping'?'badge-user':'badge-pending'}">${o.status}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    </div>`;
}

function filterSold(q) {
    const rows = document.querySelectorAll('#soldBody tr');
    rows.forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none' });
}


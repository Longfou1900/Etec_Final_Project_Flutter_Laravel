<!-- //resources/views/dashboard.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CamboStore Dashboard</title>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
    
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body></body>

<div class="toast-container" id="toastContainer"></div>

<!-- AUTH SCREEN -->
<div id="authScreen" class="auth-screen">
  <div class="auth-left">
    <div style="width:100%;max-width:360px">
      <!-- LOGIN VIEW -->
      <div id="loginView">
        <div class="auth-logo">⌚ ChronoStore</div>
        <p class="auth-subtitle">Sign in to your dashboard</p>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input class="form-input" id="loginUser" placeholder="Enter username" value="Ah Boto">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <input class="form-input" id="loginPass" type="password" placeholder="Enter password" value="boto1234">
            <i class="ti ti-eye input-icon" id="loginEye" onclick="togglePw('loginPass','loginEye')"></i>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:13px">
          <label style="display:flex;align-items:center;gap:6px;color:var(--text2);cursor:pointer">
            <input type="checkbox" checked style="accent-color:var(--accent)"> Remember me
          </label>
          <span class="auth-link" onclick="showView('forgotView')">Forgot password?</span>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" onclick="doLogin(this)">
          <span class="spin"></span><span class="btn-text">Sign In</span>
        </button>
        <div class="divider">or continue with</div>
        <button class="social-btn" onclick="doSocialLogin('Google',this)">
          <svg class="social-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="social-btn" onclick="doSocialLogin('Facebook',this)">
            <svg class="social-icon" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
          <button class="social-btn" onclick="doSocialLogin('X',this)">
            <svg class="social-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X (Twitter)
          </button>
        </div>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text3)">
          No account? <span class="auth-link" onclick="showView('registerView')">Create one</span>
        </p>
      </div>

      <!-- REGISTER VIEW -->
      <div id="registerView" style="display:none">
        <div class="auth-logo">⌚ ChronoStore</div>
        <p class="auth-subtitle">Create your account</p>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input class="form-input" id="regUser" placeholder="Your username">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" id="regEmail" placeholder="your@email.com" type="email">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <input class="form-input" id="regPass" type="password" placeholder="Create password">
            <i class="ti ti-eye input-icon" id="regEye" onclick="togglePw('regPass','regEye')"></i>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <select class="form-input" id="regRole">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;margin-bottom:12px" onclick="doRegister(this)">
          <span class="spin"></span><span class="btn-text">Create Account</span>
        </button>
        <p style="text-align:center;font-size:13px;color:var(--text3)">
          Have an account? <span class="auth-link" onclick="showView('loginView')">Sign in</span>
        </p>
      </div>

      <!-- FORGOT PASSWORD VIEW -->
      <div id="forgotView" style="display:none">
        <div class="auth-logo">⌚ ChronoStore</div>
        <p class="auth-subtitle">Reset your password</p>
        <div class="forgot-step active" id="forgotStep1">
          <div class="form-group">
            <label class="form-label">Your Email Address</label>
            <input class="form-input" id="forgotEmail" placeholder="Enter your Gmail" type="email">
          </div>
          <p style="font-size:12px;color:var(--text3);margin-bottom:12px">We'll send a 6-digit code to your email (check spam folder)</p>
          <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" onclick="sendForgotCode(this)">
            <span class="spin"></span><span class="btn-text">Send Reset Code</span>
          </button>
        </div>
        <div class="forgot-step" id="forgotStep2">
          <p style="font-size:13px;color:var(--text2);margin-bottom:8px">Enter the 6-digit code sent to <strong id="forgotEmailDisplay" style="color:var(--accent2)"></strong></p>
          <div class="code-inputs" id="codeInputs">
            <input class="code-input" maxlength="1" oninput="codeNext(this,0)" id="c0">
            <input class="code-input" maxlength="1" oninput="codeNext(this,1)" id="c1">
            <input class="code-input" maxlength="1" oninput="codeNext(this,2)" id="c2">
            <input class="code-input" maxlength="1" oninput="codeNext(this,3)" id="c3">
            <input class="code-input" maxlength="1" oninput="codeNext(this,4)" id="c4">
            <input class="code-input" maxlength="1" oninput="codeNext(this,5)" id="c5">
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" onclick="verifyCode(this)">
            <span class="spin"></span><span class="btn-text">Verify Code</span>
          </button>
        </div>
        <div class="forgot-step" id="forgotStep3">
          <p style="font-size:13px;color:var(--text2);margin-bottom:16px">Create your new password</p>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="input-wrap">
              <input class="form-input" id="newPass" type="password" placeholder="New password">
              <i class="ti ti-eye input-icon" id="newPassEye" onclick="togglePw('newPass','newPassEye')"></i>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-wrap">
              <input class="form-input" id="confirmPass" type="password" placeholder="Confirm password">
              <i class="ti ti-eye input-icon" id="confPassEye" onclick="togglePw('confirmPass','confPassEye')"></i>
            </div>
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" onclick="resetPassword(this)">
            <span class="spin"></span><span class="btn-text">Update Password</span>
          </button>
        </div>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text3)">
          <span class="auth-link" onclick="showView('loginView')">← Back to login</span>
        </p>
      </div>
    </div>
  </div>

  <div class="auth-right">
    <div class="auth-orb" style="width:300px;height:300px;background:#7c6af7;top:-10%;right:-5%"></div>
    <div class="auth-orb" style="width:200px;height:200px;background:#a855f7;bottom:10%;left:10%"></div>
    <div class="auth-orb" style="width:150px;height:150px;background:#3b82f6;top:40%;right:30%"></div>
    <div class="auth-right-text">
      <div style="font-size:64px;margin-bottom:16px">⌚</div>
      <h2>ChronoStore</h2>
      <p>Premium watch management platform. Track sales, analytics, and inventory in real-time.</p>
      <div style="margin-top:32px;display:flex;gap:24px;justify-content:center">
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:#a78bfa">2.4K+</div><div style="font-size:11px;opacity:0.6;margin-top:2px">Watches Sold</div></div>
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:#60a5fa">$450K</div><div style="font-size:11px;opacity:0.6;margin-top:2px">Revenue</div></div>
        <div style="text-align:center"><div style="font-size:24px;font-weight:700;color:#34d399">98%</div><div style="font-size:11px;opacity:0.6;margin-top:2px">Satisfaction</div></div>
      </div>
    </div>
  </div>
</div>

<!-- DASHBOARD SCREEN -->
<div id="dashScreen" class="app" style="display:none">
  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="brand">
      <div class="brand-name">⌚ Chrono</div>
      <div class="brand-sub">Store Admin</div>
    </div>
    <nav class="nav">
      <div class="nav-section">Analytics</div>
      <div class="nav-item active" onclick="showPage('analytics',this)"><i class="ti ti-chart-bar"></i>All Products</div>
      <div class="nav-item" onclick="showPage('orders',this)"><i class="ti ti-truck"></i>Order Analyse</div>
      <div class="nav-section">Management</div>
      <div class="nav-item" onclick="showPage('sold',this)"><i class="ti ti-receipt"></i>Product Sold</div>
      <div class="nav-item admin-only" onclick="showPage('crud',this)"><i class="ti ti-package"></i>Product CRUD</div>
      <div class="nav-item admin-only" onclick="showPage('roles',this)"><i class="ti ti-users"></i>User Roles</div>
      <div class="nav-section">Account</div>
      <div class="nav-item" onclick="showPage('profile',this)"><i class="ti ti-user-circle"></i>Profile</div>
    </nav>
    <div class="sidebar-footer">
      <div class="theme-toggle" onclick="toggleTheme()">
        <i class="ti ti-moon" style="font-size:15px;color:var(--text3)"></i>
        <div class="toggle-track" id="themeTrack"><div class="toggle-knob" id="themeKnob"></div></div>
        <i class="ti ti-sun" style="font-size:15px;color:var(--gold)"></i>
        <span style="font-size:12px;color:var(--text3);margin-left:4px" id="themeLabel">Dark</span>
      </div>
    </div>
  </div>

  <!-- MAIN -->
  <div class="main">
    <!-- TOPBAR -->
    <div class="topbar">
      <div class="topbar-title" id="pageTitle">All Products Analytics</div>
      <div class="topbar-spacer"></div>
      <div class="search-box"><i class="ti ti-search" style="font-size:15px;color:var(--text3)"></i><input placeholder="Search..."></div>
      <div class="topbar-btn"><i class="ti ti-bell"></i><div class="notif-dot"></div></div>
      <div class="topbar-btn"><i class="ti ti-settings"></i></div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="avatar" id="topbarAvatar">AB</div>
        <div class="user-info">
          <div class="user-name" id="topbarName">Ah Boto</div>
          <div class="user-role" id="topbarRole">Admin</div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content" id="mainContent">
      <!-- Will be rendered by JS -->
    </div>
  </div>
</div>

<!-- PRODUCT MODAL -->
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
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" id="pm_company" placeholder="ZINVO"></div>
      <div class="form-group"><label class="form-label">Warranty (mo)</label><input class="form-input" id="pm_warranty" type="number" placeholder="24"></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Strap</label><input class="form-input" id="pm_strap" placeholder="Leather"></div>
      <div class="form-group"><label class="form-label">Discount (%)</label><input class="form-input" id="pm_discount" type="number" placeholder="0"></div>
    </div>
    <div class="form-group"><label class="form-label">Image URL</label><input class="form-input" id="pm_img" placeholder="https://..."></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal('productModal')">Cancel</button>
      <button class="btn btn-primary" onclick="saveProduct(this)" id="saveProductBtn">
        <span class="spin"></span><span class="btn-text">Save Product</span>
      </button>
    </div>
  </div>
</div>

<!-- USER MODAL -->
<div class="modal-overlay" id="userModal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Edit User</div>
      <i class="ti ti-x modal-close" onclick="closeModal('userModal')"></i>
    </div>
    <div id="userModalContent"></div>
  </div>
</div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
    <script src="{{ asset('js/utils.js') }}"></script>
    <!-- <script src="{{ asset('js/dashboard.js') }}"></script> -->
    <script src="{{ asset('js/auth.js') }}"></script>
    <script src="{{ asset('js/charts.js') }}"></script>
    <script src="{{ asset('js/products.js') }}"></script> 
 </body>
</html>
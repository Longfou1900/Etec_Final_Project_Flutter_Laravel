// //resoucres/js/auth.js
// function togglePw(inputId, iconId) {
//     const inp = document.getElementById(inputId);
//     const ico = document.getElementById(iconId);
//     if (inp.type === "password") {
//         inp.type = "text";
//         ico.className = "ti ti-eye-off input-icon";
//     } else {
//         inp.type = "password";
//         ico.className = "ti ti-eye input-icon";
//     }
// }

// function showView(v) {
//     ["loginView", "registerView", "forgotView"].forEach((id) => {
//         const el = document.getElementById(id);
//         if (el) el.style.display = "none";
//     });
//     const target = document.getElementById(v);
//     if (target) target.style.display = "block";
// }

// // --- ACTUAL BACKEND API CALLS ---

// async function doLogin(btn) {
//     const email = document.getElementById("loginUser").value; // Changed to email assuming Laravel default auth
//     const password = document.getElementById("loginPass").value;

//     showBtn(btn, true);

//     try {
//         const response = await fetch("/api/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//             },
//             body: JSON.stringify({ email: email, password: password }),
//         });

//         const data = await response.json();

//         // if (response.ok) {
//         //     // Save the token Laravel Sanctum gives us
//         //     localStorage.setItem("auth_token", data.token);
//         //     showToast("Login successful!", "success");
//         //     showDashboard(data.user); // Pass user data to utils.js
//         // }
//         if (response.ok) {

//             localStorage.setItem("auth_token", data.token);

//             localStorage.setItem(
//                 "currentUser",
//                 JSON.stringify(data.user)
//             );

//             showToast("Login successful!", "success");

//             showDashboard(data.user);

//         }
//          else {
//             showToast(data.message || "Invalid credentials", "error");
//         }
//     } catch (error) {
//         showToast("Server connection error", "error");
//     }

//     showBtn(btn, false);
// }

// async function doLogout(btn) {
//     showBtn(btn, true);

//     try {
//         await fetch("/api/logout", {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//             },
//         });

//         // Clear local memory
//         // localStorage.removeItem("auth_token");
//         localStorage.removeItem("currentUser");
//         currentUser = null;

//         // Reset UI
//         document.getElementById("dashScreen").style.display = "none";
//         document.getElementById("authScreen").style.display = "flex";
//         showView("loginView");
//         showToast("Logged out securely", "info");
//     } catch (error) {
//         console.error("Logout error", error);
//     }
//     showBtn(btn, false);
// }
// // --- STARTUP IGNITION ---
// // This tells the browser what to show as soon as the page loads
// // document.addEventListener('DOMContentLoaded', () => {
// //     const authScreen = document.getElementById('authScreen');
// //     const dashScreen = document.getElementById('dashScreen');

// //     if (authScreen) authScreen.style.display = 'flex';
// //     if (dashScreen) dashScreen.style.display = 'none';
    
// //     showView('loginView'); // Force the login form to be visible
// // });
// document.addEventListener("DOMContentLoaded", () => {

//     const savedUser = localStorage.getItem("currentUser");

//     if(savedUser){

//         showDashboard(JSON.parse(savedUser));

//     }else{

//         document.getElementById("authScreen").style.display="flex";
//         document.getElementById("dashScreen").style.display="none";

//         showView("loginView");

//     }

// });

// public/js/auth.js

// public/js/auth.js

// ---- PASSWORD TOGGLE ----
function togglePw(inputId, iconId) {
    const inp = document.getElementById(inputId);
    const ico = document.getElementById(iconId);
    if (inp.type === 'password') {
        inp.type = 'text';
        ico.className = 'ti ti-eye-off input-icon';
    } else {
        inp.type = 'password';
        ico.className = 'ti ti-eye input-icon';
    }
}

// ---- VIEW SWITCHER ----
function showView(v) {
    ['loginView', 'registerView', 'forgotView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(v);
    if (target) target.style.display = 'block';

    if (v === 'forgotView') {
        document.querySelectorAll('.forgot-step').forEach(s => s.classList.remove('active'));
        const s1 = document.getElementById('forgotStep1');
        if (s1) s1.classList.add('active');
    }
}

// ---- LOGIN ----
async function doLogin(btn) {
    const email    = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;

    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }

    showBtn(btn, true);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store user in localStorage (no Sanctum token — MockAPI is stateless)
            localStorage.setItem('current_user', JSON.stringify(data.user));
            showToast('Login successful!', 'success');
            showDashboard(data.user);
        } else {
            showToast(data.message || 'Invalid email or password', 'error');
        }
    } catch (error) {
        showToast('Cannot connect to server. Is Laravel running?', 'error');
    }

    showBtn(btn, false);
}

// ---- REGISTER ----
async function doRegister(btn) {
    const username = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;

    if (!username || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    showBtn(btn, true);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showToast(`Account created! Your reset code is: ${data.user.code} (save it)`, 'success');
            setTimeout(() => showView('loginView'), 3000);
        } else {
            if (data.errors) {
                const firstErr = Object.values(data.errors)[0][0];
                showToast(firstErr, 'error');
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        }
    } catch (error) {
        showToast('Cannot connect to server', 'error');
    }

    showBtn(btn, false);
}

// ---- SOCIAL LOGIN (stub) ----
function doSocialLogin(provider, btn) {
    showBtn(btn, true);
    showToast(`${provider} OAuth login requires additional server setup`, 'info');
    setTimeout(() => showBtn(btn, false), 1000);
}

// ---- FORGOT PASSWORD — step 1: find user by email ----
let forgotUser = null;

async function sendForgotCode(btn) {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) { showToast('Enter your email address', 'error'); return; }

    showBtn(btn, true);

    try {
        // Fetch all users and find by email
        const response = await fetch('/api/users', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!data.success) {
            showToast('Cannot reach user API', 'error');
            showBtn(btn, false);
            return;
        }

        const found = data.data.find(u => u.email === email);
        if (!found) {
            showToast('No account found with that email', 'error');
            showBtn(btn, false);
            return;
        }

        forgotUser = found;
        document.getElementById('forgotEmailDisplay').textContent = email;
        document.getElementById('forgotStep1').classList.remove('active');
        document.getElementById('forgotStep2').classList.add('active');
        // The code is stored in MockAPI under user.code
        showToast('Code found! Check your account code (stored in API).', 'info');

    } catch (e) {
        showToast('Server error', 'error');
    }

    showBtn(btn, false);
}

// ---- FORGOT PASSWORD — step 2: verify code ----
function codeNext(inp, idx) {
    if (inp.value.length === 1 && idx < 5) {
        document.getElementById('c' + (idx + 1)).focus();
    }
}

function verifyCode(btn) {
    const entered = [0,1,2,3,4,5].map(i => document.getElementById('c'+i).value).join('');
    if (entered.length < 6) { showToast('Enter all 6 digits', 'error'); return; }

    showBtn(btn, true);

    // Compare against the code stored in MockAPI for this user
    if (forgotUser && String(forgotUser.code) === entered) {
        setTimeout(() => {
            document.getElementById('forgotStep2').classList.remove('active');
            document.getElementById('forgotStep3').classList.add('active');
            showToast('Code verified!', 'success');
            showBtn(btn, false);
        }, 500);
    } else {
        showToast('Wrong code. Check your registration code.', 'error');
        showBtn(btn, false);
    }
}

// ---- FORGOT PASSWORD — step 3: update password via MockAPI ----
async function resetPassword(btn) {
    const np = document.getElementById('newPass').value;
    const cp = document.getElementById('confirmPass').value;

    if (!np || np !== cp)  { showToast('Passwords do not match', 'error'); return; }
    if (np.length < 6)     { showToast('Password must be at least 6 characters', 'error'); return; }
    if (!forgotUser?.id)   { showToast('Session expired. Start again.', 'error'); return; }

    showBtn(btn, true);

    try {
        // Update the user's password on MockAPI
        const response = await fetch(`/api/users/${forgotUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ ...forgotUser, password: np })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Password updated! Please sign in.', 'success');
            forgotUser = null;
            setTimeout(() => showView('loginView'), 1500);
        } else {
            showToast('Failed to update password', 'error');
        }
    } catch (e) {
        showToast('Server error', 'error');
    }

    showBtn(btn, false);
}

// ---- LOGOUT ----
async function doLogout(btn) {
    showBtn(btn, true);

    // No server token to revoke — just clear localStorage
    await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
    }).catch(() => {});

    localStorage.removeItem('current_user');
    currentUser = null;

    document.getElementById('dashScreen').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    showView('loginView');
    showToast('Logged out', 'info');

    showBtn(btn, false);
}

// ---- STARTUP: check if already logged in ----
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('current_user');
    if (saved) {
        try {
            const user = JSON.parse(saved);
            showDashboard(user);       // resume session
            return;
        } catch (e) {
            localStorage.removeItem('current_user');
        }
    }
    // No session — show login
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('dashScreen').style.display  = 'none';
    showView('loginView');
});
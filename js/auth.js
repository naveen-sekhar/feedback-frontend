const API_BASE = window.location.origin;

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get user info from localStorage
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Save auth data to localStorage
function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear auth data
function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Logout
function logout() {
    clearAuth();
    window.location.href = 'index.html';
}

// Check if user is logged in and redirect accordingly
function checkAuth() {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        // Not logged in - if on a dashboard page, redirect to login
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
        return null;
    }

    // If logged in and on login/register page, redirect to dashboard
    const currentPage = window.location.pathname;
    if (currentPage.endsWith('index.html') || currentPage === '/' || currentPage.endsWith('register.html')) {
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }

    // If user is on wrong dashboard, redirect
    if (currentPage.includes('admin-dashboard') && user.role !== 'admin') {
        window.location.href = 'user-dashboard.html';
    }
    if (currentPage.includes('user-dashboard') && user.role !== 'user') {
        window.location.href = 'admin-dashboard.html';
    }

    return user;
}

// Show error message
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 5000);
    }
}

// Show success message
function showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 4000);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showError('error-msg', data.message);
            return;
        }

        saveAuth(data.token, data.user);

        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    } catch (error) {
        showError('error-msg', 'Connection error. Please try again.');
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();

        if (!res.ok) {
            showError('error-msg', data.message);
            return;
        }

        showSuccess('success-msg', 'Registration successful! Redirecting to login...');
        document.getElementById('register-form').reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        showError('error-msg', 'Connection error. Please try again.');
    }
}

// Make authenticated API requests
async function apiRequest(url, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${url}`, options);

    if (res.status === 401 || res.status === 403) {
        const data = await res.json();
        if (data.message.includes('token') || data.message.includes('Access denied')) {
            clearAuth();
            window.location.href = 'index.html';
            return null;
        }
        return { error: true, status: res.status, data };
    }

    const data = await res.json();
    if (!res.ok) return { error: true, status: res.status, data };
    return { error: false, data };
}

// Format date
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

// Calculate time remaining for edit
function getEditTimeInfo(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMin = diffMs / (1000 * 60);
    const remainingMin = 15 - diffMin;

    if (remainingMin <= 0) {
        return { canEdit: false, message: 'Edit window expired' };
    }

    return {
        canEdit: true,
        message: `${Math.ceil(remainingMin)} min remaining to edit`
    };
}

// Run auth check on page load
checkAuth();

// Set username in navbar if present
const user = getUser();
const userNameEl = document.getElementById('user-name');
if (user && userNameEl) {
    userNameEl.textContent = `Welcome, ${user.name}`;
}

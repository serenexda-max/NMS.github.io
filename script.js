const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

const supportLink = document.getElementById('supportLink');
const supportCard = document.getElementById('supportCard');
const closeSupportBtn = document.getElementById('closeSupportBtn');
const overlay = document.getElementById('overlay');

togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
    const action = type === 'text' ? 'Hide' : 'Show';
    this.setAttribute('aria-label', `${action} password`);
});

supportLink.addEventListener('click', function(e) {
    e.preventDefault();
    openSupportCard();
});

closeSupportBtn.addEventListener('click', function() {
    closeSupportCard();
});

overlay.addEventListener('click', function() {
    closeSupportCard();
});

function openSupportCard() {
    supportCard.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSupportCard() {
    supportCard.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && supportCard.classList.contains('active')) {
        closeSupportCard();
    }
});

function validateForm() {
    let isValid = true;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';
    if (username.length === 0) {
        usernameError.textContent = 'Username is required';
        usernameError.style.display = 'block';
        usernameInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else if (username.length < 3) {
        usernameError.textContent = 'Username must be at least 3 characters';
        usernameError.style.display = 'block';
        usernameInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else {
        usernameInput.style.borderColor = '#333';
    }
    if (password.length === 0) {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        passwordInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.style.display = 'block';
        passwordInput.style.borderColor = '#ff6b6b';
        isValid = false;
    } else {
        passwordInput.style.borderColor = '#333';
    }
    
    return isValid;
}

function showNotification(message, type = 'info') {
    notificationMessage.textContent = message;
    if (type === 'success') {
        notification.style.borderLeftColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.borderLeftColor = '#ff6b6b';
    } else {
        notification.style.borderLeftColor = '#4a9eff';
    }
    
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (supportCard.classList.contains('active')) {
        closeSupportCard();
    }
    
    if (!validateForm()) {
        return;
    }
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const submitBtn = loginForm.querySelector('.btn-login');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (username === 'admin' && password === 'admin123') {
            showNotification(`Welcome, ${username}! Redirecting to admin dashboard...`, 'success');
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            
        } else {
            showNotification('Invalid username or password.');
        }
    }, 1500);
});

window.addEventListener('load', function() {
    usernameInput.focus();
});

usernameInput.addEventListener('input', function() {
    if (usernameError.style.display === 'block') {
        validateForm();
    }
});

passwordInput.addEventListener('input', function() {
    if (passwordError.style.display === 'block') {
        validateForm();
    }
});

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#4a9eff';
    });
    
    input.addEventListener('blur', function() {
        if (!this.classList.contains('error')) {
            this.style.borderColor = '#333';
        }
    });
});

window.addEventListener('load', function() {
    setTimeout(() => {
        showNotification('Use "admin" / "admin123" for demo login', 'info');
    }, 1000);
});
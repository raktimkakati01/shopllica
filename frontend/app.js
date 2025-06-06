const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const message = document.getElementById('message');

// Toggle forms
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    message.textContent = '';
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    message.textContent = '';
});

const apiUrl = 'http://localhost:5000/api/users';

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({email, password})
        });
        const data = await res.json();
        if (res.ok) {
            message.style.color = 'green';
            message.textContent = `Welcome ${data.name}`;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (err) {
        message.style.color = 'red';
        message.textContent = err.message;
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({name, email, password})
        });
        const data = await res.json();
        if (res.ok) {
            message.style.color = 'green';
            message.textContent = 'Registration successful. You can log in now.';
            registerForm.reset();
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (err) {
        message.style.color = 'red';
        message.textContent = err.message;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Function to show error message
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.username);
                window.location.href = '/chat.html';
            } else {
                // Show error message from server
                showError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (!navigator.onLine) {
                showError('No internet connection. Please check your network and try again.');
            } else {
                showError('Unable to connect to the server. Please try again later.');
            }
        }
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Function to show error message
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        signupForm.insertBefore(errorDiv, signupForm.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    };

    // Function to validate password match
    const validatePasswords = () => {
        if (passwordInput.value.length < 6) {
            showError('Password must be at least 6 characters long');
            return false;
        }
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError('Passwords do not match!');
            return false;
        }
        return true;
    };

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        const formData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        };

        try {
            console.log('Sending signup request...');
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                // Signup successful
                localStorage.setItem('pendingEmail', formData.email);
                window.location.href = '/otp.html';
            } else {
                // Show error message from server
                showError(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (!navigator.onLine) {
                showError('No internet connection. Please check your network and try again.');
            } else {
                showError('Unable to connect to the server. Please try again later.');
            }
        }
    });
}); 
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';
            // Redirect to a page where user can enter OTP and new password, passing email
            localStorage.setItem('resetEmail', email);
            window.location.href = 'reset-password.html';
        } else {
            messageDiv.textContent = data.message || 'An error occurred';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Network error or server unavailable';
        messageDiv.style.color = 'red';
    }
}); 
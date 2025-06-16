document.addEventListener('DOMContentLoaded', () => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (resetEmail) {
        document.getElementById('email').value = resetEmail;
    } else {
        // Redirect to forgot password if email not found in localStorage
        window.location.href = 'forgot-password.html';
    }

    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const otp = document.getElementById('otp').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageDiv = document.getElementById('message');

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'New password and confirm password do not match.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'green';
                localStorage.removeItem('resetEmail'); // Clear stored email
                // Optionally redirect to login page after successful reset
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
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
}); 
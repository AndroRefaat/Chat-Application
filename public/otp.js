document.addEventListener('DOMContentLoaded', () => {
    const otpForm = document.getElementById('otp-form');
    const otpInput = document.getElementById('otp');
    const pendingEmail = localStorage.getItem('pendingEmail');

    // Function to show error message
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        otpForm.insertBefore(errorDiv, otpForm.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    };

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!pendingEmail) {
            showError('No email found. Please register again.');
            setTimeout(() => window.location.href = '/index.html', 2000);
            return;
        }
        const otp = otpInput.value.trim();
        if (!otp) {
            showError('Please enter the OTP.');
            return;
        }
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: pendingEmail, otp })
            });
            const data = await response.json();
            if (response.ok) {
                // OTP verified successfully
                localStorage.removeItem('pendingEmail');
                window.location.href = '/login.html';
            } else {
                showError(data.message || 'OTP verification failed.');
            }
        } catch (error) {
            showError('Unable to connect to the server. Please try again later.');
        }
    });

    // Optional: Resend OTP handler (if you implement it in backend)
    const resendBtn = document.getElementById('resend-otp');
    if (resendBtn) {
        resendBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!pendingEmail) {
                showError('No email found. Please register again.');
                setTimeout(() => window.location.href = '/index.html', 2000);
                return;
            }
            try {
                const response = await fetch('/api/resend-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: pendingEmail })
                });
                const data = await response.json();
                if (response.ok) {
                    showError('OTP resent to your email.');
                } else {
                    showError(data.message || 'Failed to resend OTP.');
                }
            } catch (error) {
                showError('Unable to connect to the server. Please try again later.');
            }
        });
    }
});

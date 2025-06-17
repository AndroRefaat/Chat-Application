export const signup = (otp) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Activate Your Account</title>
        <style>
            body {
                font-family: 'Open Sans', Arial, sans-serif;
                background: #ebebeb;
                margin: 0;
                padding: 0;
            }
            .container {
                background: #fff;
                width: 100%;
                max-width: 420px;
                margin: 40px auto;
                border-radius: 18px;
                box-shadow: 0 4px 24px rgba(45,45,45,0.08);
                overflow: hidden;
                border: 1px solid #f0f0f0;
            }
            .header {
                background: #ff4d4f;
                color: #fff;
                padding: 24px 0 12px 0;
                font-size: 28px;
                font-weight: 800;
                letter-spacing: 2px;
                text-align: center;
            }
            .icon {
                font-size: 48px;
                margin-bottom: 8px;
            }
            .content {
                padding: 28px 24px 18px 24px;
                text-align: center;
            }
            .content h2 {
                font-size: 22px;
                color: #222;
                margin-bottom: 8px;
            }
            .content p {
                color: #555;
                font-size: 16px;
                margin: 10px 0 18px 0;
            }
            .otp-box {
                display: inline-block;
                background: #fff0f0;
                color: #ff4d4f;
                font-size: 28px;
                font-weight: 700;
                padding: 12px 32px;
                border-radius: 10px;
                letter-spacing: 6px;
                margin: 12px 0 18px 0;
                border: 2px dashed #ff4d4f;
            }
            .footer {
                background: #f6f6f6;
                color: #888;
                font-size: 13px;
                padding: 18px 20px;
                border-radius: 0 0 18px 18px;
                text-align: center;
            }
            @media (max-width: 500px) {
                .container { max-width: 98vw; }
                .content { padding: 18px 6vw 12px 6vw; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="icon">💬</span><br/>
                iChat
            </div>
            <div class="content">
                <h2>Welcome to iChat!</h2>
                <p>Use the following OTP to verify your email address:</p>
                <div class="otp-box">${otp}</div>
                <p style="margin-top:18px;">This OTP will expire in 10 minutes.<br/>Do not share it with anyone.</p>
            </div>
            <div class="footer">
                Need help? Just reply to this email — we're always happy to assist.<br/>
                &copy; ${new Date().getFullYear()} iChat
            </div>
        </div>
    </body>
</html>`;

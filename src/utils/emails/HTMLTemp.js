export const signup = (otp) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Activate Your Account</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: white;
                width: 50%;
                max-width: 400px;
                margin: 50px auto;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #ff4d4d;
                color: white;
                padding: 15px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
            }
            .content h2 {
                font-size: 24px;
                color: #333;
            }
            .otp-box {
                display: inline-block;
                background-color: #f8f8f8;
                padding: 10px 20px;
                font-size: 22px;
                font-weight: bold;
                color: #ff4d4d;
                border-radius: 5px;
                margin-top: 15px;
                letter-spacing: 3px;
            }
            .footer {
                font-size: 14px;
                color: gray;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Chat App
            </div>
            <div class="content">
                <h2>Welcome!</h2>
                <p>Use the following OTP to verify your email:</p>
                <div class="otp-box">${otp}</div>
                <p>This OTP will expire in 10 minutes. Do not share it with anyone.</p>
            </div>
            <div class="footer">
                If you have any questions, just reply to this email—we’re always happy to help.
            </div>
        </div>
    </body>
</html>`;

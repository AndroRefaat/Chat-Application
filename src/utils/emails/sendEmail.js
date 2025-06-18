import nodemailer from 'nodemailer';

const sendEmails = async ({ to, subject, html }) => {
    try {
        // Check if required environment variables are set
        if (!process.env.EMAIL || !process.env.PASSWORD) {
            console.error('Email configuration missing: EMAIL or PASSWORD environment variables not set');
            return false;
        }

        console.log('Creating email transporter...');
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        console.log('Sending email...');
        const info = await transporter.sendMail({
            from: `"Chat App 💬" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent successfully:', info.messageId);
        return info.rejected.length === 0;
    } catch (error) {
        console.error('Error sending email:', error.message);
        return false;
    }
}

export default sendEmails;
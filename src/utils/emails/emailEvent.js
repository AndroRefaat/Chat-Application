import { EventEmitter } from "events";
import sendEmails from "./sendEmail.js";
import { signup } from "./HTMLTemp.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on('sendEmail', async (email, otp, subject) => {
    try {
        console.log(`Attempting to send email to: ${email} with subject: ${subject}`);
        const isSent = await sendEmails({ to: email, subject, html: signup(otp) });

        if (isSent) {
            console.log(`Email sent successfully to: ${email}`);
        } else {
            console.error(`Failed to send email to: ${email}`);
        }
    } catch (error) {
        console.error('Error in email event handler:', error);
    }
});


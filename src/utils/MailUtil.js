const mailer = require("nodemailer");
require("dotenv").config();

/**
 * Common Transporter Logic
 */
const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * HTML Templates Generator
 */
const getTemplate = (type, data) => {
    const { name, role, resetLink } = data;

    const baseStyles = `
        <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                    <h1>E-Advertisement</h1>
                    <p>Promote • Discover • Grow</p>
                </div>
                <div style="padding:30px;">
    `;

    const footerStyles = `
                </div>
                <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px;">
                    © 2026 E-Advertisement Platform. All rights reserved.
                </div>
            </div>
        </div>
    `;

    if (type === "WELCOME") {
        return {
            subject: "🎉 Welcome to E-Advertisement Platform",
            html: `
                ${baseStyles}
                <h2>Hello ${name} 👋</h2>
                <p>Welcome to the <b>E-Advertisement Platform</b>. Your account has been successfully created.</p>
                <p><b>Your Role:</b> ${role}</p>
                <div style="text-align:center; margin:30px 0;">
                    <a href="http://localhost:5173/login" style="background:#2563eb; color:white; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">Login to Your Account</a>
                </div>
                ${footerStyles}
            `
        };
    }

    if (type === "RESET_PASSWORD") {
        return {
            subject: "🔐 Reset Your Password",
            html: `
                ${baseStyles}
                <h2>Password Reset Request</h2>
                <p>Hello ${name}, we received a request to reset your password. Click the button below to proceed. This link is valid for 15 minutes.</p>
                <div style="text-align:center; margin:30px 0;">
                    <a href="${resetLink}" style="background:#ef4444; color:white; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">Reset Password</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                ${footerStyles}
            `
        };
    }
};

/**
 * Universal Mail Sender
 * @param {string} email - Recipient Email
 * @param {string} type - 'WELCOME' or 'RESET_PASSWORD'
 * @param {object} data - { name, role, resetLink, etc }
 */
const mailSend = async (email, type, data) => {
    const template = getTemplate(type, data);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        html: template.html
    };

    try {
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        console.error("Mail Sending Error:", error);
        throw error;
    }
};

module.exports = mailSend;
const mailer = require("nodemailer")
require("dotenv").config()

const mailSend = async (email, name, role) => {
    const transpoter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Welcome to E-Advertisement Platform",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">

                <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                    <h1>E-Advertisement</h1>
                    <p>Promote • Discover • Grow</p>
                </div>

                <!-- Advertisement Image Card -->
                <div style="padding:20px;">
                    <img 
                    src="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=900&q=60"
                    alt="Digital Advertising"
                    style="width:100%; border-radius:8px;">
                </div>

                <div style="padding:30px;">
                    <h2>Hello ${name} 👋</h2>

                    <p>
                    Welcome to the <b>E-Advertisement Platform</b>.  
                    Your account has been successfully created.
                    </p>

                    <p>
                    <b>Your Role:</b> ${role}
                    </p>

                    <p>
                    Now you can start exploring advertisements, manage campaigns,
                    and connect with businesses.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                        <a href="http://localhost:5173/"
                        style="background:#2563eb;
                        color:white;
                        padding:12px 25px;
                        text-decoration:none;
                        border-radius:5px;
                        font-weight:bold;">
                        Login to Your Account
                        </a>
                    </div>

                    <p>
                    If you have any questions, feel free to contact our support team.
                    </p>

                    <p>
                    Best Regards,<br>
                    <b>E-Advertisement Team</b>
                    </p>
                </div>

                <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px;">
                    © 2026 E-Advertisement Platform. All rights reserved.
                </div>

            </div>
        </div>
        `
    }

    const mailResponse = await transpoter.sendMail(mailOptions)
    return mailResponse
}

module.exports = mailSend
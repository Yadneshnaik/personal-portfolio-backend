const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/", router);

// Log email credentials for debugging (optional - remove in production)
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Nodemailer Transporter
const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

contactEmail.verify((error) => {
    if (error) {
        console.log("Email Error:", error);
    } else {
        console.log("Email Server Ready to Send");
    }
});

// Contact Route
router.post("/contact", (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
        return res.status(400).json({ code: 400, status: "All fields are required." });
    }

    const name = `${firstName} ${lastName}`;
    const mail = {
        from: name,
        to: process.env.EMAIL_USER,
        subject: "Contact Form Submission - Portfolio",
        html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br>${message}</p>
        `,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            return res.status(500).json({ code: 500, status: "Failed to send message", error });
        }
        res.status(200).json({ code: 200, status: "Message Sent Successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

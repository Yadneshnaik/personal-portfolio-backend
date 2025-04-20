const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "naikyadnesh9@gmail.com",
        pass: "mood nyps zwkj cllm"
    },
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});

router.post("/contact", (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // Check for empty fields
    if (!firstName || !lastName || !email || !phone || !message) {
        return res.status(400).json({ code: 400, status: "All fields are required." });
    }

    const name = firstName + " " + lastName;

    const mail = {
        from: name,
        to: "naikyadnesh9@gmail.com",
        subject: "Contact Form Submission - Portfolio",
        html: `<p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Phone: ${phone}</p>
               <p>Message: ${message}</p>`,
    };

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.status(500).json({ code: 500, status: "Failed to send message", error });
        } else {
            res.status(200).json({ code: 200, status: "Message Sent" });
        }
    });
});

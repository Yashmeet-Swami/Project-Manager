// import sgMail from "@sendgrid/mail";

// import dotenv from "dotenv";
// dotenv.config();

// sgMail.setApiKey(process.env.SEND_GRID_API);

// const fromEmail = process.env.FROM_EMAIL;

// export const sendEmail = async (to, subject, html) => {
//     const msg = {
//         to,
//         from: `SkillHub <${fromEmail}>`,
//         subject,
//         html,
//     };

//     try {
//         const [response] = await sgMail.send(msg);
//         console.log("✅ Email sent successfully with status:", response.statusCode);
//         console.log("📨 Headers:", response.headers);
//         return true;
//     } catch (error) {
//         console.error("❌ SendGrid Error Response:", error?.response?.body || error.message);
//         return false;
//     }

// };

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASS?.trim(),
  },
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"TaskSync" <${process.env.EMAIL_USER?.trim()}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};


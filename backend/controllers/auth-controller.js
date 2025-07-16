import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";
const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;


        const decision = await aj.protect(req, { email });
        console.log("Arcjet decision", decision.isDenied());

        if (decision.isDenied()) {

            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid email address" }));

        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        //TODO: Send Email
        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: "email-verification" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await verification.create({
            userId: newUser._id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
        })


        // send email

        // const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        // const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
        // const emailSubject = "Verify your email";

        // const isEmailSent = await sendEmail(email , emailSubject,emailBody);

        // if(!isEmailSent){
        //     return res.status(500).json({
        //         message: "failed to send verification email",
        //     })
        // }

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
        const emailSubject = "Verify your email";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send verification email." });
        }


        res.status(201).json({
            message: "Verification email sent to your mail. Please check and verify your account."
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.body;
        const payload = jwt.verify(token , process.env.JWT_SECRET);

        if(!payload){
            return res.status(401).json({
                message: "Unauthorized"
            }); 
        }

        const {userId , purpose } = payload;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export { registerUser, loginUser , verifyEmail };
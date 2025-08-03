import User from "../models/user.js";
import bcrypt from "bcrypt";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (including photo via URL)
const updateUserProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile photo (using POST)
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Delete old photo if exists
        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Update user with new path
        const relativePath = `/uploads/profile-photos/${req.file.filename}`;
        user.profilePicture = relativePath;
        await user.save();

        res.json({ 
            success: true,
            profilePicture: relativePath, // Return relative path
            user // Return full user object
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) return res.status(403).json({ message: "Invalid password" });
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePhoto, 
  changePassword 
};
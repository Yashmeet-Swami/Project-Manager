import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type:String,
        required: true,
        select: false
    },
    name: {
        type:String,
        required: true,
        trim: true,
    },
     profilePicture: {
      type: String,
      default: '', // Stores path like "/uploads/profile-photos/filename.jpg"
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFAOtp: {
      type: String,
      select: false,
    },
    twoFAOtpExpires: {
      type: Date,
      select: false,
    },
    // ✅ New settings field
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
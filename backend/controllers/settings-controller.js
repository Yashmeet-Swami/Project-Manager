import User from "../models/user.js";
import AppError from "../libs/app-error.js";
import asyncHandler from "../libs/async-handler.js";

export const getSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("settings");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json(user.settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { notifications, newsletter, darkMode, language } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        "settings.notifications": notifications,
        "settings.newsletter": newsletter,
        "settings.darkMode": darkMode,
        "settings.language": language,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json(user.settings);
});

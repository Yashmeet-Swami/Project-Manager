import User from "../models/user.js";

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error });
  }
};

export const updateSettings = async (req, res) => {
  try {
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

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error });
  }
};

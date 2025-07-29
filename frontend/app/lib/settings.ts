import axios from "axios";

export const updatePreferences = async (data: {
  notifications: boolean;
  emailUpdates: boolean;
}) => {
  return axios.put("/settings", data);
};

export const deleteAccount = async () => {
  return axios.delete("/settings");
};

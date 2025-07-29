import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/fetch-util";

type PreferencesInput = {
  notifications: boolean;
  emailUpdates: boolean;
  theme: string;
};

export const useUpdatePreferencesMutation = () => {
  return useMutation({
    mutationFn: (data: PreferencesInput) =>
      postData("/settings", data),
  });
};

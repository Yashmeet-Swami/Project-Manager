import { fetchData, updateData, postData, postFormData } from "@/lib/fetch-util";
import type { ChangePasswordFormData, ProfileFormData } from "@/routes/user/profile";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const queryKey = ["user"];

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey,
    queryFn: () => fetchData<User>("/users/profile"),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileFormData) =>
      updateData("/users/profile", data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      updateData("/users/change-password", data),
  });
};



export const useUpdateProfilePhoto = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await postFormData("/users/profile/photo", formData);
      return response.data; // Make sure to return the actual response data
    },
  });
};
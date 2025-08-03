import { fetchData, postData } from "@/lib/fetch-util";
import type { SettingsResponse } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET: Fetch current settings
export function UseSettingsQuery() {
  return useQuery<SettingsResponse>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });
}

// PUT: Update settings
export const UseUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => postData("/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
};

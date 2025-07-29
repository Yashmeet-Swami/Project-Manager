import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfileQuery,
} from "@/hooks/use-user";
import { useAuth } from "@/provider/auth-context";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Loader,
  Loader2,
  Camera,
  User as UserIcon,
  Shield,
  Trash2,
  Edit3,
  Mail,
  Lock,
  Eye,
  Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password is required" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  profilePicture: z.string().optional(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { data: user, isPending } = useUserProfileQuery() as {
    data: User;
    isPending: boolean;
  };
  const { logout } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
    values: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const memberSinceYear = new Date(user?.createdAt).getFullYear();


  const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error,
  } = useChangePassword();

  const handlePasswordChange = (values: ChangePasswordFormData) => {
    changePassword(values, {
      onSuccess: () => {
        toast.success(
          "Password updated successfully. You will be logged out. Please login again."
        );
        form.reset();
        setTimeout(() => {
          logout();
          navigate("/sign-in");
        }, 3000);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.error || "Failed to update password";
        toast.error(errorMessage);
      },
    });
  };

  const handleProfileFormSubmit = (values: ProfileFormData) => {
    updateUserProfile(
      { name: values.name, profilePicture: values.profilePicture || "" },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.error || "Failed to update profile";
          toast.error(errorMessage);
        },
      }
    );
  };

  if (isPending)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with full-width background gradient */}
      <div className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
          <div className="flex items-center gap-4 mb-8">
            <BackButton />
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Main content - now full width with constrained inner content */}
      <div className="relative -mt-32 px-0 pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">


            {/* Left sidebar - Profile Summary - now takes appropriate space */}
            <div className="lg:w-1/3">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Avatar className="h-32 w-32 mx-auto ring-4 ring-white shadow-2xl">
                        <AvatarImage
                          src={profileForm.watch("profilePicture") || user?.profilePicture}
                          alt={user?.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                          <UserIcon className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                          <p className="text-sm font-medium text-gray-900">Member</p>
                          <p className="text-xs text-gray-600">Since {memberSinceYear}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                          <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                          <p className="text-sm font-medium text-gray-900">Verified</p>
                          <p className="text-xs text-gray-600">Account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right content - Forms - now takes more space */}
            <div className="lg:w-2/3 space-y-8">

              {/* Personal Information */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Update your personal details
                  </CardDescription>
                </div>
                <CardContent className="p-6">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 w-full">
  {/* Full Name Field */}
  <FormField
    control={profileForm.control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
        <FormControl>
          <Input
            {...field}
            className="border-2 border-gray-200 focus:border-indigo-400 rounded-lg h-12"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Email Address Field */}
  <FormItem>
    <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
    <FormControl>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          value={user?.email}
          disabled
          className="pl-10 border-2 border-gray-200 bg-gray-50 h-12 rounded-lg"
        />
      </div>
    </FormControl>
    <FormMessage />
    <p className="text-sm text-gray-500 mt-2">
      Contact support if you need to change your email
    </p>
  </FormItem>
</div>

                        

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                        >
                          {isUpdatingProfile ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>


              {/* Security */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Change your password and manage security settings
                  </CardDescription>
                </div>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handlePasswordChange)}
                      className="space-y-6"
                    >
                      {error && (
                        <Alert variant="destructive" className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <Input
                                    type="password"
                                    placeholder="Enter your current password"
                                    className="pl-10 border-2 border-gray-200 focus:border-emerald-400 rounded-lg h-12"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                      type="password"
                                      placeholder="Enter your new password"
                                      className="pl-10 border-2 border-gray-200 focus:border-emerald-400 rounded-lg h-12"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                      type="password"
                                      placeholder="Confirm your new password"
                                      className="pl-10 border-2 border-gray-200 focus:border-emerald-400 rounded-lg h-12"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating Password...
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Update Password
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    These actions are irreversible. Proceed with caution.
                  </CardDescription>
                </div>
                <CardContent className="p-6">
                  <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 rounded-full p-3">
                          <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">Delete Account</h3>
                          <p className="text-gray-600 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-3 rounded-lg font-medium shadow-lg"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
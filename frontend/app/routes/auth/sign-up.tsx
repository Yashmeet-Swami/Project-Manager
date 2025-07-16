import { signUpSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router"; // or react-router-dom if using web routing
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useSignUpMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

export type SignupFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {mutate , isPending} = useSignUpMutation();

  const handleOnSubmit = (values: SignupFormData) => {
    mutate(values , {
      onSuccess: () => {
          toast.success("Email Verification Required" ,{
            description: "please check your email for a verification link. If you dont see it , please check your spam folder.",
          });
          form.reset();
          navigate("/sign-in");
      },
      onError: (error : any) => {
          const errormsg = error.response?.data?.message || "An error occured";
          console.log(error);
          toast.error(errormsg);
      },
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md rounded-xl shadow-md border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Join us by creating a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-5"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-md transition-colors"
                disabled={isPending}>
                  {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;

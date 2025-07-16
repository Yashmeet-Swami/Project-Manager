import { signInSchema } from '@/lib/schema';
import { Button } from "@/components/ui/button";
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router"; // ✅ fixed
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

type SigninFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = (values: SigninFormData) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md rounded-xl shadow-md border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gmuted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-5"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">Email Address</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm text-gray-700">Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
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
              >
                Sign in
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;

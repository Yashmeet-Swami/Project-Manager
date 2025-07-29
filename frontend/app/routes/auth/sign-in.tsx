import { signInSchema } from '@/lib/schema';
import { Button } from "@/components/ui/button";
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
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
import { useLoginMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/provider/auth-context';
import Lottie from "lottie-react";
import loginAnimation from "@/assets/taskmanagement5.json";

type SigninFormData = z.infer<typeof signInSchema>;

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export function SignInParticles() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: "#f9fafb", // your bg color
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 80,
            density: { enable: true, area: 800 },
          },
          color: { value: "#a3a3a3" },
          shape: { type: "circle" },
          opacity: { value: 0.3 },
          size: { value: 3 },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outMode: "bounce",
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
}


const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (values: SigninFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        toast.success("Login Successful");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errormsg = error.response?.data?.message || "An error occurred";
        toast.error(errormsg);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <SignInParticles />
      {/* Background Gradient Blob */}
      <div className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-30 rounded-full blur-3xl animate-pulse z-0" />

      <div className="w-full max-w-3xl md:max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg md:h-[90vh] z-10">
        {/* Left Section - Branding */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">TaskSync</h2>
          </div>
          
          <div className="mt-10">
            <Lottie 
              animationData={loginAnimation} 
              loop 
              className="w-full max-w-xs mx-auto"
            />
            <h3 className="text-white text-xl font-semibold mt-8 text-center">
              Welcome to TaskSync
            </h3>
            <p className="text-blue-100 text-center mt-2">
              Organize your work and boost productivity
            </p>
          </div>
          
          <div className="text-blue-100 text-sm text-center">
            © {new Date().getFullYear()} TaskSync. All rights reserved.
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-3/5 bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex justify-end mb-6">
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Please enter your email and password</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@gmail.com"
                          className="h-12 rounded-lg border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:underline font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-12 rounded-lg border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    By login, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button variant="outline" className="h-12 rounded-lg border-gray-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-lg border-gray-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="#24292E" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-500">
              <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact support</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

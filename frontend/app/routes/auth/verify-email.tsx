import React from 'react'
import { useSearchParams } from 'react-router'
import { useState, useEffect } from 'react'
import { Link } from 'react-router';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();


  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setIsSuccess(false);
    } else {
      mutate({ token }, {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error : any) => {
          const errormsg = error.response?.data?.message || "An error occured";
          setIsSuccess(false);
          console.log(error);
          toast.error(errormsg);
        }
      });
    }
  }, [searchParams]);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>VerifyEmail</h1>
      <p className='text-sm text-gray-500'>Verifying your email...</p>

      <Card className='w-full max-w-md'>
        {/* <CardHeader>
          <Link to="/sign-in" className='flex items-center gap-2 text-sm'>
            {/* <Button>Sign In</Button> */}
        {/* <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Sign in
          </Link>
        </CardHeader> */}

        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 animate-spin text-gray-500" />
                <h3 className='text-lg font-semibold'>Verifying email...</h3>
                <p className='text-sm text-gray-500'>Please wait while we verify your email.</p>
              </>

            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully.
                </p>
                <Link to="/sign-in" className=' text-sm text-blue-500 mt-6'>
                  <Button variant='outline'> Back to Sign in</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500" />
                <h3 className="text-lg font-semibold">Email Verification Failed</h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again.
                </p>
                <Link to="/sign-in" className="text-sm text-blue-500 mt-6">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail

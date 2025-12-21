import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp routing="path" path="/auth/signup" signInUrl="/auth/signin" forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard" />  />
    </div>
  );
};

export default SignUpPage;

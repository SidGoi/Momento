import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex relative items-center justify-center min-h-screen">
         <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src="https://res.cloudinary.com/dxoxlurnt/video/upload/v1766266085/web_utfj0o.mp4"
        autoPlay loop muted playsInline
      />
      <SignUp  routing="path" path="/auth/signup" signInUrl="/auth/signin" forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"   appearance={{
          baseTheme: dark,
        }} />
    </div>
  );
};

export default SignUpPage;

import { SignIn } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";

const SignInPage = () => {
  return (
    <div className="flex relative items-center justify-center min-h-screen">
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src="https://res.cloudinary.com/dxoxlurnt/video/upload/v1766266085/web_utfj0o.mp4"
        autoPlay loop muted playsInline
      />
      <SignIn
        appearance={{
          baseTheme: dark,
        }}
        routing="path"
        path="/auth/signin"
        signUpUrl="/auth/signup"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard" />
    </div>
  );
};

export default SignInPage;

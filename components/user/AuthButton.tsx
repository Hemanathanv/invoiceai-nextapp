// Name: V.Hemanathan
// Describe: This component is used to display the authentication buttons for login, sign up, reset password, and forgot password. It uses the server action declared in the actions/auth.ts file.
// Framework: Next.js -15.3.2 

import React from "react";

const AuthButton = ({
  type,
  loading,
}: {
  type: "login" | "Sign up" | "Reset Password" | "Forgot Password";
  loading: boolean;
}) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading ? "bg-gray-600" : "bg-blue-600"
      } rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
    >
      {loading ? "Loading..." : type}
    </button>
  );
};

export default AuthButton;

// Name: V.Hemanathan
// Describe: login component. Form for login.(components\user\LoginForm.tsx)
// Framework: Next.js -15.3.2 

import LoginForm from "@/components/user/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px] h-[600px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Sign in
          </h1>
          <LoginForm />
          <div className="mt-2 flex items-center">
            <h1>{`Don't have an account?`}</h1>
            <Link className="font-bold ml-2" href="/register">
              Sign Up
            </Link>
          </div>
          <div className="mt-2 flex items-center">
            <h1>{`Forgot your password?`}</h1>
            <Link className="font-bold ml-2" href="/forgot-password">
              Reset Password
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

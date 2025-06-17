// Name: V.Hemanathan
// Describe: Forget password component. It will send a reset password link to the user's email.(components\user\ForgotPassword.tsx)
// Framework: Next.js -15.3.2 

import ForgotPassword from "@/components/user/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Forgot Password
          </h1>
          <ForgotPassword />
        </section>
      </div>
    </>
  );
}

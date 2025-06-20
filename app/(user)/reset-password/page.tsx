// Name: V.Hemanathan
// Describe: Reset password component. It will reset the password.(components\user\ResetPassword.tsx)
// Framework: Next.js -15.3.2 

import ResetPassword from "@/components/user/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Reset Password
          </h1>
          <ResetPassword />
        </section>
      </div>
    </>
  );
}

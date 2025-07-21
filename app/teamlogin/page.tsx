// Name: V.Hemanathan
// Describe: Team joining component. Form for team join.(components\user\TeamLoginForm.tsx)
// Framework: Next.js -15.3.2 

import TeamLoginForm from "@/components/user/TeamLoginForm";
import Link from "next/link";

export default function TeamLogin() {
  return (
    <>
      <div className="w-full flex mt-20 justify-center">
        <section className="flex flex-col w-[400px] h-[600px]">
          <h1 className="text-3xl w-full text-center font-bold mb-6">
            Join Team
          </h1>
          <TeamLoginForm />
          <div className="mt-2 flex items-center">
            <h1>{`Do you want to register as a team?`}</h1>
            <Link className="font-bold ml-2" href="/register">
              Contact Sales
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

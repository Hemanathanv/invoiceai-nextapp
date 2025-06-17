// Name: V.Hemanathan
// Describe: This component is used to logout the user. It uses the server action declared in the actions/auth.ts file.
// Framework: Next.js -15.3.2 


"use client";

import { signOut } from "@/actions/auth";
import React, { useState } from "react";
import { LogOut } from "lucide-react";

const Logout: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogout} className="w-full">
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-red-600 hover:bg-red-50 rounded text-left"
      >
        <LogOut className="w-4 h-4" />
        {loading ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
};

export default Logout;

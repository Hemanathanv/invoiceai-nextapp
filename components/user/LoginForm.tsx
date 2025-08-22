"use client";
import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth";

type SignInResult = { status: "success"; user?: unknown } | { status: string; user: null };

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // controlled inputs
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // basic local validation (UX)
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);

    try {
      const result = (await signIn(formData)) as SignInResult;
      if (result.status === "success") {
        router.refresh();
        router.push("/dashboard");
      } else {
        setError(result.status ?? "Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err ?? "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // disable when loading or required fields empty
  const isSubmitDisabled = loading || !email.trim() || !password;

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4">
          <AuthButton type="login" loading={loading} disabled={isSubmitDisabled} />
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;

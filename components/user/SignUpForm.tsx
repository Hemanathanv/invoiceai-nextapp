"use client";
import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";
import { signUp, checkAvailability } from "@/actions/auth";

type SignUpResult =
  | { status: "success"; user: Record<string, unknown> }
  | { status: string; user: null };

type CheckAvailabilityResult = {
  usernameExists?: boolean;
  emailExists?: boolean;
  error?: string;
};

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // controlled inputs so we can run checks
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // availability / checking state
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // basic email validation to avoid unnecessary checks
  const basicEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleUsernameBlur = async (): Promise<void> => {
    const v = username.trim();
    if (!v) {
      setUsernameExists(null);
      return;
    }
    setCheckingUsername(true);
    setUsernameExists(null);

    try {
      const res = (await checkAvailability({ username: v })) as CheckAvailabilityResult;
      setUsernameExists(Boolean(res.usernameExists));
    } catch (err) {
      // don't block UX on server errors — fallback to null
      if (err instanceof Error)setUsernameExists(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleEmailBlur = async (): Promise<void> => {
    const v = email.trim().toLowerCase();
    if (!v || !basicEmailValid(v)) {
      setEmailExists(null);
      return;
    }
    setCheckingEmail(true);
    setEmailExists(null);

    try {
      const res = (await checkAvailability({ email: v })) as CheckAvailabilityResult;
      setEmailExists(Boolean(res.emailExists));
    } catch (err) {
      if (err instanceof Error){
      setEmailExists(null)};
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // UX pre-check: block if client already knows a conflict
    if (usernameExists) {
      setError("Username already taken. Choose a different one.");
      setLoading(false);
      return;
    }
    if (emailExists) {
      setError("Email already registered. Use another email or login.");
      setLoading(false);
      return;
    }

    // build FormData for your existing server action
    const formData = new FormData();
    formData.append("username", username.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("password", password);

    try {
      const result = (await signUp(formData)) as SignUpResult;
      if (result.status === "success") {
        setSuccess("Successfully signed up, please login");
        router.push("/login");
      } else {
        // server message (server re-checks again)
        setError(result.status ?? "Signup failed");
      }
    } catch (err) {
      if (err instanceof Error){
      setError(err?.message ?? "Signup failed")};
    } finally {
      setLoading(false);
    }
  };

  const anyChecking = checkingUsername || checkingEmail;
  // console.log(usernameExists)
  const isSubmitDisabled =
    loading || anyChecking || usernameExists === true || emailExists === true || !username || !email || !password;

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-200">Username</label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
          <div className="mt-1 text-sm" aria-live="polite">
            {checkingUsername && <span className="text-gray-400">Checking username…</span>}
            {!checkingUsername && usernameExists === true && <span className="text-red-500">username already taken.Enter another name</span>}
            {!checkingUsername && usernameExists === false && <span className="text-green-500">Username available</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            disabled={usernameExists == true}
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
          <div className="mt-1 text-sm" aria-live="polite">
            {checkingEmail && <span className="text-gray-400">Checking email…</span>}
            {!checkingEmail && emailExists === true && <span className="text-red-500">Email already registered</span>}
            {!checkingEmail && emailExists === false && <span className="text-green-500">Email available</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={emailExists == true || usernameExists == true }
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>

        <div className="mt-4">
          {/* AuthButton must accept disabled prop; if it doesn't, wrap around a <button> */}
          <AuthButton type="Sign up" loading={loading || anyChecking} disabled = {isSubmitDisabled || !username} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default SignUpForm;

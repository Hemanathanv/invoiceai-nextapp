"use client";
import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { useRouter } from "next/navigation";
import { teamsignup, checkAvailability } from "@/actions/auth";

type TeamSignupResult = { status: "success"; user?: unknown } | { status: string; user?: null };
type CheckAvailabilityResult = { usernameExists?: boolean; emailExists?: boolean; error?: string };

const basicEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const TeamLoginForm: React.FC = () => {
  const router = useRouter();

  // controlled inputs
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");

  // availability / checking state
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  // submission state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameBlur = async (): Promise<void> => {
    const v = username.trim();
    if (!v) {
      setUsernameExists(null);
      return;
    }
    setCheckingUsername(true);
    setUsernameExists(null);
    setError(null);
    try {
      const res = (await checkAvailability({ username: v })) as CheckAvailabilityResult;
      if (res.error) {
        setUsernameExists(null);
      } else {
        setUsernameExists(Boolean(res.usernameExists));
      }
    } catch (err: unknown) {
      setUsernameExists(null);
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
    setError(null);
    try {
      const res = (await checkAvailability({ email: v })) as CheckAvailabilityResult;
      if (res.error) {
        setEmailExists(null);
      } else {
        setEmailExists(Boolean(res.emailExists));
      }
    } catch (err: unknown) {
      setEmailExists(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    // basic validation
    if (!username.trim() || !email.trim() || !password || !orgName.trim() || !orgId.trim()) {
      setError("Please fill all fields.");
      return;
    }
    if (!basicEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ensure availability was checked; if unknown, check now
    if (usernameExists === null) {
      setCheckingUsername(true);
      try {
        const res = (await checkAvailability({ username: username.trim() })) as CheckAvailabilityResult;
        setUsernameExists(Boolean(res.usernameExists));
      } catch {
        setUsernameExists(null);
      } finally {
        setCheckingUsername(false);
      }
    }
    if (emailExists === null) {
      setCheckingEmail(true);
      try {
        const res = (await checkAvailability({ email: email.trim().toLowerCase() })) as CheckAvailabilityResult;
        setEmailExists(Boolean(res.emailExists));
      } catch {
        setEmailExists(null);
      } finally {
        setCheckingEmail(false);
      }
    }

    // block submit if username/email taken
    if (usernameExists === true) {
      setError("Username already taken. Choose a different one.");
      return;
    }
    if (emailExists === true) {
      setError("Email already registered. Use a different email or login.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("org-name", orgName.trim());
      formData.append("org-id", orgId.trim());

      const result = (await teamsignup(formData)) as TeamSignupResult;

      if (result.status === "success") {
        router.refresh();
        router.push("/");
      } else {
        setError(result.status ?? "Teams signup failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err ?? "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  const anyChecking = checkingUsername || checkingEmail;
  const isSubmitDisabled =
    loading ||
    anyChecking ||
    usernameExists === true ||
    emailExists === true ||
    !username.trim() ||
    !email.trim() ||
    !password ||
    !orgName.trim() ||
    !orgId.trim();

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameExists(null);
              setError(null);
            }}
            onBlur={handleUsernameBlur}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="username"
            aria-describedby="username-status"
          />
          <div id="username-status" className="mt-1 text-sm" aria-live="polite">
            {checkingUsername && <span className="text-gray-400">Checking username…</span>}
            {!checkingUsername && usernameExists === true && (
              <span className="text-red-500">Username already taken — choose another.</span>
            )}
            {!checkingUsername && usernameExists === false && (
              <span className="text-green-500">Username available</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailExists(null);
              setError(null);
            }}
            onBlur={handleEmailBlur}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="email"
            aria-describedby="email-status"
            disabled={usernameExists === true}
          />
          <div id="email-status" className="mt-1 text-sm" aria-live="polite">
            {checkingEmail && <span className="text-gray-400">Checking email…</span>}
            {!checkingEmail && emailExists === true && <span className="text-red-500">Email already registered</span>}
            {!checkingEmail && emailExists === false && <span className="text-green-500">Email available</span>}
          </div>
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
            disabled={emailExists === true || usernameExists === true}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Organisation Name</label>
          <input
            type="text"
            placeholder="Organisation Name"
            name="org-name"
            id="org-name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Organisation ID</label>
          <input
            type="text"
            placeholder="Organisation ID"
            name="org-id"
            id="org-id"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>

        <div className="mt-4">
          <AuthButton type="Join Team" loading={loading || anyChecking} disabled={isSubmitDisabled} />
        </div>

        {error && <p className="text-red-500 mt-2" role="alert">{error}</p>}
      </form>
    </div>
  );
};

export default TeamLoginForm;

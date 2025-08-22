"use client";
import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { forgotPassword, checkAvailability } from "@/actions/auth";

type ForgotPasswordResult = { status: "success" } | { status: string };
type CheckAvailabilityResult = { emailExists?: boolean; usernameExists?: boolean; error?: string };

const basicEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // availability/checking state
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  // Called on blur to inform the user if the email exists or not
  const handleEmailBlur = async (): Promise<void> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !basicEmailValid(normalized)) {
      setEmailExists(null);
      return;
    }

    setCheckingEmail(true);
    setEmailExists(null);
    setError(null);
    setMessage(null);

    try {
      const res = (await checkAvailability({ email: normalized })) as CheckAvailabilityResult;
      // If server returned an error, treat as unknown (don't block UX permanently)
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
    setMessage(null);

    const normalized = email.trim().toLowerCase();
    if (!normalized || !basicEmailValid(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    // If we haven't checked emailExists yet, check now (server-side source of truth)
    if (emailExists === null) {
      setCheckingEmail(true);
      try {
        const res = (await checkAvailability({ email: normalized })) as CheckAvailabilityResult;
        if (res.error) {
          // allow proceeding to request reset even if check failed (optional),
          // but we'll treat unknown as "not found" for better UX — change if you prefer
          setEmailExists(Boolean(res.emailExists));
        } else {
          setEmailExists(Boolean(res.emailExists));
        }
      } catch (err: unknown) {
        setEmailExists(null);
      } finally {
        setCheckingEmail(false);
      }
    }

    // If check says user doesn't exist, show tailored message and don't call forgotPassword
    if (emailExists === false) {
      setError("No account found for this email.");
      return;
    }

    // Otherwise proceed to request password reset
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", normalized);

      const result = (await forgotPassword(formData)) as ForgotPasswordResult;

      if (result.status === "success") {
        setMessage("Password reset email sent. Check your inbox.");
        // Optionally clear email or keep it — up to you
      } else {
        setError(result.status ?? "Failed to request password reset.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err ?? "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || checkingEmail || !email.trim() || !basicEmailValid(email) || emailExists === false;

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // reset availability state when user types again
              setEmailExists(null);
              setError(null);
              setMessage(null);
            }}
            onBlur={handleEmailBlur}
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            autoComplete="email"
            aria-describedby="forgot-email-status"
          />

          <div id="forgot-email-status" className="mt-1 text-sm" aria-live="polite">
            {!email && <span className="text-gray-400">Enter your account email to get a reset link.</span>}
            {email && !basicEmailValid(email) && <span className="text-yellow-500">Enter a valid email address.</span>}
            {checkingEmail && basicEmailValid(email) && <span className="text-gray-400">Checking account…</span>}
            {!checkingEmail && emailExists === false && <span className="text-red-500">No account found for this email. Please signup</span>}
            {!checkingEmail && emailExists === true && <span className="text-green-500">Account found — we'll send a reset link.</span>}
          </div>
        </div>

        <div className="mt-4">
          <AuthButton type="Forgot Password" loading={loading} disabled={isSubmitDisabled} />
        </div>

        {error && <p className="text-red-500 mt-2" role="alert">{error}</p>}
        {message && <p className="text-green-500 mt-2" role="status">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;

"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import EmailIcon from "./emailIcon";

// Enhanced OTP Input Component
function OTPInput({
  length = 6,
  onComplete,
  reset,
}: {
  length: number;
  onComplete: (code: string) => void;
  reset?: boolean;
}) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset OTP when reset prop changes
  useEffect(() => {
    if (reset) {
      setOtp(Array(length).fill(""));
      // small timeout to ensure DOM ready
      setTimeout(() => inputRefs.current[0]?.focus(), 20);
    }
  }, [reset, length]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all inputs are non-empty
    if (newOtp.every((d) => d !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Backspace - go to previous input
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow keys navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only paste if it's all numbers
    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.slice(0, length).split("");
      const newOtp = [...otp];

      pastedArray.forEach((char, idx) => {
        if (idx < length) {
          newOtp[idx] = char;
        }
      });

      setOtp(newOtp);

      // Focus last filled input or last input (use timeout to ensure DOM update)
      const focusIndex = Math.min(pastedArray.length - 1, length - 1);
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 20);

      // Call onComplete if fully filled
      if (newOtp.every((d) => d !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            // assign but return void — correct callback ref pattern
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}

export default function Authentication() {
  const router = useRouter();

  // Clerk hooks
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  // UI state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [currentMode, setCurrentMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resetOtp, setResetOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Prevent double verification
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Helper: validate & trim email
  const trimAndValidateEmail = (raw: string) => {
    const trimmed = raw.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    return { trimmed, ok };
  };

  // -----------------------------------------------------
  // SEND OTP (Silent Auto Mode)
  // -----------------------------------------------------
  const handleSendOtp = async () => {
    if (!signInLoaded || !signUpLoaded) {
      setError("Auth not ready. Please try again.");
      return;
    }

    const { trimmed, ok } = trimAndValidateEmail(email);
    if (!trimmed || !ok) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    setOtp("");
    setResetOtp(false);
    setEmail(trimmed); // normalize

    try {
      // Try SIGN-IN first
      await signIn?.create({
        identifier: trimmed,
        strategy: "email_code",
      });

      setCurrentMode("signin");
      setStep("otp");
    } catch (signInError: any) {
      const errorCode = signInError?.errors?.[0]?.code;
      const errorMessage = signInError?.errors?.[0]?.message || "";

      // detect not found (various possible codes/messages)
      if (
        errorCode === "form_identifier_not_found" ||
        errorCode === "user_not_found" ||
        errorMessage.toLowerCase().includes("not found")
      ) {
        // AUTO SIGNUP
        try {
          await signUp?.create({
            emailAddress: trimmed,
          });

          await signUp?.prepareEmailAddressVerification({
            strategy: "email_code",
          });

          setCurrentMode("signup");
          setStep("otp");
        } catch (signUpError: any) {
          console.error("Signup error:", signUpError);
          setError(
            signUpError?.errors?.[0]?.message || "Unable to create account."
          );
        }
      } else {
        setError(errorMessage || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // VERIFY OTP (login OR signup)
  // -----------------------------------------------------
  const handleVerifyOtp = async () => {
    if (
      isVerifying ||
      !signInLoaded ||
      !signUpLoaded ||
      !otp ||
      otp.length !== 6
    ) {
      if (!isVerifying && otp.length !== 6) {
        setError("Please enter the complete 6-digit code");
      }
      return;
    }

    setIsVerifying(true);
    setLoading(true);
    setError("");

    try {
      if (currentMode === "signin") {
        // EXISTING USER LOGIN
        const result = await signIn?.attemptFirstFactor({
          strategy: "email_code",
          code: otp,
        });

        if (result?.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
          return;
        }
      } else {
        // NEW USER SIGNUP
        const result = await signUp?.attemptEmailAddressVerification({
          code: otp,
        });

        if (result?.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/pricing");
          return;
        }
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMessage = err?.errors?.[0]?.message || "";
      const errorCode = err?.errors?.[0]?.code;

      // Already verified / used code
      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("verified") ||
        errorCode === "verification_already_verified"
      ) {
        setError("This code has already been used. Please request a new code.");
        // Reset back to email after short notice
        setTimeout(() => {
          setStep("email");
          setOtp("");
          setError("");
          setResetOtp(false);
          setIsVerifying(false);
        }, 1500);
        return;
      }

      setError(errorMessage || "Invalid code. Please try again.");
      setOtp("");
      setResetOtp(true);
      setTimeout(() => setResetOtp(false), 100);
    } finally {
      setLoading(false);
      setIsVerifying(false);
    }
  };

  // -----------------------------------------------------
  // RESEND OTP
  // -----------------------------------------------------
  const handleResendOtp = async () => {
    if (!signInLoaded || !signUpLoaded) return;

    setResending(true);
    setError("");
    setOtp("");
    setResetOtp(true);

    try {
      if (currentMode === "signin") {
        await signIn?.create({
          identifier: email,
          strategy: "email_code",
        });
      } else {
        // for signup, request a new verification email (if supported)
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      }

      // small visual delay then clear reset flag
      setTimeout(() => setResetOtp(false), 150);
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to resend code. Please try again.");
      // fallback to email step if things are inconsistent
      setTimeout(() => {
        setStep("email");
        setOtp("");
        setError("");
        setResetOtp(false);
      }, 1000);
    } finally {
      setResending(false);
    }
  };

  // -----------------------------------------------------
  // CHANGE EMAIL - Go back to email step
  // -----------------------------------------------------
  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setResetOtp(false);
    setIsVerifying(false);
  };

  // Handle Enter key press (use onKeyDown on inputs)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && !isVerifying) {
      if (step === "email") {
        handleSendOtp();
      } else if (otp.length === 6) {
        handleVerifyOtp();
      }
    }
  };

  // Auto-verify when OTP is complete - small debounce
  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isVerifying && !loading) {
      const timer = setTimeout(() => {
        handleVerifyOtp();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp]); // only depend on otp to avoid repeated handlers

  // --- Forgot Email Modal (must be returned) ---
  if (showForgotModal) {
    return (
      <div className="fixed inset-0 bg-white/10 bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl relative">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Need Help?</h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Can't remember the email you used? No worries — our support team can
            help you recover your account. Just contact us and we’ll verify your
            identity.
          </p>

          <a
            href="mailto:worklancehire@gmail.com"
            className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition">
            Contact Support
          </a>

          <button
            onClick={() => setShowForgotModal(false)}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 underline">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="flex h-screen gap-10 items-center justify-between p-2">
        {/* LEFT IMAGE */}
        <div className="relative w-[40%] h-[98vh] bg-[#f0eae3] rounded-[2rem] overflow-hidden hidden md:block lg:block">
          <Image
            src="/worklanceauthimg.png"
            alt="login-pic"
            fill
            className="object-cover rounded-xl"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="sm:w-full md:w-[50%] lg:w-[50%] w-full flex flex-col justify-center md:pl-8 md:pr-24 px-4 -mt-8">
          <h1 className="font-bold text-[#000] text-[28px] md:text-[62px] mb-4 md:mb-8">
            {step === "email"
              ? "Sign In"
              : currentMode === "signin"
              ? "Welcome Back"
              : "Welcome"}
          </h1>

          {error && (
            <div className="text-red-600 text-sm font-semibold mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <p className="mb-6 font-semibold text-gray-600">
            {step === "email"
              ? "Enter your email to continue"
              : `We sent a 6-digit code to ${email}`}
          </p>
          <div className="space-y-4">
            {/* STEP 1 — EMAIL */}
            {step === "email" && (
              <>
                <div className="flex items-center gap-3 border-2 rounded-xl border-[#efefef] bg-[#efefef] px-4 py-4 hover:border-blue-600 hover:bg-white transition focus-within:border-blue-600 focus-within:bg-white">
                  <EmailIcon />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    className="w-full bg-transparent outline-none placeholder-gray-500 text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim()}
                  className="bg-blue-600 text-white w-full py-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Sending..." : "Continue"}
                </button>
              </>
            )}

            {/* STEP 2 — OTP */}
            {step === "otp" && (
              <>
                <div className="py-4">
                  <OTPInput
                    length={6}
                    onComplete={(code) => setOtp(code)}
                    reset={resetOtp}
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6 || isVerifying}
                  className="w-full py-4 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading || isVerifying ? "Verifying..." : "Verify Code"}
                </button>

                <div className="flex gap-3 pt-2">
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex gap-3 w-full flex-wrap">
                      <button
                        onClick={handleResendOtp}
                        disabled={resending || loading || isVerifying}
                        className="flex-1 text-sm font-semibold text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        {resending ? "Resending..." : "Resend Code"}
                      </button>

                      <button
                        onClick={handleChangeEmail}
                        disabled={loading || resending || isVerifying}
                        className="flex-1 text-sm font-semibold text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Change Email
                      </button>
                    </div>

                    {/* NEW - Forgot email button */}
                    <button
                      onClick={() => setShowForgotModal(true)}
                      className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition underline mx-auto">
                      Forgot the email you used?
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-8">
            By continuing, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-gray-700">
              Terms of Use
            </span>
            ,{" "}
            <span className="underline cursor-pointer hover:text-gray-700">
              Privacy Notice
            </span>
            , and{" "}
            <span className="underline cursor-pointer hover:text-gray-700">
              Cookie Notice
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

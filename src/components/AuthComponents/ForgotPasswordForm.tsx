// "use client";

// import { cn } from "@/lib/utils";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useState } from "react";

// export function ForgotPasswordForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"div">) {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const supabase = createClient();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/auth/update-password`,
//       });
//       if (error) throw error;
//       setSuccess(true);
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("w-full px-4 sm:px-10 font-[Century-Old-Style]", className)} {...props}>
//       <h1 className="text-xs font-light mb-4 tracking-wide sm:py-20">
//         {success ? "CHECK YOUR EMAIL" : "RESET PASSWORD"}
//       </h1>
//       <div className="mb-8">
//         {success ? (
//           <div className="flex flex-col w-full sm:w-120 gap-3 mb-8">
//             <div className="border border-stone-700 p-4 sm:p-8 text-center">
//               <h2 className="text-base sm:text-lg font-medium mb-4 text-stone-800">
//                 Password reset instructions sent
//               </h2>
//               <p className="text-xs sm:text-sm text-stone-600 mb-6">
//                 If you registered using your email and password, you will receive
//                 a password reset email.
//               </p>
//               <Link
//                 href="/auth/login"
//                 className="inline-block w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors text-center text-sm sm:text-base"
//               >
//                 BACK TO LOGIN
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleForgotPassword}>
//             <div className="flex flex-col w-full sm:w-120 gap-3 mb-8">
//               <div className="border border-stone-700 p-4 sm:p-8">
//                 <Label
//                   htmlFor="email"
//                   className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
//                 >
//                   EMAIL ADDRESS
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
//                   placeholder="johndoe@example.com"
//                   required
//                 />
//               </div>

//               <div className="mb-8 w-full">
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base"
//                 >
//                   {isLoading ? "Sending..." : "SEND RESET EMAIL"}
//                 </Button>
//               </div>
//             </div>

//             {error && (
//               <div className="mb-6">
//                 <p className="text-red-500 text-sm">{error}</p>
//               </div>
//             )}

//             <div className="">
//               <p className="text-sm text-stone-500">
//                 Remember your password?{" "}
//                 <Link
//                   href="/auth/login"
//                   className="text-black hover:underline font-medium"
//                 >
//                   Login
//                 </Link>
//               </p>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

const baseInput =
  "border-none bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base";

function Field({
  id,
  label,
  children,
  warning,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  warning?: string;
}) {
  return (
    <div className="border border-stone-700 p-4 sm:p-8 relative">
      <Label
        htmlFor={id}
        className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
      >
        {label}
      </Label>

      {children}

      {warning && (
        <p
          className="absolute left-4 text-[#50462D] text-xs pl-0 bottom-1 sm:pl-4 sm:bottom-4"
          aria-live="polite"
        >
          {warning}
        </p>
      )}
    </div>
  );
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const emailWarning =
    email.length === 0
      ? ""
      : isValidEmail
        ? ""
        : "Please enter a valid email address.";


  // SSR-safe origin for redirect
  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/auth/update-password`;
  }, []);

  const handleForgotPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValidEmail || isLoading) return; // guard
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo, // Supabase will ignore undefined; we guard for SSR anyway
        });
        if (error) throw error;
        setSuccess(true);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        // Optional friendlier mapping
        const friendly =
          /invalid/i.test(message)
            ? "That email address looks invalid."
            : /rate/i.test(message)
              ? "Too many requests. Please try again in a minute."
              : message;
        setError(friendly);
      } finally {
        setIsLoading(false);
      }
    },
    [email, isValidEmail, isLoading, redirectTo]
  );

  const submitDisabled = isLoading || !isValidEmail;

  return (
    <div className={cn("w-full px-4 sm:px-10 md:pt-0 pt-10 font-[Century-Old-Style] ", className)} {...props}>
      <h1 className="text-[1rem] font-light mb-4 tracking-wide md:py-20 small-text">
        {success ? "CHECK YOUR EMAIL" : "RESET PASSWORD"}
      </h1>

      <div className="mb-8">
        {success ? (
          <div className="flex flex-col w-full sm:w-120 gap-3 mb-8">
            <div
              className="border border-stone-700 p-4 sm:p-8 text-center"
              role="status"
              aria-live="polite"
            >
              <h2 className="text-base sm:text-lg font-medium mb-4 text-stone-800">
                Password reset instructions sent
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mb-6">
                If you registered using your email and password, you&apos;ll receive a
                password reset email shortly. Check your spam folder if you don&apos;t
                see it.
              </p>
              <Link
                href="/auth/login"
                className="w-full rounded-none px-4 sm:px-12 py-2 sm:py-3 bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base disabled:opacity-60"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} noValidate>
            <div className="flex flex-col w-full sm:w-120 gap-3 mb-8">
              <Field id="email" label="EMAIL ADDRESS" warning={emailWarning}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!isValidEmail && email.length > 0}
                  aria-describedby="email-hint"
                  className={cn(
                    baseInput,
                    "border-0 focus:border-b border-stone-500 focus:border-stone-600"
                  )}
                  placeholder="mary.oliver@example.com"
                  autoComplete="email"
                  required
                />
                {/* Provide the described element to satisfy aria-describedby */}
                <p id="email-hint" className="sr-only">
                  Enter the email associated with your account to receive a reset link.
                </p>
              </Field>


              <div className="mb-8 w-full">
                <Button
                  type="submit"
                  disabled={submitDisabled}
                  className="w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base disabled:opacity-60 rounded-[0.25rem]"
                >
                  {isLoading ? "Sending..." : "SEND RESET EMAIL"}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6" role="alert" aria-live="assertive">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="sm:text-left">
              <Link href="/auth/login">
                <p className="text-sm text-stone-500 hover:text-stone-700">
                  Remember your password?{" "}
                  <span className="text-black font-medium">Log In</span>
                </p>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div >
  );
}



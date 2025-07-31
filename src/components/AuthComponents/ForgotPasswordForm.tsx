"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full px-10 font-century", className)} {...props}>
      <h1 className="text-xs font-light mb-4 tracking-wide py-20">
        {success ? "CHECK YOUR EMAIL" : "RESET PASSWORD"}
      </h1>
      <div className="mb-8">
        {success ? (
          <div className="flex flex-col w-120 gap-3 mb-8">
            <div className="border border-stone-700 p-8 text-center">
              <h2 className="text-lg font-medium mb-4 text-stone-800">
                Password reset instructions sent
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                If you registered using your email and password, you will receive
                a password reset email.
              </p>
              <Link
                href="/auth/login"
                className="inline-block w-full rounded-none px-12 py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors text-center"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col w-120 gap-3 mb-8">
              <div className="border border-stone-700 p-8">
                <Label
                  htmlFor="email"
                  className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
                >
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600  focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>

              <div className="mb-8 w-full">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-none px-12 py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors"
                >
                  {isLoading ? "Sending..." : "SEND RESET EMAIL"}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <div className="">
              <p className="text-sm text-stone-500">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-black hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

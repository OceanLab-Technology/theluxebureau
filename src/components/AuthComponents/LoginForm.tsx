"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMainStore } from "@/store/mainStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/products");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailWarning, setEmailWarning] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  const { handleLoginSuccess } = useMainStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      if (redirect) {
        setRedirectTo(redirect);
      }
    }
  }, []);

  // Email validation
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailWarning(emailRegex.test(value) ? "" : "Please enter a valid email address.");
  };

  // Phone validation (if you have a phone input, otherwise this will not show)
  const validatePhone = (value: string) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    setPhoneWarning(value && !phoneRegex.test(value) ? "Please enter a valid phone number." : "");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      await handleLoginSuccess();
      window.location.replace(redirectTo);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full px-4 sm:px-10 font-century md:pt-0 pt-20",
        className
      )}
      {...props}
    >
      <h1 className="text-[1rem] font-light mb-4 tracking-wide md:py-20 small-text">
        LOG IN
      </h1>
      <div className="mb-8">
        <form onSubmit={handleLogin}>
          <div className="flex flex-col w-full md:w-[600px] gap-3 mb-8">
            <div className="border border-stone-700 p-4 sm:p-8">
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className="border-none bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="mary.oliver@example.com"
                required
              />
              {emailWarning && (
                <p className="text-[#50462D] text-xs mt-2">{emailWarning}</p>
              )}
            </div>

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="password"
                className=" text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                  placeholder="*************************"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  tabIndex={-1}
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-8 w-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="sm:text-left">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-stone-500 hover:text-stone-700 underline-offset-4"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="sm:text-left">
            <p className="text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-black font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

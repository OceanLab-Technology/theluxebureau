"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("w-full px-4 sm:px-10 font-century", className)}
      {...props}
    >
      <h1 className="text-xs font-light mb-4 tracking-wide sm:py-20">LOGIN</h1>
      <div className="mb-8">
        <form onSubmit={handleLogin}>
          <div className="flex flex-col w-full sm:w-[400px] gap-3 mb-8">
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
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="johndoe@example.com"
                required
              />
            </div>

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="password"
                className=" text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="*************************"
                required
              />
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
              className="text-sm text-stone-500 hover:text-stone-700 underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="sm:text-left">
            <p className="text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-black hover:underline font-medium"
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

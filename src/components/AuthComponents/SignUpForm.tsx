"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            shipping_address: shippingAddress,
            phone_number: phoneNumber,
          },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full px-4 sm:px-10 md:pt-0 pt-10 font-century", className)} {...props}>
      <h1 className="text-[1rem] font-light mb-4 tracking-wide md:py-20">SIGN UP</h1>
      <div className="mb-8">
        <form onSubmit={handleSignUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="name"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                NAME
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="John Doe"
                required
              />
            </div>

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
                htmlFor="shipping-address"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                SHIPPING ADDRESS
              </Label>
              <Input
                id="shipping-address"
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="206 Batran's Street, 39, 2044 Ontario..."
                required
              />
            </div>

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="phone"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                PHONE NUMBER
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="+1 222 333 4444"
                required
              />
            </div>

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="password"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
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

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="repeat-password"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                REPEAT PASSWORD
              </Label>
              <Input
                id="repeat-password"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base"
                placeholder="*************************"
                required
              />
            </div>
          </div>

          <div className="mb-8 w-1/2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base"
            >
              {isLoading ? "Creating Account..." : "SIGN UP"}
            </Button>
          </div>

          {error && (
            <div className="mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-stone-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-black hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

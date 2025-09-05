"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cartStore";
import { useCartMigration } from "@/hooks/use-cart-migration";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useMainStore } from "@/store/mainStore";

const baseInput =
  "border-none bg-transparent px-0 py-2 sm:py-3 text-stone-800 placeholder:text-stone-500 focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none text-sm sm:text-base";

const inputWithHint = cn(baseInput);

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);

  // warnings
  const [emailWarning, setEmailWarning] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [repeatPasswordWarning, setRepeatPasswordWarning] = useState("");

  const { handleLoginSuccess } = useMainStore();
  const { hasGuestCartItems, getGuestCartItemCount } = useCartMigration();
  const router = useRouter();

  // Show cart migration info
  const showCartMigrationInfo = hasGuestCartItems();
  const guestItemCount = getGuestCartItemCount();

  // validators
  const validateEmail = (value: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailWarning(ok ? "" : "Please enter a valid email address.");
  };

  const validatePhone = (value: string) => {
    const ok = /^\+?\d{4,15}$/.test(value || "");
    setPhoneWarning(value && !ok ? "Please enter a valid phone number." : "");
  };

  const validatePassword = (value: string) => {
    setPasswordWarning(value.length < 8 ? "Password must be at least 8 characters." : "");
  };

  const validateRepeatPassword = (value: string) => {
    setRepeatPasswordWarning(value !== password ? "Passwords do not match." : "");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // final guard
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
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

      console.log("SUPABASE SIGNUP RESPONSE:", { data, error });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Check if duplicate
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError("This email is already registered. Please log in instead.");
        setIsLoading(false);
        return;
      }

      await handleLoginSuccess();
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const submitDisabled =
    isLoading ||
    !name ||
    !email ||
    !phoneNumber ||
    !password ||
    !repeatPassword ||
    !!(emailWarning || phoneWarning || passwordWarning || repeatPasswordWarning);

  return (
    <div className={cn("w-full px-4 sm:px-10 md:pt-0 pt-10 font-[Century-Old-Style]", className)} {...props}>
      <h1 className="text-[1rem] font-light mb-4 tracking-wide md:py-20 small-text">SIGN UP</h1>

      {/* Cart Migration Notice */}
      {showCartMigrationInfo && (
        <div className="mb-6 p-4 bg-[#FBD060]/10 border border-[#FBD060]/30 rounded-md">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <ShoppingCart className="h-4 w-4 text-[#FBD060]" />
            <span className="font-medium">Cart items detected:</span>
            <span>
              You have {guestItemCount} item{guestItemCount > 1 ? 's' : ''} in your cart that will be saved to your new account.
            </span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <form onSubmit={handleSignUp} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Name (no warning overlay needed) */}
            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="name"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                NAME
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={baseInput}
                placeholder="Mary Oliver"
                required
              />
            </div>

            {/* Email */}
            <Field id="email" label="EMAIL ADDRESS" warning={emailWarning}>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                aria-invalid={!!emailWarning}
                autoComplete="email"
                className={inputWithHint}
                placeholder="mary.oliver@example.com"
                required
              />
            </Field>

            <div className="border border-stone-700 p-4 sm:p-8">
              <Label
                htmlFor="shipping-address"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                ADDRESS (OPTIONAL)
              </Label>
              <Input
                id="shipping-address"
                name="shipping-address"
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                autoComplete="street-address"
                className={baseInput}
                placeholder="206 Batran's Street, 39, 2044 Ontario..."
              />
            </div>

            {/* Phone */}
            <Field id="phone" label="PHONE NUMBER" warning={phoneWarning}>
              <Input
                id="phone"
                name="tel"
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhone(e.target.value);
                }}
                aria-invalid={!!phoneWarning}
                autoComplete="tel"
                className={inputWithHint}
                placeholder="+44 0777 888 999"
                required
              />
            </Field>

            {/* Password */}
            <Field id="password" label="PASSWORD" warning={passwordWarning}>
              <div className="relative">
                <Input
                  id="password"
                  name="new-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPassword(v);
                    validatePassword(v);
                    // keep repeat validation in sync
                    validateRepeatPassword(repeatPassword);
                  }}
                  aria-invalid={!!passwordWarning}
                  autoComplete="new-password"
                  className={inputWithHint}
                  placeholder="*************************"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  tabIndex={-1}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            {/* Repeat Password */}
            <Field id="repeat-password" label="REPEAT PASSWORD" warning={repeatPasswordWarning}>
              <div className="relative">
                <Input
                  id="repeat-password"
                  name="confirm-password"
                  type={isRepeatPasswordVisible ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRepeatPassword(v);
                    validateRepeatPassword(v);
                  }}
                  aria-invalid={!!repeatPasswordWarning}
                  autoComplete="new-password"
                  className={inputWithHint}
                  placeholder="*************************"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsRepeatPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  tabIndex={-1}
                  aria-label={isRepeatPasswordVisible ? "Hide repeat password" : "Show repeat password"}
                >
                  {isRepeatPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>
          </div>

          <div className="mb-8 w-1/2">
            <Button
              type="submit"
              disabled={submitDisabled}
              className="w-full rounded-none px-6 sm:px-12 py-2 sm:py-3 bg-[#FDCF5F] hover:bg-[#FDCF5F]/80 text-stone-800 font-medium tracking-wider uppercase transition-colors text-sm sm:text-base disabled:opacity-60"
            >
              {isLoading ? "Creating Account..." : "SIGN UP"}
            </Button>
          </div>

          {error && (
            <div className="mb-6">
              <p className="text-[#50462D] text-sm">{error}</p>
            </div>
          )}

          <div className="sm:text-left">
            <Link href="/auth/login">
              <p className="text-sm text-stone-500 hover:text-stone-700">
                Already have an account?{" "}
                <span className="text-black font-medium">Log In</span>
              </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

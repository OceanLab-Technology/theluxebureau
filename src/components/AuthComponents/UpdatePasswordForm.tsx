"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/products");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full px-10 font-[Century-Old-Style]", className)} {...props}>
      <h1 className="text-xs font-light mb-4 tracking-wide py-20">UPDATE PASSWORD</h1>
      <div className="mb-8">
        <form onSubmit={handleForgotPassword}>
          <div className="flex flex-col w-120 gap-3 mb-8">
            <div className="border border-stone-700 p-8">
              <Label
                htmlFor="password"
                className="block text-xs font-medium mb-2 tracking-wider uppercase text-stone-500"
              >
                NEW PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 focus:border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600  focus:ring-0 outline-none rounded-none focus-visible:ring-0 shadow-none"
                placeholder="*************************"
                required
              />
            </div>

            <div className="mb-8 w-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-none px-12 py-3 bg-yellow-400/70 hover:bg-yellow-500 text-stone-700 font-medium tracking-wider uppercase transition-colors"
              >
                {isLoading ? "Saving..." : "SAVE NEW PASSWORD"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

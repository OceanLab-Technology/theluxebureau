import { LoginForm } from "@/components/AuthComponents/LoginForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-[Century-Old-Style]">
      <main className="relative flex flex-col md:flex-row justify-between px-4 sm:px-20 min-h-[calc(100vh-128px)]">
        <div className="w-full md:w-96 py-6 sm:py-50 text-sm uppercase md:block hidden small-text">Account</div>
        {/* 👇 Suspense fixes the useSearchParams warning */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

      </main>
    </div>
  );
}

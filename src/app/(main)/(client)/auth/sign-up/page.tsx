import { SignUpForm } from "@/components/AuthComponents/SignUpForm";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-century">
      <main className="relative flex flex-col md:flex-row justify-between px-4 sm:px-20 min-h-[calc(100vh-64px)]">
        <div className="w-full md:w-96 py-6 sm:py-50 text-sm uppercase">Account</div>
        <SignUpForm />
      </main>
    </div>
  );
}

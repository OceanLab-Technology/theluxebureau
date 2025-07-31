import { SignUpForm } from "@/components/AuthComponents/SignUpForm";
import { Footer } from "@/components/Tools/Footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-century">
      <main className="relative flex justify-between px-20 min-h-[calc(100vh-64px)]">
        <div className="w-96 py-50 text-sm uppercase">Account</div>
        <SignUpForm />
      </main>
      <Footer />
    </div>
  );
}

import { UpdatePasswordForm } from "@/components/AuthComponents/UpdatePasswordForm";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-century">
      <Header />
      <main className="relative flex justify-between px-20 min-h-[calc(100vh-64px)]">
        <div className="w-96 py-50 text-sm uppercase">Account</div>
        <UpdatePasswordForm />
      </main>
      <Footer />
    </div>
  );
}

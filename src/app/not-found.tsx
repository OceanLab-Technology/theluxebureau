// app/main/not-found/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MainNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button className="mt-6 rounded-[0.25rem]">Go to Home</Button>
      </Link>
    </div>
  );
}

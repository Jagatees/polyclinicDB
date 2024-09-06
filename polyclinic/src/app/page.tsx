import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Corrected import statement

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
      <h1 className="mt-6 text-2xl font-bold text-center">Welcome to the Home Page</h1>
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
      <Link href="/register">
        <Button variant="outline">Registration</Button>
      </Link>
    </div>
  );
}

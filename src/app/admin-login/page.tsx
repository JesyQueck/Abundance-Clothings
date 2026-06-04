"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";

function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAdminAuthenticated();
      const from = searchParams.get("from");
      const destination =
        from && from.startsWith("/admin") ? from : "/admin";
      router.replace(destination);
    }
  }, [router, searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const adminPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      setAdminAuthenticated();
      const from = searchParams.get("from");
      const destination =
        from && from.startsWith("/admin") ? from : "/admin";
      router.replace(destination);
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-deep py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <div className="max-w-md w-full space-y-8 p-6">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bebas-neue text-gold-primary uppercase">
              Admin Login
            </h2>
            <p className="mt-2 text-text-secondary text-sm">
              Enter password to access the admin panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-text-secondary">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

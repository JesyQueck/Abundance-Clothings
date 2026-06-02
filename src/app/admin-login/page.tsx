"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"; // Default for dev

    if (password === adminPassword) {
      localStorage.setItem("abundance_admin_auth", "true");
      router.push("/admin");
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

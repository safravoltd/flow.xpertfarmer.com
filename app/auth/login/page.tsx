"use client";

import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Phone, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        phoneNumber,
        pin,
        adminLogin: "true",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid administrator credentials");
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">XpertFarmer</h1>
            <p className="text-muted-foreground mt-2">Administrator sign in</p>
          </div>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Email or phone number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="admin@example.com or 254791033018"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="block text-sm font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Password
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use your administrator password.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-base font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

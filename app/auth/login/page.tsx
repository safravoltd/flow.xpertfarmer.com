"use client";

import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Phone, Lock } from "lucide-react";
import {
  isValidKenyanPhoneNumber,
  getPhoneNumberErrorMessage,
} from "@/lib/utils/phone-formatter";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const validatePhoneNumber = (value: string) => {
    if (!value) {
      setPhoneError("");
      return true;
    }

    if (!isValidKenyanPhoneNumber(value)) {
      setPhoneError(getPhoneNumberErrorMessage(value));
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // validatePhoneNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (!pin || pin.length < 4) {
      setError("PIN must be at least 4 digits");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        phoneNumber,
        pin,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid phone number or PIN");
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
            <p className="text-muted-foreground mt-2">Admin Dashboard</p>
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
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="0791033018 or 254791033018"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={loading}
                className={phoneError ? "border-destructive" : ""}
                required
              />
              {phoneError && (
                <p className="text-xs text-destructive mt-1">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Use format: 0791033018, 254791033018, or +254791033018
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="block text-sm font-medium flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={loading}
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your 4-6 digit PIN
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

"use client";

import { useState } from "react";
import { fetchPost } from "@/action/function";
import { setAuth, AuthData } from "@/action/localStorage";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInResponse {
  token: string;
  username: string;
  email?: string;
}

interface SignInModalProps {
  open: boolean;
  onSuccess: (auth: AuthData) => void;
}

export function SignInModal({ open, onSuccess }: SignInModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPost<
        { username: string; password: string },
        SignInResponse
      >({
        api: "auth/signin",
        body: { username, password },
      });

      const auth: AuthData = {
        token: data.token,
        username: data.username,
        email: data.email,
      };
      setAuth(auth);
      onSuccess(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogRoot open={open}>
      <DialogContent showClose={false} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access the Dealership Assistant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive dark:bg-destructive/20">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full mt-1">
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

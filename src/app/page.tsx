"use client";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Page() {
  const { signIn } = useAuthActions();
  return (
    <button onClick={() => void signIn("google")}>Sign in with Google</button>
  );
}

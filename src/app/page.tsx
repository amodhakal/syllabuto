"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/server/_generated/api";
import { useState } from "react";

export default function Page() {
  const user = useQuery(api.user.me, {});
  const { signIn, signOut } = useAuthActions();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setStatus(null);
    setError(null);
    try {
      setStatus("Signing in...");
      const result = await signIn("google");
      if (result.redirect) {
        window.location.href = result.redirect.toString();
        return;
      }
      if (result.signingIn) setStatus("Completing sign-in...");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus(null);
    }
  };

  const handleSignOut = async () => {
    setStatus("Signing out...");
    setError(null);
    try {
      await signOut();
      setStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const isLoading = user === undefined;
  const isAuthenticated = user !== null && user !== undefined;

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <div className="flex flex-col items-center gap-2">
          <div className="mb-2">
            Logged in as <b>{String(user?.name || user?.email || "Unknown User")}</b>
          </div>
          {user?.email && (
            <div className="text-sm text-gray-600">Email: {String(user.email)}</div>
          )}
          {/* Debug: Show raw user data */}
          {typeof window !== "undefined" && user?._raw && (
            <details className="mt-2 text-xs text-gray-500">
              <summary>Debug Info</summary>
              <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-w-md">
                {JSON.stringify(user._raw, null, 2)}
              </pre>
            </details>
          )}
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSignIn}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      )}

      {status && <div className="text-blue-600 text-sm">{status}</div>}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          Sign in failed: {error}
        </div>
      )}
    </div>
  );
}
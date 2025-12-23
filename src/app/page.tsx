"use client";

import { authClient, useSession } from "@/lib/auth/client";

export default function Home() {
  const session = useSession();
  if (session.isPending) {
    return <div className="">Loading...</div>;
  }

  if (session.error) {
    return <div className="">{session.error.message}</div>;
  }

  if (!session.data) {
    return (
      <div className="p-4 gap-4 ">
        <p className="">You haven&apos;t signed in</p>
        <button
          onClick={async () =>
            await authClient.signIn.social({ provider: "google" })
          }
          className=""
        >
          Sign in
        </button>
      </div>
    );
  }

  const { token } = session.data.session;
  return <div className="font-black text-5xl">Syllabuto</div>;
}

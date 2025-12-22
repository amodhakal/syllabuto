import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    await auth.api.signInSocial({
      body: {
        provider: "google",
      },
    });
  }

  return <div className="">Dashboard</div>;
}

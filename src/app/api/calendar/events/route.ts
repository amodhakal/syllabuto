import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema/auth";
import { getGoogleCalendarEvents } from "@/lib/calendar/google-calendar";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the session from the request
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's Google account to retrieve the access token
    const userAccounts = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, session.user.id),
          eq(account.providerId, "google")
        )
      )
      .limit(1);

    const userAccount = userAccounts[0];

    if (!userAccount?.accessToken) {
      return NextResponse.json(
        { error: "No Google account linked or access token not available" },
        { status: 400 }
      );
    }

    // Fetch calendar events
    const events = await getGoogleCalendarEvents(userAccount.accessToken);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}


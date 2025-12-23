import { google } from "googleapis";

/**
 * Fetches upcoming events from the user's primary Google Calendar.
 * @param accessToken OAuth2 access token for the user with calendar permissions.
 * @param maxResults Maximum number of events to return (default: 10)
 * @returns List of calendar events
 */
export async function getGoogleCalendarEvents(
  accessToken: string,
  maxResults: number = 10
) {
  try {
    // Set up OAuth2 client with the user's access token
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    // Set up calendar API client
    const calendar = google.calendar({ version: "v3", auth });

    // Fetch upcoming events
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
}


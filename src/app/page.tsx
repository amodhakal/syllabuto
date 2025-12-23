"use client";

import { authClient, useSession } from "@/lib/auth/client";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id?: string | null;
  summary?: string | null;
  start?: {
    dateTime?: string | null;
    date?: string | null;
  } | null;
  end?: {
    dateTime?: string | null;
    date?: string | null;
  } | null;
  description?: string | null;
  location?: string | null;
}

export default function Home() {
  const session = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/calendar/events");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.data) {
      fetchCalendarEvents();
    }
  }, [session.data]);

  if (session.isPending) {
    return <div className="p-4">Loading...</div>;
  }

  if (session.error) {
    return <div className="p-4 text-red-500">{session.error.message}</div>;
  }

  if (!session.data) {
    return (
      <div className="p-4 gap-4">
        <p className="mb-4">You haven&apos;t signed in</p>
        <button
          onClick={async () =>
            await authClient.signIn.social({ provider: "google" })
          }
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const formatDate = (dateTime?: string | null, date?: string | null) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleString();
    }
    if (date) {
      return new Date(date).toLocaleDateString();
    }
    return "No date";
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="font-black text-5xl mb-6">Syllabuto</h1>

      <div className="mb-4">
        <button
          onClick={fetchCalendarEvents}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Events"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading && events.length === 0 && (
        <div className="text-gray-500">Loading calendar events...</div>
      )}

      {!loading && events.length === 0 && !error && (
        <div className="text-gray-500">No upcoming events found.</div>
      )}

      {events.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">
                {event.summary || "No title"}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Start:</strong>{" "}
                  {formatDate(event.start?.dateTime, event.start?.date)}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {formatDate(event.end?.dateTime, event.end?.date)}
                </p>
                {event.location && (
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                )}
                {event.description && (
                  <p className="mt-2 text-gray-700">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

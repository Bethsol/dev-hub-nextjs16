'use client';

import { useState } from "react";
import posthog from "posthog-js";
import { IBooking, createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string; }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on submit

    try {
      // Extract 'success' and 'error' from the result of createBooking
      const { success, error } = await createBooking({ eventId, slug, email });

      if (success) {
        setSubmitted(true);
        posthog.capture('event_booked', { eventId, slug, email });
      } else {
        console.error('Booking creation failed:', error);
        if (error) posthog.captureException(error);
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
              className="border p-2 rounded"
              required
            />
          </div>

          <button type="submit" className="button-submit mt-4">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
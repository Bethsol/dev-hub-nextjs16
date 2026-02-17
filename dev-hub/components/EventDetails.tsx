import { IEvent } from "@/database";
import { getSimilarEventBySlug, getEventBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import { cacheLife } from 'next/cache';
import { notFound } from "next/navigation";


// --- Sub-Components ---
const EventDetailItem = ({ icon, alt, lable }: { icon: string; alt: string; lable: string }) => (
  <div className="flex items-center gap-2">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{lable}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: any }) => {
  if (!agendaItems || !Array.isArray(agendaItems)) return null;
  return (
    <div className="agenda mt-6">
      <h2 className="font-bold">Agenda</h2>
      <ul className="font-mono text-sm text-slate-300 italic tracking-tight">
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: any }) => {
  if (!tags || !Array.isArray(tags)) return null;
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div className="pill" key={tag}>{tag}</div>
      ))}
    </div>
  );
};

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  'use cache'
  cacheLife('hours');
  const slug = await params;

  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const {
    description, image, overview, date, time,
    location, mode, agenda, audience, tags, organizer
  } = event;

  const bookings = 10;
  const rawSimilarEvents = await getSimilarEventBySlug(slug);
  const similarEvents = JSON.parse(JSON.stringify(rawSimilarEvents));

  console.log(similarEvents);

  // Helper function to handle JSON parsing safely
  const parseData = (input: any) => {
    try {
      if (typeof input === 'string') return JSON.parse(input);
      return input;
    } catch (e) {
      return [];
    }
  };

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2 text-slate-400">{description}</p>
      </div>

      <div className="details">
        <div className="content">
          {image && (
            <Image
              src={image}
              alt="Event Banner"
              width={800}
              height={400}
              className="banner rounded-lg object-cover w-full"
            />
          )}

          <section className="mt-6">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="mt-6 flex flex-col gap-3">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" lable={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" lable={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" lable={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" lable={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" lable={audience} />
          </section>

          <EventAgenda agendaItems={parseData(agenda)} />

          <section className="flex-col-gap-2">
            <h2 className="text-xl font-semibold">About the organizer</h2>
            <p className="mt-2">{organizer}</p>
          </section>

          <EventTags tags={parseData(tags)} />
        </div>

        <aside className="booking w-full md:w-80">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
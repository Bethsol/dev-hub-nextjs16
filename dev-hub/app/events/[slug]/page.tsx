import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent"; 
import type { IEvent } from "@/database";
import { getSimilarEventBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
      <ul className="list-disc ml-5">
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
    <div className="flex flex-row gap-1.5 flex-wrap mt-4">
      {tags.map((tag, index) => (
        <div className="pill bg-gray-200 px-3 py-1 rounded-full text-sm" key={index}>{tag}</div>
      ))}
    </div>
  );
};

// --- Main Page Component ---
const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
  const { slug } = await params;

  let event;
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!request.ok) {
      if (request.status === 404) return notFound();
      throw new Error(`Failed to fetch event`);
    }

    const response = await request.json();
    event = response.event;

    if (!event) return notFound();
  } catch (err) {
    console.error('Error fetching event:', err);
    return notFound();
  }

  const { 
    description, image, overview, date, time, 
    location, mode, agenda, audience, tags, organizer 
  } = event;

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

  console.log(similarEvents)

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
    <section id="event" className="p-4 max-w-6xl mx-auto">
      <div className="header">
        <h1 className="text-3xl font-bold">Event Description</h1>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      
      <div className="details flex flex-col md:flex-row gap-8 mt-8">
        <div className="content flex-1">
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
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2">{overview}</p>
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
          
          <section className="mt-6">
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
            ): (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
        
            <BookEvent />
            
          </div>
        </aside>
      </div>



      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} { ...similarEvent} />
          ))}
        </div>
      </div>
     
    </section>
  );
};

export default EventDetailsPage;
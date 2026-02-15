'use client'
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
    const handleClick = () => {
        posthog.capture('event_card_clicked', {
            event_title: title,
            event_slug: slug,
            event_location: location,
            event_date: date,
        });
    };

    return (
        <Link href={`/events/${slug}`} id="event-card" className="block border rounded-lg overflow-hidden p-4" onClick={handleClick}>
            <Image src={image} alt={title} width={410} height={300} className="poster rounded-md" />

            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                <p className="text-sm text-gray-600">{location}</p>
            </div>

            <p className="title">{title}</p>


            <div className="flex flex-col gap-1">

                <div className="flex flex-row gap-2 items-center">

                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                    <p className="text-xs">{date}</p>
                </div>


                <div className="flex flex-row gap-2">
                    <Image src="/icons/clock.svg" alt="time" width={14} height={14} />

                    <p className="text-xs">{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard;
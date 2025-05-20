"use client"
import { useEffect, useState } from 'react';
import { fetchEvents, EventData } from '../../Backend/lib/ticketmaster';
import Event from './components/Event';
import { FaCalendarDay, FaLocationArrow, FaSistrix } from "react-icons/fa6";


export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    fetchEvents('keyword=music&').then(setEvents);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col bg-[url('https://res.cloudinary.com/drnaycy06/image/upload/v1747778304/istockphoto-1806011581-612x612_sdltch.jpg')] bg-cover bg-center h-[400px] text-white p-8">
        <h1>A Night of Fun</h1>
        <div className="flex">
          <button type="button" className=" bg-azure rounded-md hover:bg-sapphire">Learn More</button>
          <button type="button" className=" bg-azure rounded-md hover:bg-sapphire">Buy Tickets</button>
        </div>
      </section>
      {/* Featured Events */}
      <section>
        <h2 className="text-2xl font-bold">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Event
              key={event.id}
              id={event.id}
              src={event.src}
              name={event.name}
              city={event.city}
            />
          ))}
        </div>
      </section>
    </>
  );
}

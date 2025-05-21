"use client"
import { useEffect, useState } from 'react';
import { fetchEvents, EventData } from '../../Backend/lib/ticketmaster';
import Event from './components/Event';
import Footer from './components/Footer';

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchEvents('keyword=music&').then(setEvents);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col bg-[url('https://res.cloudinary.com/drnaycy06/image/upload/v1747830908/istockphoto-1806011581-612x612_gjuwu0.jpg')] bg-cover bg-center h-[400px] text-white p-8 justify-center items-center">
        <h1 className="text-6xl font-bold mb-6 text-center text-shadow-black text-shadow-md lg:text-shadow-sm">A Night Of Fun</h1>
        <div className="flex gap-4">
          <button type="button" className="px-6 py-4 text-xl bg-blue-600 rounded-md hover:bg-blue-800 font-medium">Learn More</button>
          <button type="button" className="px-6 py-4 text-xl bg-blue-600 rounded-md hover:bg-blue-800 font-medium">Buy Tickets</button>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        {/* Featured Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <Event
                  key={event.id}
                  id={event.id}
                  src={event.src}
                  name={event.name}
                  city={event.city}
                />
              ))
            ) : (
              <p>Loading events...</p>
            )}
          </div>
        </section>

        {/* Recently Viewed Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">RECENTLY VIEWED</h2>
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">⊘</span>
            </div>
            <span>Placeholder</span>
          </div>
        </section>

        {/* Popular Near You Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">POPULAR NEAR YOU</h2>
          <div className="space-y-4">
            {/* Category Cards */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <div className="text-sm text-gray-500">Concerts</div>
                <div className="font-medium">Placeholder</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md">SEE</button>
            </div>
            
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <div className="text-sm text-gray-500">Sports</div>
                <div className="font-medium">Placeholder</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md">SEE</button>
            </div>
            
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <div className="text-sm text-gray-500">Arts, Theater & Comedy</div>
                <div className="font-medium">Placeholder</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md">SEE</button>
            </div>
            
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <div className="text-sm text-gray-500">Family</div>
                <div className="font-medium">Placeholder</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md">SEE</button>
            </div>
          </div>
        </section>

        {/* Your Events Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">YOUR EVENTS</h2>
          {/* {mongoEvents.length > 0 ? (
              mongoEvents.map((event) => (
                <Event
                  key={event.id}
                  id={event.id}
                  src={event.src}
                  name={event.name}
                  city={event.city}
                />
              ))
            ) : (
              <p>No personal events yet!</p>
            )} */}
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
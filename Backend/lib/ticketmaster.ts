export type EventData = {
    id: string;
    name: string;
    city: string;
    src: string;
};

export type EventDetailData = EventData & {
    date?: string;
    time?: string;
    venue?: string;
    priceRanges?: {
        min: number;
        max: number;
        currency: string;
    }[];
};

export async function fetchEvents(params:string = ''): Promise<EventData[]> {
    const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}countryCode=US&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data._embedded?.events) {
            return [];
        }

        return data._embedded.events.map((event: any) => ({
            id: event.id,
            name: event.name,
            city: event._embedded?.venues?.[0]?.city?.name,
            src: event.images?.[0]?.url || '',
        }));
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
}

export async function fetchEventById(id: string): Promise<EventDetailData | null> {
    const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
    const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const event = await response.json();

        if (!event || !event.id) {
            return null;
        }
        
        const eventDate = event.dates?.start?.localDate 
            ? new Date(event.dates.start.localDate)
            : null;
        
        const formattedDate = eventDate 
            ? eventDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
            }) 
            : '';
            
        const formattedTime = event.dates?.start?.localTime 
            ? new Date(`1970-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })
            : '';

        return {
            id: event.id,
            name: event.name,
            city: event._embedded?.venues?.[0]?.city?.name,
            venue: event._embedded?.venues?.[0]?.name,
            src: event.images?.[0]?.url || '',
            date: formattedDate,
            time: formattedTime,
            priceRanges: event.priceRanges || []
        };
    } catch (error) {
        console.error('Failed to fetch event details:', error);
        return null;
    }
}
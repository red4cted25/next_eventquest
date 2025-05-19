export type EventData = {
    id: string;
    name: string;
    city: string;
    src: string;
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
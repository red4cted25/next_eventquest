import { EventData } from '../../../Backend/lib/ticketmaster'
import Image from 'next/image'
import Link from 'next/link'

const Event = ({ src, name, city, id }: EventData) => {
    return (
        <Link href={`/rsvp/${id}`} className="flex flex-col mb-4 hover:bg-accent-gray/25 transition duration-400 ease-in-out p-4 rounded-lg hover:shadow-md">
            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden mb-2">
                <Image
                    src={src}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <p className="text-accent-gray">{city ? `In ${city}` : 'In a City near you'}</p>
            <h2 className="text-2xl font-bold">{name || 'Event Title'}</h2>
        </Link>
    )
}

export default Event

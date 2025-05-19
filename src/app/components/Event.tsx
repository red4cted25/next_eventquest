import { EventData } from '../../../Backend/lib/ticketmaster'
import Image from 'next/image'
import Link from 'next/link'

const Event = ({ src, name, city, id }: EventData) => {
    return (
        <Link href={`/events/${id}`} className="flex flex-col">
            <Image src={src} alt={name} width={500} height={700} className="w-full h-auto" />
            <p className="text-accent-gray">{city ? `In ${city}` : 'In a City near you'}</p>
            <h2 className="text-2xl font-bold">{name || 'Event Title'}</h2>
        </Link>
    )
}

export default Event

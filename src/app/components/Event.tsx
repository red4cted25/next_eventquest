import Image from 'next/image'
import Link from 'next/link'

const Event = (src, title, city, id) => {
    return (
        <Link href={`/events/${id}`} className="flex flex-col">
            <Image src={src} alt={title} width={500} height={700}  />
            <p></p>
        </Link>
    )
}

export default Event
import Link from 'next/link'
import {
  ChevronDownIcon,
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import GenreFilter from '../components/GenreFilter'
import { musicGenres } from '../../data/musicGenres'

interface TMEvent {
  id: string
  name: string
  dates: { start: { localDate: string; localTime?: string } }
  _embedded?: {
    venues: Array<{
      name: string
      city: { name: string }
      state?: { name: string }
      country: { name: string }
    }>
  }
}

interface Event {
  id: string
  month: string
  day: string
  weekday: string
  time: string
  title: string
  venue: string
  location: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  // Read query params
  const classificationId = searchParams.classificationId ?? ''
  const page = parseInt(searchParams.page ?? '0', 10)

  // Determine display name
  const genreName =
    musicGenres.find((g) => g.id === classificationId)?.name ||
    'All Events'

  // Fetch events
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY!
  const size = 20
  const evUrl = new URL(
    'https://app.ticketmaster.com/discovery/v2/events.json'
  )
  if (classificationId)
    evUrl.searchParams.set('classificationId', classificationId)
  evUrl.searchParams.set('countryCode', 'US')
  evUrl.searchParams.set('size', String(size))
  evUrl.searchParams.set('page', String(page))
  evUrl.searchParams.set('sort', 'date,asc')
  evUrl.searchParams.set('apikey', apiKey)

  const evRes = await fetch(evUrl.toString(), { next: { revalidate: 60 } })
  if (!evRes.ok) throw new Error('Failed to fetch events')
  const evData = await evRes.json()
  const tmEvents: TMEvent[] = evData._embedded?.events || []
  const {
    number: currentPage,
    totalPages,
    totalElements,
  }: { number: number; totalPages: number; totalElements: number } =
    evData.page

  // Transform
  const events: Event[] = tmEvents.map((e) => {
    const { localDate, localTime } = e.dates.start
    const dt = parseISO(`${localDate}T${localTime ?? '00:00'}`)
    const v = e._embedded?.venues?.[0]
    return {
      id: e.id,
      month: format(dt, 'MMM').toUpperCase(),
      day: format(dt, 'd'),
      weekday: format(dt, 'EEE'),
      time: format(dt, 'h:mm a'),
      title: e.name,
      venue: v?.name || 'Unknown Venue',
      location: v
        ? `${v.city.name}, ${v.state?.name ?? v.country.name}`
        : '',
    }
  })

  const HERO_BANNER = '/images/events-hero.jpg'

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[200px] md:h-[300px] lg:h-[350px]">
        <img
          src={HERO_BANNER}
          alt="Events banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            {genreName}
          </h1>
          <span
            className="block mt-2 h-1 bg-[#007BFF]"
            style={{ width: `${Math.max(genreName.length, 5) * 1.2}rem` }}
          />
        </div>
      </section>

      {/* Filters & List */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
          <button className="flex items-center space-x-2 text-black hover:text-blue-600">
            <MapPinIcon className="w-5 h-5" />
            <span>
              Near{' '}
              <span className="text-blue-600 underline">
                Select your location
              </span>
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {/* Static genre dropdown */}
          <GenreFilter />

          <div className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Keyword"
              className="border border-gray-300 rounded px-2 py-1 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <select className="border border-gray-300 rounded px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>All Dates</option>
              <option>This Weekend</option>
              <option>Next Week</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            {genreName}{' '}
            <span className="font-normal text-gray-600">
              — {totalElements.toLocaleString()} Results
            </span>
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {events.map((e) => (
            <div key={e.id} className="py-6 flex items-center justify-between">
              <div className="flex items-start space-x-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">
                    {e.month}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{e.day}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {e.weekday} &bull; {e.time}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    {e.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {e.venue} &mdash; {e.location}
                  </p>
                </div>
              </div>
              <a
                href={`https://www.ticketmaster.com/search?q=${encodeURIComponent(
                  e.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-black hover:bg-blue-800 text-white rounded transition"
              >
                Find Tickets
                <ChevronDownIcon className="w-4 h-4 ml-2 rotate-180" />
              </a>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          {currentPage > 0 && (
            <Link
              href={`/events?${classificationId
                ? `classificationId=${classificationId}&`
                : ''
              }page=${currentPage - 1}`}
              className="px-4 py-2 bg-black text-white rounded hover:bg-blue-800 transition"
            >
              Previous
            </Link>
          )}
          {currentPage < totalPages - 1 && (
            <Link
              href={`/events?${classificationId
                ? `classificationId=${classificationId}&`
                : ''
              }page=${currentPage + 1}`}
              className="px-4 py-2 bg-black text-white rounded hover:bg-blue-800 transition"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

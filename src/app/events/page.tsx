// src/app/events/page.tsx
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import GenreFilter from '../components/GenreFilter'
import LocationFilter from '../components/LocationFilter'
import SearchFilter from '../components/SearchFilter'
import DateFilter from '../components/DateFilter'
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

export default async function EventsPage(props: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await props.searchParams
  const classificationId = params.classificationId ?? ''
  const page = parseInt(params.page ?? '0', 10)
  const postalCode = params.postalCode
  const latlong = params.latlong
  const keyword = params.keyword
  const startDateTime = params.startDateTime
  const endDateTime = params.endDateTime

  const genreName =
    musicGenres.find((g) => g.id === classificationId)?.name ||
    'All Events'

  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY!
  const size = 20
  const tmUrl = new URL(
    'https://app.ticketmaster.com/discovery/v2/events.json'
  )
  if (classificationId) tmUrl.searchParams.set('classificationId', classificationId)
  tmUrl.searchParams.set('countryCode', 'US')
  if (postalCode) tmUrl.searchParams.set('postalCode', postalCode)
  if (latlong) {
    tmUrl.searchParams.set('latlong', latlong)
    tmUrl.searchParams.set('radius', '50')
    tmUrl.searchParams.set('unit', 'miles')
  }
  if (keyword) tmUrl.searchParams.set('keyword', keyword)
  if (startDateTime) tmUrl.searchParams.set('startDateTime', startDateTime)
  if (endDateTime) tmUrl.searchParams.set('endDateTime', endDateTime)
  tmUrl.searchParams.set('size', String(size))
  tmUrl.searchParams.set('page', String(page))
  tmUrl.searchParams.set('sort', 'date,asc')
  tmUrl.searchParams.set('apikey', apiKey)

  // 🛡️ Wrap fetch in try/catch so errors don't crash the page
  let data: any
  try {
    const res = await fetch(tmUrl.toString(), { next: { revalidate: 60 } })
    if (res.ok) {
      data = await res.json()
    } else {
      console.error(`TM API error ${res.status}:`, await res.text())
      data = { _embedded: { events: [] }, page: { number: 0, totalPages: 0, totalElements: 0 } }
    }
  } catch (err) {
    console.error('Failed to fetch events:', err)
    data = { _embedded: { events: [] }, page: { number: 0, totalPages: 0, totalElements: 0 } }
  }

  // total across all pages in this genre
  const totalGenreCount: number = data.page.totalElements

  const tmEvents: TMEvent[] = data._embedded?.events || []
  const { number: currentPage, totalPages } = data.page

  const events: Event[] = tmEvents.map((e) => {
    const { localDate, localTime } = e.dates.start
    const dt = parseISO(`${localDate}T${localTime ?? '00:00'}`)
    const venue = e._embedded?.venues?.[0]
    return {
      id: e.id,
      month: format(dt, 'MMM').toUpperCase(),
      day: format(dt, 'd'),
      weekday: format(dt, 'EEE'),
      time: format(dt, 'h:mm a'),
      title: e.name,
      venue: venue?.name ?? 'Unknown Venue',
      location: venue
        ? `${venue.city.name}, ${venue.state?.name ?? venue.country.name}`
        : '',
    }
  })

  // fallback for location filters (unchanged)
  let fallbackEvents: Event[] | null = null
  if (events.length === 0 && (postalCode || latlong)) {
    const fbUrl = new URL(
      'https://app.ticketmaster.com/discovery/v2/events.json'
    )
    if (classificationId) fbUrl.searchParams.set('classificationId', classificationId)
    fbUrl.searchParams.set('countryCode', 'US')
    if (keyword) fbUrl.searchParams.set('keyword', keyword)
    if (startDateTime) fbUrl.searchParams.set('startDateTime', startDateTime)
    if (endDateTime) fbUrl.searchParams.set('endDateTime', endDateTime)
    fbUrl.searchParams.set('size', String(size))
    fbUrl.searchParams.set('page', '0')
    fbUrl.searchParams.set('sort', 'date,asc')
    fbUrl.searchParams.set('apikey', apiKey)

    try {
      const fbRes = await fetch(fbUrl.toString(), { next: { revalidate: 60 } })
      if (fbRes.ok) {
        const fbData = await fbRes.json()
        const fbTmEvents: TMEvent[] = fbData._embedded?.events || []
        fallbackEvents = fbTmEvents.map((e) => {
          const { localDate, localTime } = e.dates.start
          const dt = parseISO(`${localDate}T${localTime ?? '00:00'}`)
          const venue = e._embedded?.venues?.[0]
          return {
            id: e.id,
            month: format(dt, 'MMM').toUpperCase(),
            day: format(dt, 'd'),
            weekday: format(dt, 'EEE'),
            time: format(dt, 'h:mm a'),
            title: e.name,
            venue: venue?.name ?? 'Unknown Venue',
            location: venue
              ? `${venue.city.name}, ${venue.state?.name ?? venue.country.name}`
              : '',
          }
        })
      }
    } catch (err) {
      console.error('Failed to fetch fallback events:', err)
    }
  }

  const displayEvents = fallbackEvents ?? events
  const showFallback = fallbackEvents !== null

  let locationLabel = 'Me'
  if (postalCode) locationLabel = postalCode
  else if (latlong) locationLabel = 'Your Area'

  const HERO_BANNER = '/images/events-hero.jpg'

  return (
    <main className="bg-white min-h-screen">
      {/* Hero banner */}
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

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8 text-black">
          <LocationFilter />
          <GenreFilter />
          <SearchFilter />
          <DateFilter />
        </div>

        {/* Fallback notice */}
        {showFallback && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 text-center">
            <p className="font-semibold">{`Near ${locationLabel}`}</p>
            <p className="mt-2 font-semibold">
              No events available in your selected area
            </p>
            <p className="text-gray-600">
              Don't worry, there are other events available below
            </p>
          </div>
        )}

        {/* Results header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            {genreName}{' '}
            <span className="font-normal text-gray-600">
              — {totalGenreCount.toLocaleString()} Results
            </span>
          </h2>
        </div>

        {/* Events list */}
        <div className="divide-y divide-gray-200">
          {displayEvents.map((e) => (
            <div
              key={e.id}
              className="py-6 flex items-center justify-between"
            >
              <div className="flex items-start space-x-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">{e.month}</p>
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
              <Link
                href={`/rsvp/${e.id}`}
                className="inline-flex items-center px-4 py-2 bg-black hover:bg-blue-800 text-white rounded transition"
              >
                Find Tickets
                <ChevronDownIcon className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!showFallback && (
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
        )}
      </div>
    </main>
  )
}

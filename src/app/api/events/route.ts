import { NextResponse } from 'next/server'

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword     = searchParams.get('keyword') ?? 'music'
  const countryCode = searchParams.get('countryCode') ?? 'US'
  const apiKey      = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { message: 'Server misconfiguration: NEXT_PUBLIC_TICKETMASTER_API_KEY is missing' },
      { status: 500 }
    )
  }

  const tmUrl =
    `${TM_BASE}` +
    `?keyword=${encodeURIComponent(keyword)}` +
    `&countryCode=${encodeURIComponent(countryCode)}` +
    `&apikey=${apiKey}`

  try {
    const tmRes = await fetch(tmUrl)
    if (!tmRes.ok) {
      const text = await tmRes.text()
      return NextResponse.json(
        { message: `Ticketmaster error (${tmRes.status}): ${text}` },
        { status: tmRes.status }
      )
    }
    const data = await tmRes.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('🛑 TM proxy error:', err)
    return NextResponse.json(
      { message: 'Internal server error fetching events' },
      { status: 500 }
    )
  }
}

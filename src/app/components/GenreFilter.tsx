'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { musicGenres } from '../../data/musicGenres'

export default function GenreFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get('classificationId') ?? ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const newParams = new URLSearchParams(params.toString())
    if (value) {
      newParams.set('classificationId', value)
      newParams.delete('page')
    } else {
      newParams.delete('classificationId')
      newParams.delete('page')
    }
    router.push(`/events?${newParams.toString()}`)
  }

  return (
    <select
      className="border border-gray-300 rounded px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
      value={current}
      onChange={handleChange}
    >
      <option value="">All Events</option>
      {musicGenres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  )
}

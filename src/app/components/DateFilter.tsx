'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

export default function DateFilter() {
  const router = useRouter()
  const params = useSearchParams()

  // grab existing ISO params if present
  const currentStart = params.get('startDateTime') ?? ''
  const currentEnd = params.get('endDateTime') ?? ''

  // local “YYYY-MM-DD” string
  const [date, setDate] = useState<string>(() => {
    if (currentStart) return currentStart.split('T')[0]
    return ''
  })

  // sync if URL changes
  useEffect(() => {
    if (currentStart) {
      setDate(currentStart.split('T')[0])
    }
  }, [currentStart])

  const applyDate = (d: string) => {
    const newParams = new URLSearchParams(params.toString())
    if (d) {
      // build a JS Date at local midnight
      const startLocal = new Date(`${d}T00:00:00`)
      // 24h later
      const endLocal = new Date(startLocal.getTime() + 24 * 60 * 60 * 1000)
      newParams.set('startDateTime', startLocal.toISOString())
      newParams.set('endDateTime', endLocal.toISOString())
    } else {
      newParams.delete('startDateTime')
      newParams.delete('endDateTime')
    }
    newParams.delete('page')
    router.push(`/events?${newParams.toString()}`)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value
    setDate(d)
    applyDate(d)
  }

  const clearDate = () => {
    setDate('')
    applyDate('')
  }

  return (
    <div className="flex items-center space-x-1">
      <CalendarIcon className="w-5 h-5 text-black" />
      <input
        type="date"
        value={date}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      {date && (
        <button
          onClick={clearDate}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

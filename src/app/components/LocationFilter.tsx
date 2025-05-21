'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPinIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function LocationFilter() {
const router = useRouter()
const params = useSearchParams()

const currentPostal = params.get('postalCode') ?? ''
const currentLatLong = params.get('latlong') ?? ''
const defaultLabel = 'Near Select your location'

const [open, setOpen] = useState(false)
const [input, setInput] = useState(currentPostal)
const [label, setLabel] = useState<string>(() => {
    if (currentPostal) return currentPostal
    if (currentLatLong) return 'Current Location'
    return defaultLabel
})

const panelRef = useRef<HTMLDivElement>(null)

// close dropdown on outside click
useEffect(() => {
    function onClick(e: MouseEvent) {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
    }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
}, [])

// reverse‐geocode coords → city, state
useEffect(() => {
    if (currentLatLong) {
    const [lat, lon] = currentLatLong.split(',')
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        .then(r => r.json())
        .then((data) => {
        const city = data.address.city || data.address.town || data.address.village || ''
        const state = data.address.state || ''
        setLabel(city && state ? `${city}, ${state}` : 'Current Location')
        })
        .catch(() => setLabel('Current Location'))
    }
}, [currentLatLong])

const applyPostal = () => {
    const newParams = new URLSearchParams(params.toString())
    if (input) {
    newParams.set('postalCode', input)
    newParams.delete('latlong')
    setLabel(input)
    }
    newParams.delete('page')
    router.push(`/events?${newParams.toString()}`)
    setOpen(false)
}

const useCurrent = () => {
    if (!navigator.geolocation) {
    alert('Geolocation not supported')
    return
    }
    navigator.geolocation.getCurrentPosition(
    (pos) => {
        const ll = `${pos.coords.latitude},${pos.coords.longitude}`
        const newParams = new URLSearchParams(params.toString())
        newParams.set('latlong', ll)
        newParams.delete('postalCode')
        newParams.delete('page')
        router.push(`/events?${newParams.toString()}`)
        setOpen(false)
        // reverse‐geocode effect will update label
    },
    () => alert('Unable to retrieve your location')
    )
}

const clearLocation = () => {
    const newParams = new URLSearchParams(params.toString())
    newParams.delete('postalCode')
    newParams.delete('latlong')
    newParams.delete('page')
    router.push(`/events?${newParams.toString()}`)
    setInput('')
    setLabel(defaultLabel)
    setOpen(false)
}

const isDefault = label === defaultLabel

return (
    <div className="relative" ref={panelRef}>
    <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 text-black hover:text-blue-600 focus:outline-none"
    >
        <MapPinIcon className="w-5 h-5" />
        {isDefault ? (
        <>
            <span className="text-black">Near </span>
            <span className="text-blue-600">Select your location</span>
        </>
        ) : (
        <span className="text-black">{label}</span>
        )}
        <ChevronDownIcon className="w-4 h-4 text-black" />
    </button>

    {open && (
        <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg p-4 z-10">
        <div className="relative mb-2">
            <input
            type="text"
            placeholder="Zip code or city"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-black"
            />
            {input && (
            <button
                onClick={() => setInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
            )}
        </div>
        <button
            type="button"
            onClick={applyPostal}
            disabled={!input}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2 disabled:opacity-50"
        >
            Apply
        </button>
        <button
            type="button"
            onClick={useCurrent}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded mb-2"
        >
            My Current Location
        </button>
        <button
            type="button"
            onClick={clearLocation}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded"
        >
            Clear Location
        </button>
        </div>
    )}
    </div>
)
}

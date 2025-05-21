'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function SearchFilter() {
const router = useRouter()
const params = useSearchParams()
const current = params.get('keyword') ?? ''
const [input, setInput] = useState(current)

const applySearch = () => {
    const q = new URLSearchParams(params.toString())
    if (input) {
    q.set('keyword', input)
    } else {
    q.delete('keyword')
    }
    q.delete('page') // reset pagination
    router.push(`/events?${q.toString()}`)
}

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
    e.preventDefault()
    applySearch()
    }
}

return (
    <div className="flex items-center space-x-2">
    <MagnifyingGlassIcon className="w-5 h-5 text-black" />
    <input
        type="text"
        placeholder="Search concerts"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        className="border border-gray-300 rounded px-2 py-1 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
    <button onClick={applySearch} className="focus:outline-none">
        <ChevronDownIcon className="w-4 h-4 text-black hover:text-blue-600 rotate-90" />
    </button>
    </div>
)
}

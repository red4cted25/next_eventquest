'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed')
      } else {
        router.push('/')
      }
    } catch {
      setError('Network error')
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-r from-[#0056B3] via-[#007BFF] to-[#0056B3] flex items-center justify-center px-4">
      <div className="max-w-[80vw] max-h-[80vh] w-full aspect-[1200/650] bg-white rounded-[10px] overflow-hidden flex shadow-2xl">
        {/* Left: image with overlay & text */}
        <div className="relative w-1/2 h-full">
          <img
            src="/images/login-bg.png"
            alt="Live events"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[rgba(46,46,46,0.76)]" />
          <div className="absolute inset-0 flex flex-col justify-start pt-12 px-12 z-10">
            <h1 className="text-[64px] font-bold text-[#00FFE0] mb-4">Welcome Back!</h1>
            <p className="text-white text-lg max-w-xs">
              Shop millions of live events, discover can’t-miss concerts, games, theatre and more — all with secure and effortless ticketing.
            </p>
            <div className="w-24 h-1 bg-[#00FFE0] mt-6" />
          </div>
        </div>

        {/* Right: form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-2 text-black">Log In</h2>
          <p className="text-gray-600 mb-8">
            If you don’t have an account,{' '}
            <a href="/signup" className="text-blue-600 underline">
              sign up here
            </a>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex">
              <button
                type="submit"
                className="ml-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
              >
                Log In
              </button>
            </div>
          </form>

          <p className="mt-auto text-xs text-gray-500">
            By continuing past this page, you agree to the Terms of Use and understand that information will be used as described in our Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  )
}
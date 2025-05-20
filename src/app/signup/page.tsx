'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords must match')
      return
    }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    })
    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}))
      setError(message || 'Signup failed')
    } else {
      router.push('/login')
    }
  }

  return (
    <>
      <main className="bg-gradient-to-tr from-[#0056B3] via-[#007BFF] to-[#0056B3] min-h-screen flex items-center justify-center">
      <div className="hidden md:flex max-w-[1200px] w-full aspect-[1200/650] bg-white rounded-[10px] overflow-hidden shadow-2xl">
          
          {/* Left: Image + dark overlay + copy */}
          <div className="relative w-1/2">
            <img
              src="/images/login-bg.png"
              alt="Crowd at a live event"
              className="object-cover w-full h-full scale-[1.1]"
            />
            <div className="absolute inset-0 bg-[#2E2E2E] opacity-[0.76]" />
            <div className="absolute inset-0 flex flex-col justify-start pt-16 px-12">
              <h1 className="text-[3rem] leading-tight text-[#5FFFE9] font-bold">
                Your All-Access Pass
              </h1>
              <p className="mt-4 text-white text-lg max-w-[80%]">
                This is it — millions of live events, up to the minute alerts for
                your favorite artists and teams and, of course, always safe,
                secure ticketing.
              </p>
              <span className="mt-6 block w-24 h-1 bg-[#5FFFE9] rounded" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-1/2 bg-white p-12 relative">
            <h2 className="text-4xl font-bold text-black">Sign Up</h2>
            <p className="mt-2 text-sm text-gray-600">
              If you do have an account,&nbsp;
              <a href="/login" className="text-[#007BFF] hover:underline">
                log in here
              </a>
              .
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col justify-start space-y-6"
            >
              {error && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="text-red-600 text-sm"
                >
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Retype Password
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  value={form.confirm}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#007BFF] hover:bg-[#0056B3] text-white rounded-full font-semibold transition"
                >
                  Register
                </button>
              </div>
            </form>

            <p className="absolute bottom-4 left-12 right-12 text-xs text-gray-500">
              By continuing past this page, you agree to the Terms of Use and
              understand that information will be used as described in our
              Privacy Policy.
            </p>
          </div>
        </div>

        {/* MOBILE SIGNUP */}
        <div className="block md:hidden w-full max-w-xs">
          <img
            src="/images/Person.png"
            alt="User icon"
            className="w-28 h-28 mx-auto mb-6"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-white mb-1 text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="
                  w-full
                  border-b border-white
                  bg-transparent
                  text-white placeholder-white
                  pb-2
                  focus:outline-none focus:border-[#007BFF]
                  transition
                "
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-white mb-1 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="
                  w-full
                  border-b border-white
                  bg-transparent
                  text-white placeholder-white
                  pb-2
                  focus:outline-none focus:border-[#007BFF]
                  transition
                "
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-white mb-1 text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full
                  border-b border-white
                  bg-transparent
                  text-white placeholder-white
                  pb-2
                  focus:outline-none focus:border-[#007BFF]
                  transition
                "
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-white mb-1 text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full
                  border-b border-white
                  bg-transparent
                  text-white placeholder-white
                  pb-2
                  focus:outline-none focus:border-[#007BFF]
                  transition
                "
                required
              />
            </div>

            <button
              type="submit"
              className="
                w-full
                bg-[#007BFF] hover:bg-[#0056B3]
                text-white py-3 rounded-full font-semibold
                transition
              "
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-white text-sm">
            Have an account?{' '}
            <a href="/login" className="underline">
              Sign in instead
            </a>
          </p>
        </div>

      </main>
    </>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const path = usePathname()
  if (path === '/login' || path === '/signup') {
    return null
  }
  return <Header />
}

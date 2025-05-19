// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt                       from 'bcryptjs'
import { connectToDatabase }       from '@backend/lib/mongodb'
import { User }                    from '@backend/models/User'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    await connectToDatabase()
    if (await User.findOne({ email })) {
      return NextResponse.json({ message: 'User exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({ name, email, password: hashed })
    return NextResponse.json({ message: 'Created', userId: user._id }, { status: 201 })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, source, leadMagnet } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        source: source || 'empire-tool',
        leadMagnet: leadMagnet || '',
        userGroup: 'Empire',
      }),
    })

    if (!response.ok) {
      throw new Error('Loops API error')
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

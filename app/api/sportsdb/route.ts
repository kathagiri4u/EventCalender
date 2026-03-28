import { NextRequest, NextResponse } from 'next/server'

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 })
  }

  const url = `${SPORTSDB_BASE}/${endpoint}`

  const res = await fetch(url, {
    next: { revalidate: 0 },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

import { NextRequest, NextResponse } from 'next/server'

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const sport = searchParams.get('sport')
  const dates = searchParams.get('dates')

  if (!sport) {
    return NextResponse.json({ error: 'Missing sport parameter' }, { status: 400 })
  }

  const url = new URL(`${ESPN_BASE}/${sport}/scoreboard`)
  if (dates) url.searchParams.set('dates', dates)
  url.searchParams.set('limit', '100')

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 }, // never cache — cron only
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.headers.get('x-revalidate-token')

  if (!process.env.REVALIDATE_SECRET || token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'layout')

  return NextResponse.json({
    revalidated: true,
    at: new Date().toISOString(),
  })
}

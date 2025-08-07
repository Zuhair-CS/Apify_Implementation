// src/app/api/actors/[id]/run/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const { apiKey, inputs } = await req.json()

    if (!apiKey || !inputs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = new ApifyClient({ token: apiKey })
    const run = await client.actor(id).call(inputs)
    const { items } = await client.dataset(run.defaultDatasetId!).listItems()

    return NextResponse.json({ result: items })
  } catch (err) {
    console.error('Actor run failed:', err)
    return NextResponse.json({ error: 'Actor run failed' }, { status: 500 })
  }
}
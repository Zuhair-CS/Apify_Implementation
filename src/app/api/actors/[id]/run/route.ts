import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { apiKey, inputs } = await req.json()

    if (!apiKey || !inputs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = new ApifyClient({ token: apiKey })
    const run = await client.actor(id).call(inputs)
    const { items } = await client.dataset(run.defaultDatasetId!).listItems()

    return NextResponse.json({ result: items })
  } catch (error) {
    console.error('Error running actor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
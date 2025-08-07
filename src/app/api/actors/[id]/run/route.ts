import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { apiKey, inputs } = body
    const {id} = await params;
    const actorId = id;

    if (!apiKey || !actorId || !inputs) {
      return NextResponse.json({ error: 'Missing apiKey, actorId, or inputs' }, { status: 400 })
    }

    const client = new ApifyClient({ token: apiKey })

    // Run the actor
    const run = await client.actor(actorId).call(inputs)

    // Fetch the results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return NextResponse.json({ result: items }, { status: 200 })
  } catch (error) {
    console.error('Error running actor:', error)
    return NextResponse.json({ error: 'Failed to run actor' }, { status: 500 })
  }
}

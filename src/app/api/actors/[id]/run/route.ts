import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const { apiKey, inputs } = await request.json()

    if (!apiKey || !id || !inputs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = new ApifyClient({ token: apiKey })

    const run = await client.actor(id).call(inputs)

    const { items: datasetItems } = await client.dataset(run.defaultDatasetId!).listItems()

    return NextResponse.json({ result: datasetItems })
  } catch (error) {
    console.error('Error running actor:', error)
    return NextResponse.json({ error: 'Failed to run actor' }, { status: 500 })
  }
}
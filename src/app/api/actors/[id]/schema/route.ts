import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;
    const { id } = await params;
    const actorId = id;

    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const client = new ApifyClient({ token: apiKey });

    // Ensure actor exists
    const actor = await client.actor(actorId).get();
    if (!actor) {
      return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
    }

    // Fetch version with type override for inputSchema
    type ActorVersionWithSchema = {
      inputSchema?: Record<string, any>;
    };

    const version = await client.actor(actorId).version('latest').get() as ActorVersionWithSchema;

    const inputSchema = version?.inputSchema || {
      type: 'object',
      properties: {},
    };

    return NextResponse.json({ schema: inputSchema });

  } catch (error) {
    console.error('Error fetching schema:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actor schema' },
      { status: 500 }
    );
  }
}

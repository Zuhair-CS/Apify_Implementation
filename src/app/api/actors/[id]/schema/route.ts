import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: actorId } = context.params;
    const { apiKey }: { apiKey: string } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const client = new ApifyClient({ token: apiKey });

    const actor = await client.actor(actorId).get();
    if (!actor) {
      return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
    }

    // Fix the 'any' with a more appropriate type
    interface InputSchema {
      type: string;
      properties: Record<string, unknown>;
      required?: string[];
    }

    const version = await client.actor(actorId).version('latest').get() as { inputSchema?: InputSchema };

    const inputSchema: InputSchema = version?.inputSchema || {
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

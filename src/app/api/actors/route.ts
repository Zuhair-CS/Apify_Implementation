import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: NextRequest) {
  try {
    const { apiKey }: { apiKey: string } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const client = new ApifyClient({ token: apiKey });
    const { items: actors } = await client.actors().list();

    const formattedActors = actors.map((actor) => ({
      id: actor.id,
      name: actor.name,
      title: actor.name,
      // @ts-expect-error: 'description' may not be typed in ActorCollectionListItem
      description: actor.description || 'No description available',
    }));

    return NextResponse.json({ actors: formattedActors });
  } catch (error) {
    console.error('Error fetching actors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actors' },
      { status: 500 }
    );
  }
}

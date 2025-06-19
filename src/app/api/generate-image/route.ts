import { NextRequest, NextResponse } from 'next/server';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt } = body;

  try {
    const replicateRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: { prompt },
      }),
    });
    const replicateData = await replicateRes.json();
    if (replicateData.status === 'succeeded' || replicateData.status === 'processing') {
      return NextResponse.json({ imageUrl: replicateData.output[0] });
    } else {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

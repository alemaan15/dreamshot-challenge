import { NextRequest, NextResponse } from 'next/server';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

async function uploadToReplicate(dataUrl: string): Promise<string> {
  const blob = await fetch(dataUrl).then(res => res.blob());

  const formData = new FormData();
  formData.append('file', blob);

  const uploadRes = await fetch('https://upload.replicate.delivery/push', {
    method: 'POST',
    body: formData,
  });

  const json = await uploadRes.json();
  return json.url;
}

export async function POST(req: NextRequest) {
  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'Missing Replicate token' }, { status: 500 });
  }

  const { prompt, baseImage, maskImage } = await req.json();

  if (!prompt || !baseImage || !maskImage) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const imageUrl = await uploadToReplicate(baseImage);
    const maskUrl = await uploadToReplicate(maskImage);

    const replicateRes = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-fill-dev/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait',
        },
        body: JSON.stringify({
          input: {
            image: imageUrl,
            mask: maskUrl,
            prompt,
          },
        }),
      }
    );

    const data = await replicateRes.json();

    if (data?.output?.[0]) {
      return NextResponse.json({ imageUrl: data.output[0] });
    }

    console.error('Replicate error:', data);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

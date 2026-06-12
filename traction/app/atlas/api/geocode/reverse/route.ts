import { NextRequest } from 'next/server';
import { getSession } from '@/lib/atlas-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return Response.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Atlas-Application-Server/1.0 (contact@atlas.local)',
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Geocoding service error' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Reverse geocode proxy error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

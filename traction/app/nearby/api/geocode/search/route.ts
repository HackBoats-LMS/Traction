import { NextRequest } from 'next/server';
import { getSession } from '@/lib/nearby-auth';
import { searchLocalIndianCities } from '@/lib/nearby-india-cities';

const cache = new Map<string, unknown>();

async function fetchWithRetry(url: string, headers: HeadersInit, retries = 3, delay = 350): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers });
      if (response.ok) return response;
      if (response.status === 429 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Failed after retries');
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return Response.json({ error: 'Search query is required' }, { status: 400 });
    }

    const cacheKey = q.trim().toLowerCase();
    if (cache.has(cacheKey)) {
      return Response.json(cache.get(cacheKey), {
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' }
      });
    }

    const localResults = searchLocalIndianCities(q);
    if (localResults.length > 0) {
      cache.set(cacheKey, localResults);
      return Response.json(localResults, {
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' }
      });
    }

    const response = await fetchWithRetry(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=5`,
      {
        'User-Agent': 'Nearby-Application-Server/1.0 (contact@nearby.local)',
        'Accept-Language': 'en',
      },
      3,
      350
    );

    if (!response.ok) {
      return Response.json({ error: 'Search geocoding service error' }, { status: response.status });
    }

    const data = await response.json();
    cache.set(cacheKey, data);
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' }
    });
  } catch (error) {
    console.error('Search geocode proxy error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
